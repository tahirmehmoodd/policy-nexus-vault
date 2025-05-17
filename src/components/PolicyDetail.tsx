
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
  HistoryIcon,
  EditIcon
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { Policy } from "@/types/policy";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PolicyDetailProps {
  policy: Policy;
  onBack: () => void;
  onEdit?: () => void;
  onVersionDownload?: (versionId: string) => void;
}

export function PolicyDetail({ policy, onBack, onEdit, onVersionDownload }: PolicyDetailProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("details");
  
  const handleDownloadJSON = () => {
    // Create a blob with the policy content
    const blob = new Blob([JSON.stringify({
      title: policy.title,
      description: policy.description,
      content: policy.content,
      type: policy.type,
      tags: policy.tags,
      version: policy.currentVersion
    }, null, 2)], { type: "application/json" });
    
    downloadFile(blob, `${policy.title.replace(/\s+/g, "_")}-v${policy.currentVersion}.json`);
    
    toast({
      title: "Policy downloaded",
      description: `${policy.title} has been downloaded as JSON`,
    });
  };
  
  const handleDownloadText = () => {
    // Create a text version of the policy
    const textContent = `${policy.title}
Version: ${policy.currentVersion}
Type: ${policy.type}
Status: ${policy.status}
Created by: ${policy.author}
Last updated: ${format(new Date(policy.updated_at), "MMM d, yyyy")}
Tags: ${policy.tags.join(", ")}

Description:
${policy.description}

Content:
${policy.content}`;
    
    const blob = new Blob([textContent], { type: "text/plain" });
    downloadFile(blob, `${policy.title.replace(/\s+/g, "_")}-v${policy.currentVersion}.txt`);
    
    toast({
      title: "Policy downloaded",
      description: `${policy.title} has been downloaded as plain text`,
    });
  };
  
  const handleDownloadPDF = () => {
    // Create a simple PDF using window.print() functionality
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const content = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${policy.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #333; }
            .metadata { margin-bottom: 20px; color: #666; }
            .content { line-height: 1.6; }
            .header { border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 20px; }
            .footer { margin-top: 40px; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${policy.title}</h1>
            <div class="metadata">
              <p><strong>Version:</strong> ${policy.currentVersion}</p>
              <p><strong>Type:</strong> ${policy.type}</p>
              <p><strong>Status:</strong> ${policy.status}</p>
              <p><strong>Created by:</strong> ${policy.author}</p>
              <p><strong>Last updated:</strong> ${format(new Date(policy.updated_at), "MMM d, yyyy")}</p>
              <p><strong>Tags:</strong> ${policy.tags.join(", ")}</p>
            </div>
          </div>
          <div class="description">
            <h2>Description</h2>
            <p>${policy.description}</p>
          </div>
          <div class="content">
            <h2>Policy Content</h2>
            <p>${policy.content.replace(/\n/g, '<br>')}</p>
          </div>
          <div class="footer">
            <p>Generated on ${format(new Date(), "MMM d, yyyy 'at' h:mm a")}</p>
          </div>
        </body>
        </html>
      `;
      
      printWindow.document.open();
      printWindow.document.write(content);
      printWindow.document.close();
      
      // Wait for content to load before printing
      setTimeout(() => {
        printWindow.print();
        // Close the window after print dialog is closed (optional)
        // printWindow.close();
      }, 250);
    }
    
    toast({
      title: "PDF being prepared",
      description: "The print dialog will open to save your policy as PDF",
    });
  };
  
  const downloadFile = (blob: Blob, fileName: string) => {
    // Create a download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div className="ml-auto flex gap-2">
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                <EditIcon className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <DownloadIcon className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDownloadJSON}>
                  <FileTextIcon className="mr-2 h-4 w-4" />
                  <span>JSON</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownloadText}>
                  <FileTextIcon className="mr-2 h-4 w-4" />
                  <span>Plain Text</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownloadPDF}>
                  <FileTextIcon className="mr-2 h-4 w-4" />
                  <span>PDF</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onVersionDownload && onVersionDownload(version.version_id)}
                      >
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
