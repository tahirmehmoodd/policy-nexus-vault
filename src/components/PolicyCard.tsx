import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Policy } from "@/types/policy";
import { 
  FileTextIcon, 
  CalendarIcon, 
  UserIcon, 
  TagIcon, 
  DownloadIcon,
  EditIcon,
  HistoryIcon,
  EyeIcon
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PolicyCardProps {
  policy: Policy;
  onClick: () => void;
  onEdit?: () => void;
  onDownload?: (policy: Policy) => void;
  viewMode?: 'grid' | 'list';
}

export function PolicyCard({ policy, onClick, onEdit, onDownload, viewMode = 'grid' }: PolicyCardProps) {
  const { toast } = useToast();

  const handleDownloadJSON = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (onDownload) {
      onDownload(policy);
      return;
    }
    
    const dataStr = JSON.stringify(policy, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${policy.title.replace(/\s+/g, '_')}_${policy.currentVersion}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: `${policy.title} JSON file downloaded successfully.`,
    });
  };

  const handleDownloadPDF = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Create a simple PDF-like content
    const pdfContent = `
SECURITY POLICY DOCUMENT

Title: ${policy.title}
Version: ${policy.currentVersion}
Status: ${policy.status.toUpperCase()}
Type: ${policy.type}
Framework Category: ${policy.framework_category}
Security Domain: ${policy.security_domain}

Author: ${policy.author}
Created: ${new Date(policy.created_at).toLocaleDateString()}
Updated: ${new Date(policy.updated_at).toLocaleDateString()}

Description:
${policy.description}

Content:
${policy.content}

Tags: ${policy.tags.join(', ')}

Version History:
${policy.versions.map(v => `- ${v.version_label}: ${v.description} (${new Date(v.created_at).toLocaleDateString()})`).join('\n')}

Generated on: ${new Date().toLocaleString()}
    `;

    const dataBlob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${policy.title.replace(/\s+/g, '_')}_${policy.currentVersion}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: `${policy.title} PDF file downloaded successfully.`,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFrameworkColor = (category: string) => {
    switch (category) {
      case 'physical': return 'bg-blue-100 text-blue-800';
      case 'technical': return 'bg-purple-100 text-purple-800';
      case 'organizational': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (viewMode === 'list') {
    return (
      <Card className="cursor-pointer hover:shadow-md transition-shadow duration-200 mb-3">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0" onClick={onClick}>
              <div className="flex items-center gap-3 mb-2">
                <FileTextIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold truncate">{policy.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">{policy.description}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge className={getStatusColor(policy.status)}>
                    {policy.status}
                  </Badge>
                  <Badge className={getFrameworkColor(policy.framework_category)}>
                    {policy.framework_category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">v{policy.currentVersion}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <UserIcon className="h-3 w-3" />
                  {policy.author}
                </div>
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3" />
                  Updated {formatDate(policy.updated_at)}
                </div>
                <div className="flex items-center gap-1">
                  <TagIcon className="h-3 w-3" />
                  {policy.tags.length} tags
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1 ml-4 flex-shrink-0">
              <Button variant="outline" size="sm" onClick={handleDownloadJSON}>
                <DownloadIcon className="h-4 w-4 mr-1" />
                JSON
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                <DownloadIcon className="h-4 w-4 mr-1" />
                PDF
              </Button>
              {onEdit && (
                <Button variant="outline" size="sm" onClick={onEdit}>
                  <EditIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
      <CardHeader className="pb-3" onClick={onClick}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <FileTextIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg leading-tight truncate">
                {policy.title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getStatusColor(policy.status)}>
                  {policy.status}
                </Badge>
                <Badge className={getFrameworkColor(policy.framework_category)}>
                  {policy.framework_category}
                </Badge>
              </div>
            </div>
          </div>
          <span className="text-sm font-mono text-muted-foreground flex-shrink-0">
            v{policy.currentVersion}
          </span>
        </div>
        <CardDescription className="line-clamp-2 mt-2">
          {policy.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <UserIcon className="h-4 w-4" />
              <span>{policy.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              <span>{formatDate(policy.updated_at)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Type: {policy.type}</div>
            <div className="text-sm">Domain: {policy.security_domain}</div>
          </div>

          {policy.tags.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-sm font-medium">
                <TagIcon className="h-4 w-4" />
                Tags
              </div>
              <div className="flex flex-wrap gap-1">
                {policy.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {policy.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{policy.tags.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {policy.versions.length > 1 && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <HistoryIcon className="h-4 w-4" />
              <span>{policy.versions.length} versions</span>
            </div>
          )}
        </div>

        <Separator className="my-3" />
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleDownloadJSON} className="flex-1">
            <DownloadIcon className="h-4 w-4 mr-1" />
            JSON
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadPDF} className="flex-1">
            <DownloadIcon className="h-4 w-4 mr-1" />
            PDF
          </Button>
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              <EditIcon className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onClick}>
            <EyeIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
