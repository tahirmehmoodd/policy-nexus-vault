
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  DownloadIcon, 
  ArrowLeftIcon, 
  FileTextIcon,
  CalendarIcon,
  UserIcon,
  HistoryIcon
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { Policy } from "@/types/policy";

interface PolicyDetailProps {
  policy: Policy;
  onBack: () => void;
}

export function PolicyDetail({ policy, onBack }: PolicyDetailProps) {
  const [activeTab, setActiveTab] = useState("details");

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back
          </Button>
          <Button variant="outline" size="sm" className="ml-auto">
            <DownloadIcon className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
        
        <div className="flex items-start gap-3">
          <FileTextIcon className="h-8 w-8 text-primary mt-1" />
          <div>
            <CardTitle className="text-2xl">{policy.title}</CardTitle>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline" className="bg-primary/10">
                {policy.type}
              </Badge>
              {policy.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="bg-secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <CardDescription className="mt-2">
              Last updated {formatDistanceToNow(new Date(policy.updated_at), { addSuffix: true })}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <Tabs defaultValue="details" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <div className="px-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="versions">Versions</TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="pt-6">
          <TabsContent value="details" className="mt-0">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                <p>{policy.description}</p>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
                  <Badge variant={policy.status === "active" ? "default" : "secondary"}>
                    {policy.status}
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Current Version</h4>
                  <p>v{policy.currentVersion}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Created</h4>
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    {format(new Date(policy.created_at), "MMM d, yyyy")}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Created By</h4>
                  <div className="flex items-center">
                    <UserIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    {policy.author}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="content" className="mt-0">
            <div className="prose max-w-none">
              <p>{policy.content}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="versions" className="mt-0">
            <div className="space-y-4">
              {policy.versions.map((version, index) => (
                <div key={version.version_id} className="flex items-start gap-3 p-3 rounded-md border">
                  <HistoryIcon className="h-5 w-5 text-muted-foreground mt-1" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">
                          {version.version_label} 
                          {index === 0 && <Badge className="ml-2 text-xs">Current</Badge>}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(version.created_at), "MMM d, yyyy")} by {version.edited_by}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <DownloadIcon className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                    {version.description && (
                      <p className="text-sm mt-2">{version.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
