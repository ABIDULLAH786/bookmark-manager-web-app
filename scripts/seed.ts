// scripts/seed.ts
import mongoose from "mongoose";
import Folder from "@/models/folder.model";
import Bookmark from "@/models/bookmark.model";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/db";
import { USER_ID } from "@/constants";

async function seed() {
  await connectToDatabase();

  const userId = new mongoose.Types.ObjectId(USER_ID);

  console.log("🌱 Clearing existing data...");
  await Folder.deleteMany({});
  await Bookmark.deleteMany({});

  console.log("📁 Creating folders...");
  const folders = await Folder.insertMany([
    {
      name: "Development",
      description: "Programming resources and tools",
      createdBy: userId,
      createdAt: new Date("2024-01-15"),
    },
    {
      name: "Design",
      description: "UI/UX and design inspiration",
      createdBy: userId,
      createdAt: new Date("2024-01-16"),
    },
    {
      name: "News",
      description: "Tech news and articles",
      createdBy: userId,
      createdAt: new Date("2024-01-17"),
    },
    {
      name: "Frontend",
      description: "Frontend development resources",
      parentFolder: undefined, // will update later
      createdBy: userId,
      createdAt: new Date("2024-01-18"),
    },
    {
      name: "Backend",
      description: "Backend development resources",
      parentFolder: undefined, // will update later
      createdBy: userId,
      createdAt: new Date("2024-01-19"),
    },
  ]);

  // Map folder names to IDs for bookmarks
  const folderMap = Object.fromEntries(folders.map(f => [f.name, f._id]));

  // Update parent relationships
  await Folder.updateMany(
    { name: { $in: ["Frontend", "Backend"] } },
    { $set: { parentFolder: folderMap["Development"] } }
  );

  console.log("🔖 Creating bookmarks...");
  await Bookmark.insertMany([
    {
      title: "React Documentation",
      url: "https://react.dev",
      description: "Official React documentation",
      icon: "⚛️",
      createdBy: userId,
      parentFolder: folderMap["Frontend"],
      createdAt: new Date("2024-01-20"),
    },
    {
      title: "Tailwind CSS",
      url: "https://tailwindcss.com",
      description: "Utility-first CSS framework",
      icon: "🎨",
      createdBy: userId,
      parentFolder: folderMap["Frontend"],
      createdAt: new Date("2024-01-21"),
    },
    {
      title: "Node.js",
      url: "https://nodejs.org",
      description: "JavaScript runtime environment",
      icon: "🟢",
      createdBy: userId,
      parentFolder: folderMap["Backend"],
      createdAt: new Date("2024-01-22"),
    },
    {
      title: "GitHub",
      url: "https://github.com",
      description: "Code hosting platform",
      icon: "🐙",
      createdBy: userId,
      createdAt: new Date("2024-01-23"),
    },
    {
      title: "Figma",
      url: "https://figma.com",
      description: "Design and prototyping tool",
      icon: "🎯",
      createdBy: userId,
      parentFolder: folderMap["Design"],
      createdAt: new Date("2024-01-24"),
    },
    {
      title: "TechCrunch",
      url: "https://techcrunch.com",
      description: "Technology news and analysis",
      icon: "📰",
      createdBy: userId,
      parentFolder: folderMap["News"],
      createdAt: new Date("2024-01-25"),
    },
  ]);

  console.log("✅ Seeding completed successfully!");
  mongoose.connection.close();
}

seed().catch((err) => {
  console.error("❌ Seeding error:", err);
  mongoose.connection.close();
});
