import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Clock, User, FileText, Download, Eye } from 'lucide-react';
import { usePolicyRepository, PolicyData } from '@/hooks/usePolicyRepository';

interface VersionHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  policy: PolicyData | null;
}

interface Version {
  version_id: string;
  policy_id: string;
  version_label: string;
  description: string | null;
  created_at: string;
  edited_by: string;
}

export function VersionHistoryModal({ open, onOpenChange, policy }: VersionHistoryModalProps) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const { getPolicyVersions } = usePolicyRepository();

  useEffect(() => {
    if (open && policy) {
      fetchVersions();
    }
  }, [open, policy]);

  const fetchVersions = async () => {
    if (!policy) return;
    
    setLoading(true);
    try {
      const versionData = await getPolicyVersions(policy.policy_id);
      setVersions(versionData);
      if (versionData.length > 0) {
        setSelectedVersion(versionData[0]); // Select latest version by default
      }
    } catch (error) {
      console.error('Error fetching versions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getVersionBadgeColor = (versionLabel: string) => {
    if (versionLabel === 'v1.0') return 'bg-green-100 text-green-800';
    if (versionLabel.endsWith('.0')) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const isLatestVersion = (version: Version) => {
    return versions.length > 0 && versions[0].version_id === version.version_id;
  };

  if (!policy) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Version History - {policy.title}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Track all changes and revisions made to this policy
          </p>
        </DialogHeader>
        
        <div className="flex gap-6 flex-1 min-h-0">
          {/* Version List */}
          <div className="w-1/3 border-r pr-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              All Versions ({versions.length})
            </h3>
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-sm text-muted-foreground mt-2">Loading versions...</p>
                  </div>
                ) : versions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">No version history available</p>
                  </div>
                ) : (
                  versions.map((version) => (
                    <Card
                      key={version.version_id}
                      className={`cursor-pointer transition-colors ${
                        selectedVersion?.version_id === version.version_id
                          ? 'border-primary bg-primary/5'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedVersion(version)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={getVersionBadgeColor(version.version_label)}>
                            {version.version_label}
                          </Badge>
                          {isLatestVersion(version) && (
                            <Badge variant="default" className="text-xs">
                              Latest
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm font-medium mb-1">
                          {version.description || 'No description'}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>{version.edited_by}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(version.created_at)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Version Details */}
          <div className="flex-1">
            {selectedVersion ? (
              <div className="h-full flex flex-col">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Version Details
                    </h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export This Version
                      </Button>
                    </div>
                  </div>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Badge className={getVersionBadgeColor(selectedVersion.version_label)}>
                            {selectedVersion.version_label}
                          </Badge>
                          {isLatestVersion(selectedVersion) && (
                            <Badge variant="default">Current Version</Badge>
                          )}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Modified by:</span>
                          <p className="text-muted-foreground">{selectedVersion.edited_by}</p>
                        </div>
                        <div>
                          <span className="font-medium">Date & Time:</span>
                          <p className="text-muted-foreground">{formatDate(selectedVersion.created_at)}</p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <span className="font-medium text-sm">Change Description:</span>
                        <p className="text-sm text-muted-foreground mt-1">
                          {selectedVersion.description || 'No description provided for this version.'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Policy Content for Selected Version */}
                <div className="flex-1">
                  <h4 className="font-medium mb-2">Policy Content (Read-only)</h4>
                  <Card className="h-full">
                    <CardContent className="p-0 h-full">
                      <ScrollArea className="h-[300px] p-4">
                        {isLatestVersion(selectedVersion) ? (
                          <div className="space-y-4">
                            <div>
                              <h5 className="font-medium mb-1">Title:</h5>
                              <p className="text-sm">{policy.title}</p>
                            </div>
                            <div>
                              <h5 className="font-medium mb-1">Description:</h5>
                              <p className="text-sm text-muted-foreground">
                                {policy.description || 'No description'}
                              </p>
                            </div>
                            <div>
                              <h5 className="font-medium mb-1">Content:</h5>
                              <pre className="text-sm whitespace-pre-wrap bg-muted p-3 rounded">
                                {policy.content}
                              </pre>
                            </div>
                            <div>
                              <h5 className="font-medium mb-1">Tags:</h5>
                              <div className="flex flex-wrap gap-1">
                                {policy.tags?.map(tag => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                )) || <span className="text-sm text-muted-foreground">No tags</span>}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-sm text-muted-foreground">
                              Historical version content is not available for viewing.
                              This feature would require storing content snapshots for each version.
                            </p>
                          </div>
                        )}
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Select a version to view details</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {versions.length > 0 && (
              <>
                Latest version: {versions[0]?.version_label} • 
                First created: {versions[versions.length - 1] && formatDate(versions[versions.length - 1].created_at)}
              </>
            )}
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
