
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FolderIcon,
  SearchIcon,
  PlusIcon,
  ShieldIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BookOpenIcon,
  BarChartIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BuildingIcon,
  ComputerIcon,
  ClipboardIcon,
  Settings,
  FileText
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

export function Sidebar({ className, onCategoryChange, onNewPolicyClick, activeCategory, policies = [] }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedFrameworks, setExpandedFrameworks] = useState<string[]>(['technical']);
  const [showDocumentation, setShowDocumentation] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showReports, setShowReports] = useState(false);
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
    if (!policies || !Array.isArray(policies)) return 0;
    if (category === 'all') return policies.length;
    return policies.filter(p => p.framework_category === category).length;
  };

  // Count policies by domain
  const getDomainPolicyCount = (category: string, domain: string) => {
    if (!policies || !Array.isArray(policies)) return 0;
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
    setShowSettings(true);
  };
  
  const handleReportClick = () => {
    setShowReports(true);
  };

  const handleDocumentationClick = () => {
    setShowDocumentation(true);
  };

  return (
    <>
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
                                <Badge variant="outline">
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
            onClick={handleDocumentationClick}
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
            <Settings className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-2")} />
            {!collapsed && <span>Settings</span>}
          </Button>
        </div>
        {!collapsed && (
          <div className="p-2 text-xs text-center text-muted-foreground">
            © 2025 Tahir Mehmood
          </div>
        )}
      </div>

      {/* Documentation Modal */}
      <Dialog open={showDocumentation} onOpenChange={setShowDocumentation}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Project Documentation
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="prose max-w-none">
              <h2>Information Security Policy Repository</h2>
              <p>A comprehensive policy management system for information security policies.</p>
              
              <h3>Features</h3>
              <ul>
                <li>Policy upload and management</li>
                <li>Version tracking and history</li>
                <li>Advanced search and filtering</li>
                <li>Tag-based categorization</li>
                <li>Real-world policy templates</li>
                <li>Export capabilities (JSON/PDF)</li>
                <li>XML import functionality</li>
                <li>User authentication and authorization</li>
              </ul>
              
              <h3>Security Framework Categories</h3>
              <ul>
                <li><strong>Technical Controls:</strong> Access control, network security, data classification</li>
                <li><strong>Physical Controls:</strong> Asset management, physical security</li>
                <li><strong>Organizational Controls:</strong> Incident management, business continuity, acceptable use</li>
              </ul>
              
              <h3>Getting Started</h3>
              <ol>
                <li>Sign in to access the repository</li>
                <li>Browse existing policies or create new ones</li>
                <li>Use tags to categorize and organize policies</li>
                <li>Search and filter policies by various criteria</li>
                <li>Track version history for policy changes</li>
              </ol>
              
              <h3>Best Practices</h3>
              <ul>
                <li>Use descriptive titles and tags for policies</li>
                <li>Regular review and update of policies</li>
                <li>Maintain proper version control</li>
                <li>Follow organizational approval processes</li>
                <li>Ensure compliance with applicable regulations</li>
              </ul>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              System Settings
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">User Preferences</h4>
              <p className="text-sm text-muted-foreground mb-2">Customize your repository experience</p>
              <ul className="text-sm space-y-1">
                <li>• Default view mode: Grid/List</li>
                <li>• Auto-save drafts: Enabled</li>
                <li>• Email notifications: Policy updates</li>
                <li>• Theme preference: System</li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Data Management</h4>
              <p className="text-sm text-muted-foreground mb-2">Control data retention and backup</p>
              <ul className="text-sm space-y-1">
                <li>• Version history retention: 12 months</li>
                <li>• Auto-backup frequency: Daily</li>
                <li>• Export format preference: JSON</li>
                <li>• Archive inactive policies: After 2 years</li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Security Settings</h4>
              <p className="text-sm text-muted-foreground mb-2">Configure security and access controls</p>
              <ul className="text-sm space-y-1">
                <li>• Two-factor authentication: Recommended</li>
                <li>• Session timeout: 4 hours</li>
                <li>• Audit logging: Enabled</li>
                <li>• Access review frequency: Quarterly</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reports Modal */}
      <Dialog open={showReports} onOpenChange={setShowReports}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChartIcon className="h-5 w-5" />
              Policy Repository Reports
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Policy Statistics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Policies:</span>
                    <span className="font-medium">{policies.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Policies:</span>
                    <span className="font-medium text-green-600">
                      {policies.filter(p => p.status === 'active').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Draft Policies:</span>
                    <span className="font-medium text-yellow-600">
                      {policies.filter(p => p.status === 'draft').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Template Policies:</span>
                    <span className="font-medium text-blue-600">
                      {policies.filter(p => p.author === 'Policy Repository Templates').length}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Category Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Technical Controls:</span>
                    <span className="font-medium">
                      {policies.filter(p => p.framework_category === 'technical').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Physical Controls:</span>
                    <span className="font-medium">
                      {policies.filter(p => p.framework_category === 'physical').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Organizational:</span>
                    <span className="font-medium">
                      {policies.filter(p => p.framework_category === 'organizational').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">Compliance Overview</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">85%</div>
                  <div>Policies Up to Date</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <div>Pending Reviews</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">3</div>
                  <div>Needs Attention</div>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">Recent Activity Summary</h4>
              <ul className="text-sm space-y-2">
                <li>• {policies.filter(p => p.status === 'active').length} policies activated this month</li>
                <li>• {policies.filter(p => p.author === 'Policy Repository Templates').length} template policies available</li>
                <li>• Average policy version: {(policies.reduce((sum, p) => sum + parseFloat(p.currentVersion || '1'), 0) / policies.length).toFixed(1)}</li>
                <li>• Most tagged category: Information Security</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
