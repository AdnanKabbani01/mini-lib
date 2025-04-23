import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBooksProps {
  onSearch: (searchTerm: string) => void;
  initialSearchTerm?: string;
}

export function SearchBooks({
  onSearch,
  initialSearchTerm = "",
}: SearchBooksProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-lg space-x-2">
      <Input
        type="text"
        placeholder="Search by title, author, or ISBN..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full"
      />
      <Button type="submit">Search</Button>
    </form>
  );
}
