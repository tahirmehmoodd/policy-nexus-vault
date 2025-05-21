
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Policy } from "@/types/policy";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  FileText, 
  ListChecks, 
  ClockIcon, 
  TagIcon, 
  BookOpenIcon, 
  ShieldIcon, 
  DatabaseIcon,
  NetworkIcon,
  UsersIcon,
  AlertTriangleIcon
} from "lucide-react";

interface DashboardProps {
  policies: Policy[];
  onViewPolicy: (policy: Policy) => void;
  onUploadPolicy: () => void;
}

export function Dashboard({ policies, onViewPolicy, onUploadPolicy }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Get statistics for the dashboard
  const getStats = () => {
    const categoryCount: Record<string, number> = {};
    const policyCount = policies.length;
    const recentlyUpdated = [...policies].sort((a, b) => 
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    ).slice(0, 5);
    
    // Count policies per category
    policies.forEach(policy => {
      categoryCount[policy.type] = (categoryCount[policy.type] || 0) + 1;
    });
    
    // Collect all tags
    let allTags: string[] = [];
    policies.forEach(policy => {
      allTags = [...allTags, ...policy.tags];
    });
    
    // Count tag occurrences
    const tagCount: Record<string, number> = {};
    allTags.forEach(tag => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
    
    // Get top tags
    const topTags = Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));
    
    return {
      policyCount,
      categoryCount,
      recentlyUpdated,
      topTags
    };
  };
  
  const stats = getStats();
  
  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'access':
        return <ShieldIcon className="h-5 w-5" />;
      case 'data':
        return <DatabaseIcon className="h-5 w-5" />;
      case 'network':
        return <NetworkIcon className="h-5 w-5" />;
      case 'user':
        return <UsersIcon className="h-5 w-5" />;
      case 'incident':
        return <AlertTriangleIcon className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };
  
  // Get category name
  const getCategoryName = (category: string) => {
    switch(category) {
      case 'access':
        return 'Access Control';
      case 'data':
        return 'Data Classification';
      case 'network':
        return 'Network Security';
      case 'user':
        return 'User Account';
      case 'incident':
        return 'Incident Handling';
      default:
        return category;
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="container mx-auto max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Policy Repository Dashboard</h1>
        <Button onClick={onUploadPolicy}>
          Upload New Policy
        </Button>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="policies" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            All Policies
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <ListChecks className="h-4 w-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="tags" className="flex items-center gap-2">
            <TagIcon className="h-4 w-4" />
            Tags
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4" />
            Recent Activity
          </TabsTrigger>
          <TabsTrigger value="reference" className="flex items-center gap-2">
            <BookOpenIcon className="h-4 w-4" />
            Guidelines
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Total Policies</CardTitle>
              <CardDescription>Policies in the repository</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{stats.policyCount}</div>
              <div className="mt-2 text-sm text-muted-foreground">
                Across {Object.keys(stats.categoryCount).length} categories
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>Policies by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[120px]">
                <ul className="space-y-2">
                  {Object.entries(stats.categoryCount).map(([category, count]) => (
                    <li key={category} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(category)}
                        <span>{getCategoryName(category)}</span>
                      </div>
                      <span className="font-medium">{count}</span>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Popular Tags</CardTitle>
              <CardDescription>Most used tags</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {stats.topTags.map(({ tag, count }) => (
                  <Badge key={tag} variant="outline" className="flex gap-1.5 items-center">
                    {tag}
                    <span className="bg-primary/10 text-primary text-xs rounded-full px-1.5 py-0.5">{count}</span>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader className="pb-2">
              <CardTitle>Recently Updated</CardTitle>
              <CardDescription>Latest policy updates</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {stats.recentlyUpdated.map((policy) => (
                  <li key={policy.policy_id} className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(policy.type)}
                      <div>
                        <div className="font-medium">{policy.title}</div>
                        <div className="text-sm text-muted-foreground">Updated {formatDate(policy.updated_at)}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => onViewPolicy(policy)}>
                      View
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="policies">
          <Card>
            <CardHeader>
              <CardTitle>All Policies</CardTitle>
              <CardDescription>Complete list of policies in the repository</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <ul className="space-y-2">
                  {policies.map((policy) => (
                    <li key={policy.policy_id} className="flex items-center justify-between p-3 border-b">
                      <div className="flex items-center gap-3">
                        {getCategoryIcon(policy.type)}
                        <div>
                          <div className="font-medium">{policy.title}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-md">{policy.description}</div>
                          <div className="flex gap-1 mt-1">
                            {policy.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                            ))}
                            {policy.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">+{policy.tags.length - 3}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => onViewPolicy(policy)}>
                        View Details
                      </Button>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(stats.categoryCount).map(([category, count]) => (
              <Card key={category}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {getCategoryIcon(category)}
                      {getCategoryName(category)}
                    </CardTitle>
                    <Badge>{count} policies</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    <ul className="space-y-1">
                      {policies
                        .filter(policy => policy.type === category)
                        .map(policy => (
                          <li key={policy.policy_id} className="p-2 hover:bg-muted rounded-md">
                            <div className="font-medium truncate">{policy.title}</div>
                            <div className="text-xs text-muted-foreground">v{policy.currentVersion} • Updated {formatDate(policy.updated_at)}</div>
                          </li>
                        ))
                      }
                    </ul>
                  </ScrollArea>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="tags">
          <Card>
            <CardHeader>
              <CardTitle>Tag Explorer</CardTitle>
              <CardDescription>View all tags used in the repository</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3 mb-6">
                {stats.topTags.map(({ tag, count }) => (
                  <Badge key={tag} variant="outline" className="flex gap-1.5 items-center text-lg py-2 px-3">
                    {tag}
                    <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5">{count}</span>
                  </Badge>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Related Policies by Tag</h3>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {stats.topTags.slice(0, 3).map(({ tag }) => (
                      <div key={tag} className="border-b pb-3">
                        <h4 className="font-medium mb-2">Policies tagged with "{tag}"</h4>
                        <ul className="space-y-1">
                          {policies
                            .filter(policy => policy.tags.includes(tag))
                            .slice(0, 5)
                            .map(policy => (
                              <li key={policy.policy_id} className="p-2 hover:bg-muted rounded-md">
                                <div className="font-medium">{policy.title}</div>
                                <div className="text-xs text-muted-foreground">
                                  {getCategoryName(policy.type)} • Updated {formatDate(policy.updated_at)}
                                </div>
                              </li>
                            ))
                          }
                        </ul>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates to the policy repository</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <ul className="space-y-4">
                  {policies
                    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
                    .slice(0, 20)
                    .map((policy) => (
                      <li key={policy.policy_id} className="border-l-4 border-primary pl-4 py-1">
                        <div className="text-sm text-muted-foreground">{formatDate(policy.updated_at)}</div>
                        <div className="font-medium mt-1">{policy.title} updated to version {policy.currentVersion}</div>
                        <div className="text-sm mt-1">{policy.versions[0]?.description || "Policy updated"}</div>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm" onClick={() => onViewPolicy(policy)}>
                            View Policy
                          </Button>
                        </div>
                      </li>
                    ))
                  }
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reference">
          <Card>
            <CardHeader>
              <CardTitle>Policy Guidelines</CardTitle>
              <CardDescription>Best practices for managing security policies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <h3>Policy Development Guidelines</h3>
                <p>
                  Effective security policies should be clear, concise, and enforceable. Follow these guidelines when 
                  creating or updating policies:
                </p>
                <ul>
                  <li>Define clear scope and objectives</li>
                  <li>Use simple language that is easy to understand</li>
                  <li>Include specific responsibilities and procedures</li>
                  <li>Define consequences for non-compliance</li>
                  <li>Establish regular review and update cycles</li>
                </ul>
                
                <h3>Policy Types</h3>
                <p>
                  This repository supports multiple policy types, each serving different security aspects:
                </p>
                <ul>
                  <li><strong>Access Control Policies</strong> - Define who can access what resources</li>
                  <li><strong>Data Classification Policies</strong> - Define data sensitivity levels and handling requirements</li>
                  <li><strong>Network Security Policies</strong> - Define rules for network access and protection</li>
                  <li><strong>User Account Policies</strong> - Define user account management procedures</li>
                  <li><strong>Incident Handling Policies</strong> - Define incident response procedures</li>
                </ul>
                
                <h3>Best Practices for Tagging</h3>
                <p>
                  Effective tagging improves searchability and organization:
                </p>
                <ul>
                  <li>Use consistent naming conventions</li>
                  <li>Include topic-specific tags (e.g., "encryption", "authentication")</li>
                  <li>Tag policies by applicable standards (e.g., "ISO27001", "GDPR")</li>
                  <li>Include organizational units when relevant (e.g., "HR", "Finance")</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
