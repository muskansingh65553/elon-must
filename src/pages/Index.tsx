import { NetWorthCounter } from "@/components/NetWorthCounter";
import { ItemsGrid } from "@/components/ItemsGrid";
import { CartSummary } from "@/components/CartSummary";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TransactionHistory } from "@/components/TransactionHistory";
import { AchievementsPanel } from "@/components/AchievementsPanel";
import { CustomBudgetModal } from "@/components/CustomBudgetModal";
import { CustomItemCreator } from "@/components/CustomItemCreator";
import { ShareSpending } from "@/components/ShareSpending";
import { useSpending } from "@/contexts/SpendingContext";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const Index = () => {
  const { resetPurchases } = useSpending();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold text-blue-800 dark:text-blue-400 truncate">
            SPEND ELON'S MONEY
          </h1>
          
          <div className="flex items-center gap-2 md:gap-3">
            <ThemeToggle />
            <CartSummary />
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4">
        {/* Money Counter - Sticky positioning */}
        <div className="sticky top-14 z-[5] -mx-4 px-4 py-4 bg-gray-50 dark:bg-gray-900">
          <NetWorthCounter />
        </div>
        
        <div className="space-y-6 mt-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <TransactionHistory />
              <AchievementsPanel />
              <Button
                variant="destructive"
                onClick={resetPurchases}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Reset Purchases
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <CustomBudgetModal />
              <CustomItemCreator />
              <ShareSpending />
            </div>
          </div>
          
          <ItemsGrid />
        </div>
      </main>
      
      <footer className="border-t py-6 mt-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>This is a simulation for entertainment purposes only.</p>
          <p className="mt-1">
            Created with ❤️ using React and Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;