import mongoose, { Schema, Types } from "mongoose";

export interface IFolder {
    _id?: mongoose.Types.ObjectId;
    name: string;
    description?: string;
    icon?: string;
    createdBy?: Types.ObjectId;

    parentFolder?: Types.ObjectId;
    subFolders?: Types.ObjectId[];
    bookmarks?: Types.ObjectId[];

    sharedWith?: Types.ObjectId[];
    isFavoriteBy?: Types.ObjectId[];
}

const folderSchema = new Schema<IFolder>(
    {
        name: { type: String, required: true },
        description: { type: String },
        icon: { type: String },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        parentFolder: { type: Schema.Types.ObjectId, ref: "Folder" },
        sharedWith: [{ type: Schema.Types.ObjectId, ref: "User" }],
        isFavoriteBy: [{ type: Schema.Types.ObjectId, ref: "User" }],

        // ✅ Relations with folder itself and bookmarks
        subFolders: [{ type: Schema.Types.ObjectId, ref: "Folder" }],
        bookmarks: [{ type: Schema.Types.ObjectId, ref: "Bookmark" }],
    },
    { timestamps: true }
);

export default mongoose.models.Folder || mongoose.model<IFolder>("Folder", folderSchema);
