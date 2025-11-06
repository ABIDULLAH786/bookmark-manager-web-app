import mongoose, { Schema, Types } from "mongoose";

export interface IBookmark {
    _id?: mongoose.Types.ObjectId;
    title: string;
    url: string;
    description?: string;
    icon?: string;
    createdBy: Types.ObjectId;
    parentFolder?: Types.ObjectId;
    sharedWith?: Types.ObjectId[];
    isFavoriteBy?: Types.ObjectId[];
}

const bookmarkSchema = new Schema<IBookmark>(
    {
        title: { type: String, required: true },
        url: { type: String, required: true },
        description: { type: String },
        icon: { type: String },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        parentFolder: { type: Schema.Types.ObjectId, ref: "Folder" },
        sharedWith: [{ type: Schema.Types.ObjectId, ref: "User" }],
        isFavoriteBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true }
);

export default mongoose.models.Bookmark ||
    mongoose.model<IBookmark>("Bookmark", bookmarkSchema);
