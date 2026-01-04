# Bookmark Manager App - Project Context

## Project Overview
A modern, responsive Bookmark Manager App built with React/Next.js. The application allows users to organize bookmarks in a hierarchical folder structure with support for nested folders, light/dark mode theming, and a clean, minimal design.

## Technical Stack
- **Framework**: React with Next.js App Router
- **Styling**: TailwindCSS v4
- **UI Components**: shadcn/ui (built on Radix UI primitives)
- **Icons**: lucide-react
- **TypeScript**: Full type safety throughout the application
- **State Management**: Zustand
- **API Tool**: SWR

## Core Features

### 1. Dahsboard Homepage View
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

## Design Patterns & Architecture


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

## Next Steps
Existing Feature or currently implemented features

1. Backend integration (REST API, GraphQL, or Supabase)
2. Data persistence (localStorage)
3. Import/export functionality
4. User authentication and multi-user support

## Next Steps (Potential)
Based on where the project is, typical next steps might include:

1. Improving UI/UX (animations, transitions, drag-and-drop)
2. Advanced features (search, filtering, sorting, tags)
3. Drag-and-drop for organizing bookmarks
4. Browser extension integration
5. Performance optimization for large datasets
6. Multi-select and bulk operations
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







<!-- DOAMINS:
Markd.io
    Qeep.it 
    LinkBin.io
    SecondBrain.dev
    ClipIt.so
    MarkThis.dev
    SaveIt.cc
    SnapUrl.io
    KeepTabs.app


    Note: Since .com names are hard to get, looking for .io, .app, or .dev domains usually gives you better names that are actually available.


    => Here are 20+ new suggestions categorized by the specific "vibe" of your favorites:

    1. The "Quick Capture" Vibe
        Similar to: ClipIt, SnapUrl, MarkThis Focus: Fast, efficient, immediate.
        SnipLink.io (Sharp, precise)
        GrabIt.dev (Action-oriented)
        PinWeb.so (Classic "pinning" metaphor)
        TagUrl.app (Simple and organized)
        PickLink.io
        CutPaste.dev (A nod to developer habits)

    2. The "Storage Container" Vibe
    Similar to: LinkBin, SaveIt, Qeep Focus: A dedicated place to dump/store things.
        LinkBucket.io (Casual, easy to "toss" things into)
        WebDepot.dev (Feels industrial and reliable)
        UrlJar.app (Simple, contained)
        StashBase.io (Developer-friendly term "Stash")
        https://www.google.com/search?q=StackUrl.com (Refers to the "Tech Stack")
        CodeCloset.dev (If you want to lean heavily into the dev angle)

    3. The "Smart/Memory" Vibe
    Similar to: SecondBrain, KeepTabs Focus: Enhancing your mind and organization.
        BrainBase.app (Alliterative, strong)
        MindExtend.io (Literal "Second Brain" meaning)
        Recall.dev (Simple, powerful)
        Memry.so (Short for Memory, trendy spelling)
        TabVault.io (Direct alternative to KeepTabs)
        WebMind.cc

    4. Short & Phonetic (SaaS Style)
    Similar to: Qeep.it Focus: Unique spelling, brandable.
        Stord.io (Stored)
        Lynk.dev (Link)
        Kapture.app (Capture)
        SyncIt.so
        Vult.io (Vault)
 -->
