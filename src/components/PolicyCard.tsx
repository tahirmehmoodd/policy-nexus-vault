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
  EyeIcon,
  Trash2Icon
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PolicyCardProps {
  policy: Policy;
  onClick: () => void;
  onEdit?: () => void;
  onDownload?: (policy: Policy) => void;
  onDelete?: (policy: Policy) => void;
  viewMode?: 'grid' | 'list';
}

export function PolicyCard({ policy, onClick, onEdit, onDownload, onDelete, viewMode = 'grid' }: PolicyCardProps) {
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
    
    console.log('PolicyCard PDF Download - Input policy:', policy);
    
    // Extract data safely
    const title = policy.title || 'Untitled Policy';
    const description = policy.description || 'No description available';
    const content = policy.content || 'No content available';
    const version = policy.currentVersion || '1.0';
    const status = policy.status || 'draft';
    const author = policy.author || 'Unknown Author';
    const type = policy.type || 'General';
    
    console.log('PolicyCard PDF - Extracted data:', { title, content: content.substring(0, 100) });
    
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            line-height: 1.6; 
            color: #333;
        }
        h1 { 
            color: #333; 
            border-bottom: 2px solid #ccc; 
            padding-bottom: 10px; 
            margin-bottom: 20px;
        }
        .meta { 
            background: #f5f5f5; 
            padding: 15px; 
            margin: 20px 0; 
            border-radius: 5px;
        }
        .content { 
            margin: 20px 0; 
            padding: 20px; 
            border: 1px solid #ddd; 
            border-radius: 5px;
            white-space: pre-wrap;
        }
        @media print { 
            body { margin: 20px; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <h1>${title}</h1>
    <div class="meta">
        <p><strong>Version:</strong> ${version}</p>
        <p><strong>Status:</strong> ${status}</p>
        <p><strong>Type:</strong> ${type}</p>
        <p><strong>Author:</strong> ${author}</p>
    </div>
    <h2>Description</h2>
    <p>${description}</p>
    <h2>Content</h2>
    <div class="content">${content}</div>
    <div class="no-print" style="margin-top: 40px; padding: 20px; background: #e3f2fd; border-radius: 5px;">
        <p><strong>Instructions:</strong> Use Ctrl+P (Cmd+P on Mac) and select "Save as PDF" to download this policy as a PDF file.</p>
    </div>
</body>
</html>`;

    const newWindow = window.open('', '_blank');
    if (!newWindow) {
      toast({
        title: "Error",
        description: "Please allow pop-ups to download PDF",
        variant: "destructive",
      });
      return;
    }

    newWindow.document.write(htmlContent);
    newWindow.document.close();
    newWindow.focus();
    
    toast({
      title: "PDF Ready",
      description: "Use Ctrl+P (Cmd+P on Mac) and select 'Save as PDF'",
    });
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(policy);
    } else {
      toast({
        title: "Error",
        description: "Delete functionality not available",
        variant: "destructive",
      });
    }
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
                <Button variant="outline" size="sm" onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}>
                  <EditIcon className="h-4 w-4" />
                </Button>
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={(e) => e.stopPropagation()}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Policy</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{policy.title}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
            <Button variant="outline" size="sm" onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}>
              <EditIcon className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onClick}>
            <EyeIcon className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={(e) => e.stopPropagation()}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Policy</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{policy.title}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
