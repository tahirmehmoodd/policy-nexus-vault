
import { useState } from "react";
import { Policy } from "@/types/policy";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { 
  Download, 
  Clock, 
  Tag, 
  History, 
  Edit, 
  Share, 
  FileText,
  ArrowLeft,
  DiffIcon,
  Printer,
  Eye
} from "lucide-react";

interface PolicyDetailProps {
  policy: Policy;
  onBack: () => void;
  onEdit: () => void;
  onVersionDownload: (versionId: string) => void;
  onCompareVersions: () => void;
}

export function PolicyDetail({ 
  policy, 
  onBack, 
  onEdit, 
  onVersionDownload,
  onCompareVersions
}: PolicyDetailProps) {
  const [activeTab, setActiveTab] = useState("content");
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMMM d, yyyy");
  };
  
  const getCategoryName = (type: string) => {
    switch(type) {
      case 'access': return 'Access Control';
      case 'data': return 'Data Classification';
      case 'network': return 'Network Security';
      case 'user': return 'User Account';
      case 'incident': return 'Incident Handling';
      default: return type;
    }
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleDownloadCurrentVersion = () => {
    if (policy.versions.length > 0) {
      onVersionDownload(policy.versions[0].version_id);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start justify-between">
        <div>
          <div className="flex items-center mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="mr-2 -ml-2"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
          </div>
          <h1 className="text-2xl font-semibold">{policy.title}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-2 text-muted-foreground">
            <Badge variant="outline">{getCategoryName(policy.type)}</Badge>
            <span className="flex items-center gap-1 text-sm">
              <Clock className="h-4 w-4" />
              Updated {formatDate(policy.updated_at)}
            </span>
            <span className="text-sm">Version {policy.currentVersion}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 md:justify-end">
          <Button variant="outline" size="sm" className="gap-2" onClick={onEdit}>
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button size="sm" className="gap-2" onClick={handleDownloadCurrentVersion}>
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {policy.tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>
      
      <Tabs defaultValue="content" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> 
            Content
          </TabsTrigger>
          <TabsTrigger value="info" className="flex items-center gap-2">
            <Eye className="h-4 w-4" /> 
            Overview
          </TabsTrigger>
          <TabsTrigger value="versions" className="flex items-center gap-2">
            <History className="h-4 w-4" /> 
            Version History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="mt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Policy Content</CardTitle>
              <CardDescription>
                Version {policy.currentVersion} • Last updated {formatDate(policy.updated_at)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="policy-content whitespace-pre-wrap">
                {policy.content}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="info" className="mt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Policy Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Title</h3>
                    <p>{policy.title}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                    <p>{policy.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Type</h3>
                    <p>{getCategoryName(policy.type)}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Created</h3>
                    <p>{formatDate(policy.created_at)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Last Updated</h3>
                    <p>{formatDate(policy.updated_at)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Current Version</h3>
                    <p>v{policy.currentVersion}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Tags</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {policy.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="versions" className="mt-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Version History</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={onCompareVersions}
                >
                  <DiffIcon className="h-4 w-4" />
                  Compare Versions
                </Button>
              </div>
              <CardDescription>
                {policy.versions.length} versions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {policy.versions.map((version) => (
                    <div 
                      key={version.version_id} 
                      className="p-4 border rounded-md hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Badge variant={version.version_id === policy.versions[0].version_id ? "default" : "outline"}>
                            {version.version_label}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(version.created_at)}
                          </span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onVersionDownload(version.version_id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Edited by: {version.edited_by}
                      </div>
                      <p className="text-sm">{version.description}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
