
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileTextIcon, 
  CalendarIcon, 
  UserIcon, 
  TagIcon, 
  DownloadIcon,
  EditIcon,
  HistoryIcon,
  X,
  ShieldIcon,
  FileIcon
} from "lucide-react";

interface PolicyDetailProps {
  policy: any;
  onEdit: () => void;
  onDownload: (policy: any) => void;
  onDownloadPdf?: (policy: any) => void;
  onViewVersionHistory?: (policy: any) => void;
  onClose: () => void;
}

export function PolicyDetail({ 
  policy, 
  onEdit, 
  onDownload, 
  onDownloadPdf,
  onViewVersionHistory,
  onClose 
}: PolicyDetailProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'physical': return ShieldIcon;
      case 'technical': return FileIcon;
      case 'organizational': return UserIcon;
      default: return FileTextIcon;
    }
  };

  const CategoryIcon = getCategoryIcon(policy.framework_category);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <FileTextIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <h2 className="font-semibold text-lg truncate">{policy.title}</h2>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={getStatusColor(policy.status)}>
                {policy.status.replace('_', ' ')}
              </Badge>
              <Badge className={getFrameworkColor(policy.framework_category)}>
                <CategoryIcon className="h-3 w-3 mr-1" />
                {policy.framework_category}
              </Badge>
              <span className="text-xs text-muted-foreground">
                v{policy.currentVersion}
              </span>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Policy Metadata */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Policy Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Author:</span>
                  <span className="text-muted-foreground">{policy.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Type:</span>
                  <span className="text-muted-foreground">{policy.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Security Domain:</span>
                  <span className="text-muted-foreground">{policy.security_domain}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Created:</span>
                  <span className="text-muted-foreground">{formatDate(policy.created_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Last Updated:</span>
                  <span className="text-muted-foreground">{formatDate(policy.updated_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {policy.description && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {policy.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          {policy.tags && policy.tags.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TagIcon className="h-4 w-4" />
                  Tags ({policy.tags.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {policy.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Policy Content */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Policy Content</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64 rounded border p-3">
                <pre className="text-xs whitespace-pre-wrap leading-relaxed">
                  {policy.content}
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Version Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <HistoryIcon className="h-4 w-4" />
                Version Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Current Version:</span>
                <Badge variant="outline">v{policy.currentVersion}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Total Versions:</span>
                <span className="text-muted-foreground">{policy.versions?.length || 1}</span>
              </div>
              {onViewVersionHistory && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewVersionHistory(policy)}
                  className="w-full"
                >
                  <HistoryIcon className="h-4 w-4 mr-2" />
                  View Version History
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </ScrollArea>

      {/* Actions */}
      <div className="border-t p-4">
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={() => onDownload(policy)}>
              <DownloadIcon className="h-4 w-4 mr-2" />
              JSON
            </Button>
            {onDownloadPdf && (
              <Button variant="outline" size="sm" onClick={() => onDownloadPdf(policy)}>
                <DownloadIcon className="h-4 w-4 mr-2" />
                PDF
              </Button>
            )}
          </div>
          <Button onClick={onEdit} className="w-full">
            <EditIcon className="h-4 w-4 mr-2" />
            Edit Policy
          </Button>
        </div>
      </div>
    </div>
  );
}
