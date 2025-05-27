
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
  BookOpenIcon,
  BarChartIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BuildingIcon,
  ComputerIcon,
  ClipboardIcon
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { FRAMEWORK_CATEGORIES } from "@/types/policy";
import { Policy } from "@/types/policy";

interface SidebarProps {
  className?: string;
  onCategoryChange: (category: string) => void;
  onNewPolicyClick: () => void;
  activeCategory: string;
  policies: Policy[];
}

export function Sidebar({ className, onCategoryChange, onNewPolicyClick, activeCategory, policies }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedFrameworks, setExpandedFrameworks] = useState<string[]>(['technical']);
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

  const toggleFramework = (framework: string) => {
    setExpandedFrameworks(prev => 
      prev.includes(framework) 
        ? prev.filter(f => f !== framework)
        : [...prev, framework]
    );
  };

  // Count policies by framework category
  const getPolicyCount = (category: string) => {
    if (category === 'all') return policies.length;
    return policies.filter(p => p.framework_category === category).length;
  };

  // Count policies by domain
  const getDomainPolicyCount = (category: string, domain: string) => {
    return policies.filter(p => 
      p.framework_category === category && 
      (p.security_domain === domain || p.type === domain)
    ).length;
  };

  const frameworkIcons = {
    physical: BuildingIcon,
    technical: ComputerIcon,
    organizational: ClipboardIcon
  };
  
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
      collapsed ? "w-16" : "w-80",
      className
    )}>
      <div className="flex items-center p-4 h-16">
        {!collapsed && (
          <h2 className="text-xl font-semibold text-primary flex items-center">
            <ShieldIcon className="mr-2 h-6 w-6" /> SecPolicy Repository
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
        {!collapsed && (
          <div className="px-3 text-sm font-medium text-muted-foreground mb-2">
            Security Framework Categories
          </div>
        )}
        
        <div className="px-2 space-y-1">
          {/* All Policies */}
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start",
              collapsed && "justify-center p-2",
              activeCategory === "all" && "bg-primary/10 text-primary font-medium"
            )}
            onClick={() => onCategoryChange("all")}
          >
            <FolderIcon className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-2")} />
            {!collapsed && (
              <div className="flex justify-between items-center w-full">
                <span>All Policies</span>
                <Badge variant="outline" className="ml-2">
                  {getPolicyCount('all')}
                </Badge>
              </div>
            )}
          </Button>

          {/* Framework Categories */}
          {Object.entries(FRAMEWORK_CATEGORIES).map(([key, category]) => {
            const IconComponent = frameworkIcons[key as keyof typeof frameworkIcons];
            const isExpanded = expandedFrameworks.includes(key);
            const policyCount = getPolicyCount(key);
            
            if (collapsed) {
              return (
                <Button
                  key={key}
                  variant="ghost"
                  className={cn(
                    "w-full justify-center p-2",
                    activeCategory === key && "bg-primary/10 text-primary font-medium"
                  )}
                  onClick={() => onCategoryChange(key)}
                >
                  <IconComponent className="h-5 w-5 mx-auto" />
                </Button>
              );
            }

            return (
              <div key={key} className="space-y-1">
                <Collapsible open={isExpanded} onOpenChange={() => toggleFramework(key)}>
                  <div className="flex">
                    <Button
                      variant="ghost"
                      className={cn(
                        "flex-1 justify-start",
                        activeCategory === key && "bg-primary/10 text-primary font-medium"
                      )}
                      onClick={() => onCategoryChange(key)}
                    >
                      <IconComponent className="h-5 w-5 mr-2" />
                      <div className="flex justify-between items-center w-full">
                        <span className="text-sm">{category.name}</span>
                        <Badge variant="outline" className="ml-2">
                          {policyCount}
                        </Badge>
                      </div>
                    </Button>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="icon" className="w-8 h-8">
                        {isExpanded ? 
                          <ChevronUpIcon className="h-4 w-4" /> : 
                          <ChevronDownIcon className="h-4 w-4" />
                        }
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  
                  <CollapsibleContent className="ml-4 space-y-1">
                    {category.domains.map(domain => {
                      const domainCount = getDomainPolicyCount(key, domain);
                      return (
                        <Button
                          key={domain}
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "w-full justify-start text-xs",
                            activeCategory === `${key}-${domain.toLowerCase().replace(/\s+/g, '-')}` && 
                            "bg-primary/5 text-primary"
                          )}
                          onClick={() => onCategoryChange(`${key}-${domain.toLowerCase().replace(/\s+/g, '-')}`)}
                        >
                          <div className="flex justify-between items-center w-full">
                            <span>{domain}</span>
                            {domainCount > 0 && (
                              <Badge variant="outline" size="sm">
                                {domainCount}
                              </Badge>
                            )}
                          </div>
                        </Button>
                      );
                    })}
                  </CollapsibleContent>
                </Collapsible>
              </div>
            );
          })}
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
      {!collapsed && (
        <div className="p-2 text-xs text-center text-muted-foreground">
          © 2025 Tahir Mehmood
        </div>
      )}
    </div>
  );
}
