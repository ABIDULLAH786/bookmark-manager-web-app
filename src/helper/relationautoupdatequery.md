// When creating a subfolder
await Folder.create({ name: "Work", parentFolder: parentId, createdBy: userId });
await Folder.findByIdAndUpdate(parentId, { $push: { subFolders: newFolder._id } });

// When adding a bookmark
await Bookmark.create({ title, link, parentFolder: folderId, createdBy: userId });
await Folder.findByIdAndUpdate(folderId, { $push: { bookmarks: newBookmark._id } });
