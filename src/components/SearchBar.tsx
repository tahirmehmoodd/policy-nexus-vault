
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
    console.log('SearchBar - Input change:', e.target.value);
    onSearch(e.target.value);
  };

  const handleFilterClick = (filter: string) => {
    console.log('SearchBar - Filter clicked:', filter);
    if (onFilterChange) {
      onFilterChange(filter);
    }
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
              <DropdownMenuItem onClick={() => handleFilterClick("all")}>
                All Policies
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterClick("access")}>
                Access Control
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterClick("data")}>
                Data Classification
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterClick("network")}>
                Network Security
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterClick("user")}>
                User Account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterClick("incident")}>
                Incident Handling
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
