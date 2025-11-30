# Bookmark Manager App - Project Context

## Project Overview
I'm working on a modern, responsive Bookmark Manager App built with React/Next.js. The application allows users to organize bookmarks in a hierarchical folder structure with support for nested folders, light/dark mode theming, and a clean, minimal design.

## Technical Stack
- **Framework**: React with Next.js App Router
- **Styling**: TailwindCSS v4
- **UI Components**: shadcn/ui (built on Radix UI primitives)
- **Icons**: lucide-react
- **TypeScript**: Full type safety throughout the application
- **State Management**: React hooks (useState, useEffect)

## Core Features

### 1. Homepage View
- Grid layout displaying folders and bookmarks
- Folder cards with icons and folder names
- Bookmark cards showing:
  - Title
  - Favicon (with fallback)
  - URL
- Add (+) buttons as cards in the grid for creating new folders and bookmarks
- Responsive grid that adapts to mobile and desktop

### 2. Folder View
- **Left Sidebar**: Folder tree with nested folder structure
  - Expand/collapse functionality for nested folders
  - Visual hierarchy showing parent-child relationships
  - Clickable folders to navigate between views
- **Main Area**: Split into two sections
  - Subfolders section (top)
  - Bookmarks section (bottom)
- Breadcrumb navigation showing current folder path
- Add buttons for new folders and bookmarks within the folder

### 3. Add Folder Modal
- Title field (required)
- Description field (optional)
- Parent folder selection (when adding from within a folder)
- Form validation
- Cancel and Create buttons

### 4. Add Bookmark Modal
- Title field (required)
- URL field (required)
- Description field (optional)
- Folder selection (assign bookmark to a folder)
- Form validation
- Cancel and Create buttons

### 5. Theme System
- Light/dark mode toggle
- Persisted theme preference
- Smooth transitions between themes
- Theme-aware color scheme using CSS custom properties

## Project Structure

```
├── App.tsx                          # Main app component (root)
├── app/
│   ├── globals.css                  # Tailwind v4 global styles
│   └── page.tsx                     # Next.js app router page
├── components/
│   ├── Header.tsx                   # Top navigation with title and theme toggle
│   ├── Homepage.tsx                 # Main homepage view with grid layout
│   ├── FolderView.tsx              # Folder detail view with sidebar
│   ├── FolderTree.tsx              # Recursive folder tree component
│   ├── FolderCard.tsx              # Individual folder card
│   ├── BookmarkCard.tsx            # Individual bookmark card
│   ├── AddCard.tsx                 # Reusable "+" add button card
│   ├── AddFolderModal.tsx          # Modal for creating folders
│   ├── AddBookmarkModal.tsx        # Modal for creating bookmarks
│   ├── ThemeToggle.tsx             # Light/dark mode toggle button
│   └── ui/                         # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── textarea.tsx
│       ├── scroll-area.tsx
│       └── [other shadcn components]
├── types/
│   └── index.ts                    # TypeScript type definitions
├── data/
│   └── mockData.ts                 # Sample folders and bookmarks
└── styles/
    └── globals.css                 # Additional global styles
```

## Key Type Definitions

```typescript
// Bookmark interface
interface Bookmark {
  id: string;
  title: string;
  url: string;
  description?: string;
  favicon?: string;
  folderId: string | null;
  createdAt: Date;
}

// Folder interface
interface Folder {
  id: string;
  name: string;
  description?: string;
  parentId: string | null;
  createdAt: Date;
}
```

## Current State Management
- All data is managed in the main `App.tsx` component
- State includes:
  - `folders`: Array of all folders
  - `bookmarks`: Array of all bookmarks
  - `currentFolderId`: Currently selected folder (null for homepage)
  - `theme`: Current theme ('light' or 'dark')
- CRUD operations implemented as handler functions passed down via props

## Design Patterns & Architecture

### Component Hierarchy
```
App.tsx
├── Header (theme toggle)
└── Conditional rendering:
    ├── Homepage (when currentFolderId is null)
    │   ├── FolderCard (for each root folder)
    │   ├── BookmarkCard (for each root bookmark)
    │   └── AddCard (for new folder/bookmark)
    └── FolderView (when folder is selected)
        ├── FolderTree (in sidebar)
        └── Content area
            ├── Subfolders section
            └── Bookmarks section
```

### Data Flow
1. User interactions trigger handlers in App.tsx
2. State updates cause re-renders
3. Updated data flows down to child components via props
4. Currently uses mock data (ready for backend integration)

## Styling Approach
- **TailwindCSS v4**: Using @import and custom properties
- **No custom font classes**: Typography defined in globals.css
- **Responsive design**: Mobile-first approach with breakpoints
- **Theme variables**: CSS custom properties for colors
- **shadcn/ui**: Pre-built accessible components with consistent styling

## Key Features to Understand

### Nested Folder Structure
- Folders can contain subFolders (unlimited nesting)
- `parentId` field determines hierarchy
- Recursive rendering in FolderTree component
- Breadcrumb navigation shows current path

### Modal System
- Uses shadcn/ui Dialog component
- Controlled open/close state
- Form validation before submission
- Callbacks to parent component for data updates

### Theme Persistence
- localStorage saves user preference
- Applies theme class to document root
- CSS custom properties change based on theme class

## Common Tasks & Questions

When working on this project, I may ask for help with:
- Adding new features (search, tags, favorites, etc.)
- Implementing backend integration (API calls, database)
- Improving UI/UX (animations, transitions, drag-and-drop)
- Bug fixes or optimization
- Testing and validation
- Responsive design improvements
- Accessibility enhancements
- Export/import functionality
- Multi-select and bulk operations

## Development Context
- The app is fully functional with mock data
- All components are implemented
- Dependencies are specified but may need installation
- Ready for testing and further development
- No backend integration yet (uses local state)

## Next Steps (Potential)
Based on where the project is, typical next steps might include:
1. Backend integration (REST API, GraphQL, or Supabase)
2. Data persistence (localStorage, IndexedDB, or cloud)
3. Advanced features (search, filtering, sorting, tags)
4. Drag-and-drop for organizing bookmarks
5. Import/export functionality
6. Browser extension integration
7. User authentication and multi-user support
8. Performance optimization for large datasets

---

## How to Use This Context

When starting a conversation with an AI assistant about this project:

1. **Share this entire context** at the beginning of the conversation
2. **Specify the specific file or component** you're working on if relevant
3. **Describe what you want to achieve** or what problem you're facing
4. **Mention any constraints** (e.g., must use existing shadcn components, maintain current architecture)
5. **Ask for specific help** (code review, feature implementation, bug fix, etc.)

### Example conversation starters:

**For adding a feature:**
"I'm working on the Bookmark Manager App (context provided above). I want to add a search functionality that filters bookmarks and folders in real-time as the user types. The search should work on both the homepage and within folder views. How should I implement this?"

**For bug fixes:**
"In my Bookmark Manager App (context above), I'm experiencing an issue where the folder tree doesn't update when I add a new nested folder. Can you help me debug this?"

**For improvements:**
"Looking at my Bookmark Manager App architecture (context provided), I want to add drag-and-drop functionality so users can reorganize bookmarks and move them between folders. What's the best approach given my current component structure?"

**For backend integration:**
"I want to integrate my Bookmark Manager App (context above) with Supabase for data persistence and user authentication. How should I refactor the current local state management to work with Supabase?"

---

This context document provides a complete overview of the project. Feel free to reference specific sections when asking questions!
