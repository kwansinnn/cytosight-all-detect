import { Home, Search, Users, FileText, Info, Phone, BarChart3, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const IndexSidebar = () => {
  const { user } = useAuth();

  // Navigation items for authenticated users
  const authenticatedItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Analysis",
      url: "#",
      icon: Search,
    },
    {
      title: "Collaboration",
      url: "/collaboration",
      icon: Users,
    },
    {
      title: "Reports",
      url: "#",
      icon: FileText,
    },
    {
      title: "History",
      url: "#",
      icon: Clock,
    },
  ];

  // Navigation items for non-authenticated users
  const publicItems = [
    {
      title: "About",
      url: "#",
      icon: Info,
    },
    {
      title: "Contact",
      url: "#",
      icon: Phone,
    },
  ];

  const items = user ? authenticatedItems : publicItems;

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {user ? "Platform" : "Information"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default IndexSidebar;