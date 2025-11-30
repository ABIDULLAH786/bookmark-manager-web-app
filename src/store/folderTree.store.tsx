import { IFolderTreeClient } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TreeFoldersState {
    foldersTree: IFolderTreeClient[];
  setFoldersTree: (tree: IFolderTreeClient[]) => void;
  addFolderToTree: (folder: IFolderTreeClient) => void;
  removeFolderFromTree: (id: string) => void;
  updateFolderInTree: (folder: Partial<IFolderTreeClient>) => void;
}
export const useFoldersTreeStore = create<TreeFoldersState>()(
    persist(
        (set) => ({
           // ------------------------------------------------
      // 3. Tree Structure Logic (Sidebar)
      // ------------------------------------------------
      foldersTree: [],
      
      setFoldersTree: (tree) => set({ foldersTree: tree }),
      
      addFolderToTree: (folder) => set((state) => ({
        foldersTree: addNodeToTree(state.foldersTree, folder)
      })),

      removeFolderFromTree: (id) => set((state) => ({
        foldersTree: removeNodeFromTree(state.foldersTree, id)
      })),

      updateFolderInTree: (folder) => set((state) => ({
        foldersTree: updateNodeInTree(state.foldersTree, folder)
      })),
        }),
        {
            name: "folderTree", // name of the item in the storage (must be unique)
        }
    )
);


// --- Recursive Helper Functions ---

// 1. Add: Finds the parent and pushes the new node, or adds to root
const addNodeToTree = (nodes: IFolderTreeClient[], newFolder: IFolderTreeClient): IFolderTreeClient[] => {
  // Case A: It's a root folder (no parent)
  if (!newFolder.parentFolder) {
    return [...nodes, { ...newFolder, children: [] }];
  }

  // Case B: It's a child folder, find the parent recursively
  return nodes.map((node) => {
    // Found the parent? Add to its children
    if (node._id === newFolder.parentFolder) {
      return { 
        ...node, 
        children: [...(node.children || []), { ...newFolder, children: [] }] 
      };
    }
    // Has children? Search deeper
    if (node.children && node.children.length > 0) {
      return { ...node, children: addNodeToTree(node.children, newFolder) };
    }
    return node;
  });
};

// 2. Remove: Recursively filters out the node by ID
const removeNodeFromTree = (nodes: IFolderTreeClient[], id: string): IFolderTreeClient[] => {
  return nodes
    .filter((node) => node._id !== id) // Remove from current level
    .map((node) => ({
      ...node,
      children: node.children ? removeNodeFromTree(node.children, id) : [], // Search deeper
    }));
};

// 3. Update: Recursively finds the node and updates properties
const updateNodeInTree = (nodes: IFolderTreeClient[], updatedFolder: Partial<IFolderTreeClient>): IFolderTreeClient[] => {
  return nodes.map((node) => {
    // Found the node? Update it, but PRESERVE its existing children
    if (node._id === updatedFolder._id) {
      return { 
        ...node, 
        ...updatedFolder, 
        children: node.children // Important: Don't overwrite children with empty array from API
      }; 
    }
    // Has children? Search deeper
    if (node.children && node.children.length > 0) {
      return { ...node, children: updateNodeInTree(node.children, updatedFolder) };
    }
    return node;
  });
};