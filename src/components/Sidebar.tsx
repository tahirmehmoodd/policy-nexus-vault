
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  FolderIcon,
  SearchIcon,
  PlusIcon,
  ShieldIcon,
  DatabaseIcon,
  NetworkIcon,
  UsersIcon,
  AlertTriangleIcon,
  SettingsIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LayoutDashboardIcon,
  BookOpenIcon,
  BarChartIcon
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface SidebarProps {
  className?: string;
  onCategoryChange: (category: string) => void;
  onNewPolicyClick: () => void;
  activeCategory: string;
}

export function Sidebar({ className, onCategoryChange, onNewPolicyClick, activeCategory }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { toast } = useToast();
  
  // Check if we should collapse sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const categories = [
    { id: "all", name: "All Policies", icon: FolderIcon },
    { id: "access", name: "Access Control", icon: ShieldIcon },
    { id: "data", name: "Data Classification", icon: DatabaseIcon },
    { id: "network", name: "Network Security", icon: NetworkIcon },
    { id: "user", name: "User Account", icon: UsersIcon },
    { id: "incident", name: "Incident Handling", icon: AlertTriangleIcon },
  ];
  
  const handleSettingsClick = () => {
    toast({
      title: "Settings",
      description: "Settings functionality will be available in the next update.",
    });
  };
  
  const handleReportClick = () => {
    toast({
      title: "Reports",
      description: "Reporting functionality will be available in the next update.",
    });
  };

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
        <Button 
          variant="ghost" 
          className={cn(
            "flex justify-start items-center gap-2",
            collapsed && "justify-center p-2"
          )}
          onClick={() => {
            toast({
              title: "Search",
              description: "Use the search bar at the top of the page to find policies.",
            });
          }}
        >
          <SearchIcon className="h-5 w-5" />
          {!collapsed && <span>Search</span>}
        </Button>
        
        <Button 
          variant="ghost" 
          className={cn(
            "flex justify-start items-center gap-2",
            collapsed && "justify-center p-2"
          )}
          onClick={onNewPolicyClick}
        >
          <PlusIcon className="h-5 w-5" />
          {!collapsed && <span>New Policy</span>}
        </Button>
        
        <Button 
          variant="ghost" 
          className={cn(
            "flex justify-start items-center gap-2",
            collapsed && "justify-center p-2"
          )}
          onClick={handleReportClick}
        >
          <BarChartIcon className="h-5 w-5" />
          {!collapsed && <span>Reports</span>}
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
              key={category.id}
              variant="ghost"
              className={cn(
                "w-full justify-start",
                collapsed && "justify-center p-2",
                activeCategory === category.id && "bg-primary/10 text-primary font-medium"
              )}
              onClick={() => onCategoryChange(category.id)}
            >
              <category.icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-2")} />
              {!collapsed && <span>{category.name}</span>}
            </Button>
          ))}
        </div>
      </div>
      
      <Separator className="my-2" />
      
      <div className="p-2 space-y-1">
        <Button 
          variant="ghost" 
          className={cn(
            "w-full justify-start",
            collapsed && "justify-center p-2"
          )}
          onClick={() => {
            toast({
              title: "Documentation",
              description: "Documentation will be available in the next update.",
            });
          }}
        >
          <BookOpenIcon className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-2")} />
          {!collapsed && <span>Documentation</span>}
        </Button>
        
        <Button 
          variant="ghost" 
          className={cn(
            "w-full justify-start",
            collapsed && "justify-center p-2"
          )}
          onClick={handleSettingsClick}
        >
          <SettingsIcon className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-2")} />
          {!collapsed && <span>Settings</span>}
        </Button>
      </div>
    </div>
  );
}
