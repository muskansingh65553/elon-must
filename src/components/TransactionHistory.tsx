
import { useSpending } from "@/contexts/SpendingContext";
import { formatCurrency } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, RefreshCw } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function TransactionHistory() {
  const { transactionHistory } = useSpending();
  
  // Group transactions by date
  const groupedTransactions = transactionHistory.reduce((acc, transaction) => {
    const date = transaction.timestamp.toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(transaction);
    return acc;
  }, {} as Record<string, typeof transactionHistory>);
  
  return (
    <Sheet>
      <SheetTrigger className="flex items-center gap-2 rounded-lg px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors">
        <History className="h-4 w-4" />
        <span>History</span>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Transaction History</SheetTitle>
          <SheetDescription>
            View all your purchases and actions
          </SheetDescription>
        </SheetHeader>
        
        {transactionHistory.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <History className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No transactions yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Start shopping to see your history
              </p>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-8rem)] pr-4 mt-6">
            <div className="space-y-8">
              {Object.entries(groupedTransactions).map(([date, transactions]) => (
                <div key={date}>
                  <h3 className="text-sm font-medium text-muted-foreground sticky top-0 bg-background py-1">
                    {date}
                  </h3>
                  <div className="space-y-3 mt-3">
                    {transactions.map((transaction, index) => {
                      // Check if it's a reset action
                      if (transaction.item.id === "reset") {
                        return (
                          <div key={`${transaction.timestamp.getTime()}-${index}`} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                            <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center">
                              <RefreshCw className="h-4 w-4 text-secondary" />
                            </div>
                            <div>
                              <p className="font-medium">Reset all purchases</p>
                              <p className="text-xs text-muted-foreground">
                                {transaction.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        );
                      }
                      
                      const isPositive = transaction.quantity > 0;
                      
                      return (
                        <div key={`${transaction.timestamp.getTime()}-${index}`} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-md overflow-hidden bg-muted">
                              <img 
                                src={transaction.item.image} 
                                alt={transaction.item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium line-clamp-1">{transaction.item.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {transaction.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <div className={isPositive ? "text-green-600" : "text-red-600"}>
                            {isPositive ? "+" : "-"}{Math.abs(transaction.quantity)} × {formatCurrency(transaction.item.price)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  );
}