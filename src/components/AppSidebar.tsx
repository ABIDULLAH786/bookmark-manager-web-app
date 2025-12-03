import { Calendar, Inbox, Search, Settings, Home } from "lucide-react"
import FolderTree from "@/components/FolderTree" // Adjust path as needed

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Static Menu items.
const items = [
  { title: "Inbox", url: "#", icon: Inbox },
  { title: "Calendar", url: "#", icon: Calendar },
  { title: "Search", url: "#", icon: Search },
  { title: "Settings", url: "#", icon: Settings },
]

export function AppSidebar() {
  return (
    <Sidebar variant="sidebar">
      <SidebarContent>
        {/* Group 1: Dynamic Folders */}
        <SidebarGroup>
          {/* <SidebarGroupLabel>My Folders</SidebarGroupLabel> */}
          <SidebarGroupContent>
            {/* We pass the FolderTree here */}
            <FolderTree /> 
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
    </Sidebar>
  )
}