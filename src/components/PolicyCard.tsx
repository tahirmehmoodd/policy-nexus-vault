
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileTextIcon, DownloadIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Policy } from "@/types/policy";

interface PolicyCardProps {
  policy: Policy;
  onClick: () => void;
}

export function PolicyCard({ policy, onClick }: PolicyCardProps) {
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
        <Button variant="ghost" size="sm">
          <DownloadIcon className="h-4 w-4 mr-1" />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
}
