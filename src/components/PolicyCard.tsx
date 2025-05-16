
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileTextIcon, DownloadIcon, EditIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Policy } from "@/types/policy";
import { useToast } from "@/components/ui/use-toast";

interface PolicyCardProps {
  policy: Policy;
  onClick: () => void;
  onEdit?: () => void;
}

export function PolicyCard({ policy, onClick, onEdit }: PolicyCardProps) {
  const { toast } = useToast();
  
  const handleDownload = (event: React.MouseEvent) => {
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
    
    // Create a download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${policy.title.replace(/\s+/g, "_")}-v${policy.currentVersion}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Policy downloaded",
      description: `${policy.title} has been downloaded as JSON`,
    });
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start gap-2">
          <FileTextIcon className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
          <div>
            <CardTitle className="text-lg cursor-pointer hover:text-primary" onClick={onClick}>
              {policy.title}
            </CardTitle>
            <CardDescription className="text-sm mt-1">
              {`Last updated ${formatDistanceToNow(new Date(policy.updated_at), { addSuffix: true })}`}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <p className="text-sm line-clamp-2 text-muted-foreground mb-2">
          {policy.description}
        </p>
        <div className="flex flex-wrap gap-1 mt-2">
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
      <CardFooter className="pt-2 flex justify-between items-center">
        <div className="text-xs text-muted-foreground">
          v{policy.currentVersion}
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <Button variant="ghost" size="sm" onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}>
              <EditIcon className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleDownload}>
            <DownloadIcon className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
