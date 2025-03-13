
import { useSpending } from "@/contexts/SpendingContext";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export function CartSummary() {
  const { purchases, spent, buyItem, sellItem, resetPurchases } = useSpending();
  
  const itemCount = purchases.reduce((count, purchase) => count + purchase.quantity, 0);
  
  // Group purchases by category for the summary
  const purchasesByCategory = purchases.reduce((acc, purchase) => {
    const { category } = purchase.item;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(purchase);
    return acc;
  }, {} as Record<string, typeof purchases>);
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="relative bg-blue-800 hover:bg-blue-900">
          <ShoppingCart className="h-5 w-5 mr-2" />
          Cart
          {itemCount > 0 && (
            <Badge variant="destructive" className="absolute -top-2 -right-2">
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>
            Items you've purchased with Elon's money
          </SheetDescription>
        </SheetHeader>
        
        {purchases.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ShoppingCart className="h-12 w-12 mx-auto text-slate-400 mb-2" />
              <p className="text-slate-500">Your cart is empty</p>
              <p className="text-sm text-slate-400 mt-1">
                Start spending by adding items from the shop
              </p>
            </div>
          </div>
        ) : (
          <ScrollArea className="flex-1 my-4">
            <div className="space-y-6">
              {Object.entries(purchasesByCategory).map(([category, categoryPurchases]) => (
                <div key={category}>
                  <h3 className="text-sm font-medium text-slate-500 uppercase mb-2">
                    {category.replace(/-/g, ' ')}
                  </h3>
                  <div className="space-y-2">
                    {categoryPurchases.map((purchase) => (
                      <div key={purchase.item.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-md overflow-hidden bg-slate-100">
                            <img 
                              src={purchase.item.image} 
                              alt={purchase.item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium line-clamp-1">{purchase.item.name}</p>
                            <p className="text-sm text-slate-500">
                              {formatCurrency(purchase.item.price)} x {purchase.quantity}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 rounded-full"
                            onClick={() => sellItem(purchase.item)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{purchase.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 rounded-full"
                            onClick={() => buyItem(purchase.item)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        
        <SheetFooter className="flex-col gap-2 sm:flex-col">
          <div className="flex justify-between mb-2">
            <span className="font-medium">Total Spent:</span>
            <span className="font-bold">{formatCurrency(spent)}</span>
          </div>
          <Button 
            variant="destructive" 
            onClick={resetPurchases}
            disabled={purchases.length === 0}
            className="w-full"
          >
            <Trash2 className="h-4 w-4 mr-2" /> Reset All Purchases
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
