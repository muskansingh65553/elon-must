
import { useState } from "react";
import { useSpending } from "@/contexts/SpendingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Settings, DollarSign } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";

export function CustomBudgetModal() {
  const { setCustomBudget, customBudget, resetPurchases } = useSpending();
  const [amount, setAmount] = useState<string>(customBudget?.toString() || "");
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSetBudget = () => {
    if (!amount) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    const budgetAmount = parseFloat(amount);
    
    if (isNaN(budgetAmount) || budgetAmount <= 0) {
      toast.error("Please enter a valid positive number");
      return;
    }
    
    setCustomBudget(budgetAmount);
    resetPurchases();
    setIsOpen(false);
    toast.success(`Custom budget set to ${formatCurrency(budgetAmount)}`);
  };
  
  const handleResetToElonsBudget = () => {
    setCustomBudget(null);
    resetPurchases();
    setIsOpen(false);
    toast.success("Reset to Elon's full fortune");
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Custom Budget
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Custom Budget</DialogTitle>
          <DialogDescription>
            Want to spend less than Elon's entire fortune? Set a custom budget here.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
            <Input
              type="number"
              placeholder="Enter amount (e.g. 10000000000)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>Some suggestions:</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                { label: "$1 Million", value: 1000000 },
                { label: "$1 Billion", value: 1000000000 },
                { label: "$10 Billion", value: 10000000000 },
                { label: "$100 Billion", value: 100000000000 },
              ].map(option => (
                <Button
                  key={option.value}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(option.value.toString())}
                  className="text-xs"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleResetToElonsBudget}>
            Reset to Elon's Fortune
          </Button>
          <Button onClick={handleSetBudget}>Set Budget</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
