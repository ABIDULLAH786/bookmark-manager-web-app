import mongoose, { Schema, Types } from "mongoose";

export interface IFolderModle {
    _id?: mongoose.Types.ObjectId;
    name: string;
    description?: string;
    icon?: string;
    createdBy?: Types.ObjectId;

    parentFolder?: Types.ObjectId;
    subFolders?: Types.ObjectId[];
    bookmarks?: Types.ObjectId[];

    hasBookmarksBar?: boolean;

    sharedWith?: Types.ObjectId[];
    isFavoriteBy?: Types.ObjectId[];
}

const FolderSchema = new Schema<IFolderModle>(
    {
        name: { type: String, required: true },
        description: { type: String },
        icon: { type: String },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        parentFolder: { type: Schema.Types.ObjectId, ref: "Folder" },
        sharedWith: [{ type: Schema.Types.ObjectId, ref: "User" }],
        isFavoriteBy: [{ type: Schema.Types.ObjectId, ref: "User" }],

        hasBookmarksBar: { type: Boolean, default: false },
        
        // ✅ Relations with folder itself and bookmarks
        subFolders: [{ type: Schema.Types.ObjectId, ref: "Folder" }],
        bookmarks: [{ type: Schema.Types.ObjectId, ref: "Bookmark" }],
    },
    { timestamps: true }
);

const FolderModel =  mongoose.models.Folder || mongoose.model<IFolderModle>("Folder", FolderSchema);

export default FolderModel;