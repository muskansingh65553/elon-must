
import { useSpending, Item } from "@/contexts/SpendingContext";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Minus, Plus, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ItemCardProps {
  item: Item;
}

export function ItemCard({ item }: ItemCardProps) {
  const { buyItem, sellItem, getPurchaseQuantity, remaining } = useSpending();
  const quantity = getPurchaseQuantity(item.id);
  const canBuy = remaining >= item.price;
  
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md transition-all duration-200 hover:shadow-lg border border-slate-200">
      <div className="aspect-[4/3] overflow-hidden bg-slate-100 relative">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg";
            e.currentTarget.onerror = null;
          }}
          loading="lazy"
        />
        <div className="absolute top-2 right-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full bg-white/80 backdrop-blur-sm">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{item.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="absolute top-2 left-2">
          <span className="px-2 py-1 text-xs font-semibold uppercase tracking-wider bg-slate-800/70 text-white rounded">
            {item.category}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-lg mb-1 line-clamp-1">{item.name}</h3>
        <p className="text-xl font-bold text-blue-800 mb-3">
          {formatCurrency(item.price)}
        </p>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={() => sellItem(item)}
            variant="outline"
            size="icon"
            disabled={quantity === 0}
            className="rounded-full"
          >
            <Minus className="h-4 w-4" />
          </Button>
          
          <div className="bg-slate-100 px-4 py-1 rounded-full min-w-12 text-center">
            {quantity}
          </div>
          
          <Button
            onClick={() => buyItem(item)}
            variant="default"
            size="icon"
            disabled={!canBuy}
            className="rounded-full bg-blue-700 hover:bg-blue-800"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
