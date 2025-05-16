
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  FolderIcon, 
  SearchIcon, 
  PlusIcon, 
  FileTextIcon,
  ShieldIcon,
  DatabaseIcon,
  NetworkIcon,
  UsersIcon,
  AlertTriangleIcon,
  SettingsIcon,
  ChevronLeftIcon,
  ChevronRightIcon 
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const categories = [
    { name: "All Policies", icon: FolderIcon },
    { name: "Access Control", icon: ShieldIcon },
    { name: "Data Classification", icon: DatabaseIcon },
    { name: "Network Security", icon: NetworkIcon },
    { name: "User Account", icon: UsersIcon },
    { name: "Incident Handling", icon: AlertTriangleIcon },
  ];

  return (
    <div className={cn(
      "flex flex-col h-screen bg-white border-r transition-all duration-300 overflow-hidden",
      collapsed ? "w-16" : "w-64",
      className
    )}>
      <div className="flex items-center p-4 h-16">
        {!collapsed && (
          <h2 className="text-xl font-semibold text-primary flex items-center">
            <ShieldIcon className="mr-2 h-6 w-6" /> SecPolicy
          </h2>
        )}
        {collapsed && <ShieldIcon className="h-6 w-6 text-primary mx-auto" />}
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn("ml-auto", collapsed && "mx-auto")}
          onClick={toggleSidebar}
        >
          {collapsed ? <ChevronRightIcon className="h-5 w-5" /> : <ChevronLeftIcon className="h-5 w-5" />}
        </Button>
      </div>
      
      <Separator />
      
      <div className="flex flex-col gap-1 p-2">
        <Button variant="ghost" className={cn(
          "flex justify-start items-center gap-2",
          collapsed && "justify-center p-2"
        )}>
          <SearchIcon className="h-5 w-5" />
          {!collapsed && <span>Search</span>}
        </Button>
        
        <Button variant="ghost" className={cn(
          "flex justify-start items-center gap-2",
          collapsed && "justify-center p-2"
        )}>
          <PlusIcon className="h-5 w-5" />
          {!collapsed && <span>New Policy</span>}
        </Button>
      </div>
      
      <Separator className="my-2" />
      
      <div className="flex-1 overflow-auto">
        <div className={cn("px-3 text-sm font-medium text-muted-foreground", collapsed && "text-center")}>
          {!collapsed && "Categories"}
        </div>
        <div className="mt-2 space-y-1 px-2">
          {categories.map((category) => (
            <Button
              key={category.name}
              variant="ghost"
              className={cn(
                "w-full justify-start",
                collapsed && "justify-center p-2"
              )}
            >
              <category.icon className="h-5 w-5 mr-2" />
              {!collapsed && <span>{category.name}</span>}
            </Button>
          ))}
        </div>
      </div>
      
      <Separator className="my-2" />
      
      <div className="p-2">
        <Button variant="ghost" className={cn(
          "w-full justify-start",
          collapsed && "justify-center p-2"
        )}>
          <SettingsIcon className="h-5 w-5 mr-2" />
          {!collapsed && <span>Settings</span>}
        </Button>
      </div>
    </div>
  );
}
