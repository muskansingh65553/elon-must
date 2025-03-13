
import { useState } from "react";
import { useSpending } from "@/contexts/SpendingContext";
import { ItemCard } from "./ItemCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const CATEGORIES = [
  "all",
  "vehicles",
  "real-estate",
  "collectibles",
  "experiences",
  "business",
  "education",
  "fashion",
  "food",
  "charity",
  "technology",
  "custom"
];

export function ItemsGrid() {
  const { items } = useSpending();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Input
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-slate-300 focus-visible:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        </div>
        
        <div className="flex overflow-x-auto gap-2 pb-2 md:pb-0 scrollbar-none">
          {CATEGORIES.map(category => {
            // Get first letter capitalized and rest of the category name
            const displayName = category.charAt(0).toUpperCase() + category.slice(1);
            // Replace dashes with spaces for display
            const formattedName = displayName.replace(/-/g, ' ');
            
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-700 text-white"
                    : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                }`}
              >
                {formattedName}
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredItems.map(item => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
      
      {filteredItems.length === 0 && (
        <div className="text-center py-10">
          <p className="text-slate-500">No items found. Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
