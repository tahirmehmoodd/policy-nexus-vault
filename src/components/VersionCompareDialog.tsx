
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Policy } from "@/types/policy";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

interface VersionCompareDialogProps {
  policy: Policy;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onVersionDownload: (versionId: string) => void;
}

export function VersionCompareDialog({ policy, isOpen, onOpenChange, onVersionDownload }: VersionCompareDialogProps) {
  const [version1, setVersion1] = useState<string>("");
  const [version2, setVersion2] = useState<string>("");
  
  // Set default versions on policy change
  useEffect(() => {
    if (policy.versions.length > 0) {
      setVersion1(policy.versions[0].version_id);
      if (policy.versions.length > 1) {
        setVersion2(policy.versions[1].version_id);
      } else {
        setVersion2("");
      }
    }
  }, [policy]);
  
  // Simple diff highlighting (in a real app, use a proper diff library)
  const highlightDifferences = (text1: string, text2: string) => {
    if (!text1 || !text2) return { text1, text2 };
    
    // This is a simple implementation - in a real app, use a proper diff algorithm
    const words1 = text1.split(" ");
    const words2 = text2.split(" ");
    
    const maxLength = Math.max(words1.length, words2.length);
    const highlighted1 = [];
    const highlighted2 = [];
    
    for (let i = 0; i < maxLength; i++) {
      if (i >= words1.length) {
        highlighted2.push(`<span class="bg-green-100 dark:bg-green-900">${words2[i]}</span>`);
      } else if (i >= words2.length) {
        highlighted1.push(`<span class="bg-red-100 dark:bg-red-900">${words1[i]}</span>`);
      } else if (words1[i] !== words2[i]) {
        highlighted1.push(`<span class="bg-red-100 dark:bg-red-900">${words1[i]}</span>`);
        highlighted2.push(`<span class="bg-green-100 dark:bg-green-900">${words2[i]}</span>`);
      } else {
        highlighted1.push(words1[i]);
        highlighted2.push(words2[i]);
      }
    }
    
    return {
      text1: highlighted1.join(" "),
      text2: highlighted2.join(" ")
    };
  };
  
  const getVersionContent = (versionId: string) => {
    // In a real app, this would fetch the actual content of that version
    // For this demo, we're returning the current content
    return policy.content;
  };
  
  const getVersionInfo = (versionId: string) => {
    return policy.versions.find(v => v.version_id === versionId);
  };
  
  const handleDownloadComparison = () => {
    // Create a formatted comparison document
    const version1Info = getVersionInfo(version1);
    const version2Info = getVersionInfo(version2);
    
    if (!version1Info || !version2Info) return;
    
    const comparisonText = `
# Version Comparison: ${policy.title}

## Version ${version1Info.version_label} (${format(new Date(version1Info.created_at), "PPP")})
Created by: ${version1Info.edited_by}
Description: ${version1Info.description}

## Version ${version2Info.version_label} (${format(new Date(version2Info.created_at), "PPP")})
Created by: ${version2Info.edited_by}
Description: ${version2Info.description}

## Differences
The content differences would be highlighted here in a real application.
    `;
    
    // Create a blob and download
    const blob = new Blob([comparisonText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${policy.title}_version_comparison.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const content1 = version1 ? getVersionContent(version1) : "";
  const content2 = version2 ? getVersionContent(version2) : "";
  
  const { text1, text2 } = highlightDifferences(content1, content2);
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] sm:h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Compare Policy Versions</DialogTitle>
        </DialogHeader>
        
        <div className="flex space-x-4 mb-4">
          <div className="flex-1">
            <Select value={version1} onValueChange={setVersion1}>
              <SelectTrigger>
                <SelectValue placeholder="Select version" />
              </SelectTrigger>
              <SelectContent>
                {policy.versions.map((version) => (
                  <SelectItem key={version.version_id} value={version.version_id}>
                    {version.version_label} ({format(new Date(version.created_at), "PP")})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {version1 && (
              <div className="text-xs text-muted-foreground mt-1">
                {getVersionInfo(version1)?.edited_by} - {getVersionInfo(version1)?.description}
              </div>
            )}
          </div>
          <div className="flex-1">
            <Select value={version2} onValueChange={setVersion2}>
              <SelectTrigger>
                <SelectValue placeholder="Select version" />
              </SelectTrigger>
              <SelectContent>
                {policy.versions.map((version) => (
                  <SelectItem key={version.version_id} value={version.version_id}>
                    {version.version_label} ({format(new Date(version.created_at), "PP")})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {version2 && (
              <div className="text-xs text-muted-foreground mt-1">
                {getVersionInfo(version2)?.edited_by} - {getVersionInfo(version2)?.description}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex-1 min-h-0">
          <div className="flex h-full border rounded-md">
            <div className="flex-1 border-r">
              <div className="p-2 bg-muted font-medium text-sm border-b">Version {version1 && getVersionInfo(version1)?.version_label}</div>
              <ScrollArea className="h-[calc(100%-33px)]">
                <div className="p-4 text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: text1 }} />
              </ScrollArea>
            </div>
            <div className="flex-1">
              <div className="p-2 bg-muted font-medium text-sm border-b">Version {version2 && getVersionInfo(version2)?.version_label}</div>
              <ScrollArea className="h-[calc(100%-33px)]">
                <div className="p-4 text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: text2 }} />
              </ScrollArea>
            </div>
          </div>
        </div>
        
        <DialogFooter className="mt-4">
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button 
              onClick={handleDownloadComparison}
              disabled={!version1 || !version2}
            >
              Download Comparison
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
