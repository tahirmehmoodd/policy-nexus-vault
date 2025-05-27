
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileTextIcon, DownloadIcon, EditIcon, EyeIcon, TagIcon, ClockIcon, FileJsonIcon } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { Policy } from "@/types/policy";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
    
    // Create a comprehensive JSON export
    const exportData = {
      metadata: {
        exported_at: new Date().toISOString(),
        export_version: "1.0"
      },
      policy: {
        id: policy.policy_id,
        title: policy.title,
        description: policy.description,
        content: policy.content,
        type: policy.type,
        status: policy.status,
        framework_category: policy.framework_category,
        security_domain: policy.security_domain,
        tags: policy.tags,
        version: policy.currentVersion,
        author: policy.author,
        created_at: policy.created_at,
        updated_at: policy.updated_at,
        version_history: policy.versions
      }
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    downloadFile(blob, `${policy.title.replace(/\s+/g, "_")}-v${policy.currentVersion}.json`);
    
    toast({
      title: "JSON Downloaded",
      description: `${policy.title} has been downloaded as JSON with full metadata`,
    });
  };
  
  const handleDownloadPDF = (event: React.MouseEvent) => {
    event.stopPropagation();
    
    // Create a comprehensive PDF-ready HTML document
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const content = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${policy.title} - Security Policy</title>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              margin: 40px; 
              line-height: 1.6;
              color: #333;
            }
            .header { 
              border-bottom: 3px solid #2563eb; 
              padding-bottom: 20px; 
              margin-bottom: 30px; 
            }
            .title { 
              color: #1e40af; 
              font-size: 28px; 
              font-weight: bold;
              margin-bottom: 10px;
            }
            .metadata { 
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 30px; 
              background: #f8fafc;
              padding: 20px;
              border-radius: 8px;
            }
            .metadata-item {
              margin-bottom: 8px;
            }
            .metadata-label { 
              font-weight: bold; 
              color: #475569;
            }
            .section { 
              margin-bottom: 30px; 
            }
            .section-title { 
              color: #1e40af; 
              font-size: 20px; 
              font-weight: bold;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 8px;
              margin-bottom: 15px;
            }
            .content { 
              line-height: 1.8; 
              text-align: justify;
            }
            .footer { 
              margin-top: 50px; 
              font-size: 12px; 
              color: #64748b; 
              border-top: 1px solid #e2e8f0; 
              padding-top: 20px;
              text-align: center;
            }
            .tags {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
              margin-top: 10px;
            }
            .tag {
              background: #e0e7ff;
              color: #3730a3;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: medium;
            }
            .status-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: bold;
              text-transform: uppercase;
            }
            .status-active { background: #dcfce7; color: #166534; }
            .status-draft { background: #fef3c7; color: #92400e; }
            .status-archived { background: #f3f4f6; color: #374151; }
            @media print {
              body { margin: 20px; }
              .header { page-break-after: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">${policy.title}</div>
            <span class="status-badge status-${policy.status}">${policy.status}</span>
          </div>
          
          <div class="metadata">
            <div>
              <div class="metadata-item">
                <span class="metadata-label">Policy Type:</span> ${policy.type}
              </div>
              <div class="metadata-item">
                <span class="metadata-label">Framework Category:</span> ${policy.framework_category}
              </div>
              <div class="metadata-item">
                <span class="metadata-label">Security Domain:</span> ${policy.security_domain}
              </div>
              <div class="metadata-item">
                <span class="metadata-label">Version:</span> ${policy.currentVersion}
              </div>
            </div>
            <div>
              <div class="metadata-item">
                <span class="metadata-label">Author:</span> ${policy.author}
              </div>
              <div class="metadata-item">
                <span class="metadata-label">Created:</span> ${format(new Date(policy.created_at), "PPP")}
              </div>
              <div class="metadata-item">
                <span class="metadata-label">Last Updated:</span> ${format(new Date(policy.updated_at), "PPP")}
              </div>
              <div class="metadata-item">
                <span class="metadata-label">Policy ID:</span> ${policy.policy_id}
              </div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Description</div>
            <div class="content">${policy.description}</div>
          </div>
          
          <div class="section">
            <div class="section-title">Policy Content</div>
            <div class="content">${policy.content.replace(/\n/g, '<br>')}</div>
          </div>
          
          <div class="section">
            <div class="section-title">Tags</div>
            <div class="tags">
              ${policy.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
          </div>
          
          <div class="footer">
            <p><strong>Information Security Policy Repository</strong></p>
            <p>Generated on ${format(new Date(), "PPP 'at' p")}</p>
            <p>This document was automatically generated from the Security Policy Repository system.</p>
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
      }, 500);
    }
    
    toast({
      title: "PDF Export Ready",
      description: "The print dialog will open. Save as PDF to download the policy document.",
    });
  };
  
  const downloadFile = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
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

  const getFrameworkBadgeColor = (framework: string) => {
    switch(framework) {
      case 'physical': return "bg-orange-100 text-orange-800 border-orange-200";
      case 'technical': return "bg-blue-100 text-blue-800 border-blue-200";
      case 'organizational': return "bg-purple-100 text-purple-800 border-purple-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (viewMode === 'list') {
    return (
      <Card className="h-full flex hover:shadow-md transition-shadow border-l-4 overflow-hidden" 
        style={{ borderLeftColor: 
          policy.framework_category === 'physical' ? '#ea580c' : 
          policy.framework_category === 'technical' ? '#2563eb' : 
          policy.framework_category === 'organizational' ? '#7c3aed' : '#6366f1' 
        }}>
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
              <Badge variant="outline" className={cn("text-xs font-normal", getFrameworkBadgeColor(policy.framework_category))}>
                {policy.framework_category}
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
                <TooltipContent>View Policy</TooltipContent>
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
                  <TooltipContent>Edit Policy</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={handleDownloadJSON}>
                    <FileJsonIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download JSON</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={handleDownloadPDF}>
                    <DownloadIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download PDF</TooltipContent>
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
        <div className="absolute top-3 right-3 flex gap-1">
          <Badge variant="outline" className={cn("text-xs", getStatusBadgeColor(policy.status))}>
            {policy.status}
          </Badge>
          <Badge variant="outline" className={cn("text-xs", getFrameworkBadgeColor(policy.framework_category))}>
            {policy.framework_category}
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
            {policy.security_domain}
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
        <div className="flex gap-1">
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
                <TooltipContent>Edit Policy</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={handleDownloadJSON}>
                  <FileJsonIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download JSON</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={handleDownloadPDF}>
                  <DownloadIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download PDF</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  );
}
