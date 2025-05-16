
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, FilterIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterChange?: (filter: string) => void;
}

export function SearchBar({ onSearch, onFilterChange }: SearchBarProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="relative flex items-center w-full">
      <div className="relative w-full">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search policies..."
          className="pl-10 pr-10"
          onChange={handleInputChange}
        />
      </div>
      {onFilterChange && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="absolute right-2">
              <FilterIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter By</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => onFilterChange("all")}>
                All Policies
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilterChange("access")}>
                Access Control
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilterChange("data")}>
                Data Classification
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilterChange("network")}>
                Network Security
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilterChange("user")}>
                User Account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilterChange("incident")}>
                Incident Handling
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
