import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileTextIcon, DownloadIcon, EditIcon, EyeIcon, TagIcon, ClockIcon } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { Policy } from "@/types/policy";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PolicyCardProps {
  policy: Policy;
  onClick: () => void;
  onEdit?: () => void;
  viewMode?: 'grid' | 'list';
}

export function PolicyCard({ policy, onClick, onEdit, viewMode = 'grid' }: PolicyCardProps) {
  const { toast } = useToast();
  
  const handleDownloadJSON = (event: React.MouseEvent) => {
    event.stopPropagation();
    
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
  
  const handleDownloadText = (event: React.MouseEvent) => {
    event.stopPropagation();
    
    // Create a text version of the policy
    const textContent = `${policy.title}
Version: ${policy.currentVersion}
Type: ${policy.type}
Status: ${policy.status}
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
  
  const handleDownloadPDF = (event: React.MouseEvent) => {
    event.stopPropagation();
    
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

  const getStatusBadgeColor = (status: string) => {
    switch(status) {
      case 'active': return "bg-green-100 text-green-800 border-green-200";
      case 'draft': return "bg-amber-100 text-amber-800 border-amber-200";
      case 'archived': return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "";
    }
  };

  if (viewMode === 'list') {
    return (
      <Card className="h-full flex hover:shadow-md transition-shadow border-l-4 overflow-hidden" 
        style={{ borderLeftColor: policy.type === 'access' ? '#4f46e5' : 
                               policy.type === 'data' ? '#0891b2' : 
                               policy.type === 'network' ? '#ca8a04' : 
                               policy.type === 'incident' ? '#dc2626' : 
                               policy.type === 'user' ? '#059669' : '#6366f1' }}>
        <div className="flex flex-1 items-center px-4 py-3 cursor-pointer" onClick={onClick}>
          <div className="mr-4">
            <FileTextIcon className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-base">{policy.title}</h3>
            <div className="flex items-center text-sm text-muted-foreground gap-4 mt-1">
              <span className="flex items-center gap-1">
                <ClockIcon className="h-3 w-3" />
                Updated {formatDistanceToNow(new Date(policy.updated_at), { addSuffix: true })}
              </span>
              <Badge variant="outline" className={cn("text-xs font-normal", getStatusBadgeColor(policy.status))}>
                {policy.status}
              </Badge>
              {policy.tags.length > 0 && (
                <span className="flex items-center gap-1">
                  <TagIcon className="h-3 w-3" />
                  {policy.tags[0]}{policy.tags.length > 1 && `+${policy.tags.length - 1}`}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                  }}>
                    <EyeIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {onEdit && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={(e) => {
                      e.stopPropagation();
                      onEdit();
                    }}>
                      <EditIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                        <DownloadIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
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
                </TooltipTrigger>
                <TooltipContent>Download</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow group">
      <CardHeader className="pb-2 relative">
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className={cn("text-xs", getStatusBadgeColor(policy.status))}>
            {policy.status}
          </Badge>
        </div>
        <div className="flex items-start gap-2">
          <FileTextIcon className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
          <div>
            <CardTitle className="text-lg cursor-pointer hover:text-primary transition-colors group-hover:text-primary" onClick={onClick}>
              {policy.title}
            </CardTitle>
            <CardDescription className="text-sm mt-1 flex items-center gap-1">
              <ClockIcon className="h-3.5 w-3.5" />
              {formatDistanceToNow(new Date(policy.updated_at), { addSuffix: true })}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <p className="text-sm line-clamp-2 text-muted-foreground mb-3">
          {policy.description}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          <Badge variant="outline" className="bg-primary/10">
            {policy.type}
          </Badge>
          {policy.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="bg-secondary">
              {tag}
            </Badge>
          ))}
          {policy.tags.length > 2 && (
            <Badge variant="outline">+{policy.tags.length - 2}</Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between items-center border-t mt-auto">
        <div className="text-xs text-muted-foreground">
          v{policy.currentVersion}
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}>
                    <EditIcon className="h-4 w-4" />
                    <span className="sr-only md:not-sr-only md:ml-1 md:inline-block">Edit</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit Policy</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                      <DownloadIcon className="h-4 w-4" />
                      <span className="sr-only md:not-sr-only md:ml-1 md:inline-block">Download</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
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
                </TooltipTrigger>
              <TooltipContent>Download Policy</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  );
}
