import { BookmarkData } from "@/types";

export const mockData: BookmarkData = {
  folders: [
    {
      id: '1',
      name: 'Development',
      description: 'Programming resources and tools',
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Design',
      description: 'UI/UX and design inspiration',
      createdAt: new Date('2024-01-16')
    },
    {
      id: '3',
      name: 'News',
      description: 'Tech news and articles',
      createdAt: new Date('2024-01-17')
    },
    {
      id: '4',
      name: 'Frontend',
      description: 'Frontend development resources',
      parentId: '1',
      createdAt: new Date('2024-01-18')
    },
    {
      id: '5',
      name: 'Backend',
      description: 'Backend development resources',
      parentId: '1',
      createdAt: new Date('2024-01-19')
    }
  ],
  bookmarks: [
    {
      id: '1',
      title: 'React Documentation',
      url: 'https://react.dev',
      description: 'Official React documentation',
      favicon: '⚛️',
      folderId: '4',
      createdAt: new Date('2024-01-20')
    },
    {
      id: '2',
      title: 'Tailwind CSS',
      url: 'https://tailwindcss.com',
      description: 'Utility-first CSS framework',
      favicon: '🎨',
      folderId: '4',
      createdAt: new Date('2024-01-21')
    },
    {
      id: '3',
      title: 'Node.js',
      url: 'https://nodejs.org',
      description: 'JavaScript runtime environment',
      favicon: '🟢',
      folderId: '5',
      createdAt: new Date('2024-01-22')
    },
    {
      id: '4',
      title: 'GitHub',
      url: 'https://github.com',
      description: 'Code hosting platform',
      favicon: '🐙',
      createdAt: new Date('2024-01-23')
    },
    {
      id: '5',
      title: 'Figma',
      url: 'https://figma.com',
      description: 'Design and prototyping tool',
      favicon: '🎯',
      folderId: '2',
      createdAt: new Date('2024-01-24')
    },
    {
      id: '6',
      title: 'TechCrunch',
      url: 'https://techcrunch.com',
      description: 'Technology news and analysis',
      favicon: '📰',
      folderId: '3',
      createdAt: new Date('2024-01-25')
    }
  ]
};