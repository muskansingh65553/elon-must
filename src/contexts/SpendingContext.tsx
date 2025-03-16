import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { achievements } from "@/data/achievements";

// Elon Musk's net worth in dollars (using a reasonable estimate)
const ELON_NET_WORTH = 335250000000; // Elon's net worth in dollars

export interface Item {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

interface Purchase {
  item: Item;
  quantity: number;
  timestamp: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  condition: (purchases: Purchase[], spent: number, remaining: number) => boolean;
  icon: string;
  unlocked: boolean;
}

interface SpendingContextType {
  items: Item[];
  purchases: Purchase[];
  spent: number;
  remaining: number;
  ELON_NET_WORTH: number;

  buyItem: (item: Item) => void;
  sellItem: (item: Item) => void;
  resetPurchases: () => void;
  getPurchaseQuantity: (itemId: string) => number;
  achievements: Achievement[];
  showFunFact: (fact: string) => void;
  funFacts: string[];
  transactionHistory: Purchase[];
  addCustomItem: (item: Item) => void;
}

const SpendingContext = createContext<SpendingContextType | undefined>(undefined);

export const SpendingProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [spent, setSpent] = useState(0);
  const [remaining, setRemaining] = useState(ELON_NET_WORTH);
  const [achievementsList, setAchievementsList] = useState<Achievement[]>(achievements);
  const [transactionHistory, setTransactionHistory] = useState<Purchase[]>([]);
  const [funFacts, setFunFacts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load items data
  useEffect(() => {
    console.log("[SpendingContext] Initializing context...");
    const loadItems = async () => {
      try {
        setIsLoading(true);
        console.log("[SpendingContext] Loading items data...");
        const itemsModule = await import('@/data/items');
        console.log("[SpendingContext] Items loaded:", itemsModule.default);
        setItems(itemsModule.default);
        setIsLoading(false);
      } catch (error) {
        console.error("[SpendingContext] Failed to load items:", error);
        setError("Failed to load items. Please try again later.");
        setIsLoading(false);
      }
    };

    loadItems();

    // Load purchases from localStorage if available
    console.log("[SpendingContext] Loading saved purchases...");
    const savedPurchases = localStorage.getItem("purchases");
    if (savedPurchases) {
      console.log("[SpendingContext] Found saved purchases:", savedPurchases);
      const parsedPurchases = JSON.parse(savedPurchases);
      setPurchases(parsedPurchases.map((p: any) => ({
        ...p,
        timestamp: new Date(p.timestamp)
      })));
      
      // Calculate spent amount
      const spentAmount = parsedPurchases.reduce(
        (total: number, purchase: Purchase) => total + purchase.item.price * purchase.quantity,
        0
      );
      setSpent(spentAmount);
      setRemaining(ELON_NET_WORTH - spentAmount);
    }

    // Load custom items if available
    const customItems = localStorage.getItem("customItems");
    if (customItems) {
      setItems(prev => [...prev, ...JSON.parse(customItems)]);
    }

    // Load transaction history
    const savedHistory = localStorage.getItem("transactionHistory");
    if (savedHistory) {
      setTransactionHistory(JSON.parse(savedHistory).map((p: any) => ({
        ...p,
        timestamp: new Date(p.timestamp)
      })));
    }


  }, []);

  // Save purchases to localStorage when they change
  useEffect(() => {
    localStorage.setItem("purchases", JSON.stringify(purchases));
    localStorage.setItem("transactionHistory", JSON.stringify(transactionHistory));


    // Check for achievements
    checkAchievements();
  }, [purchases]);

  const checkAchievements = () => {
    const updatedAchievements = achievementsList.map(achievement => {
      if (!achievement.unlocked && achievement.condition(purchases, spent, remaining)) {
        // Achievement unlocked
        toast.success(`Achievement Unlocked: ${achievement.title}`, {
          description: achievement.description,
          duration: 5000,
        });
        return { ...achievement, unlocked: true };
      }
      return achievement;
    });

    setAchievementsList(updatedAchievements);
    localStorage.setItem("achievements", JSON.stringify(updatedAchievements));
  };

  const buyItem = (item: Item) => {
    console.log("[SpendingContext] Attempting to buy item:", item);
    if (remaining < item.price) {
      console.log("[SpendingContext] Purchase failed: Not enough money");
      toast.error("Not enough money left!");
      return;
    }

    const purchaseTimestamp = new Date();
    
    // Check if item is already in purchases
    const existingPurchaseIndex = purchases.findIndex(p => p.item.id === item.id);
    
    if (existingPurchaseIndex >= 0) {
      // Update existing purchase
      const updatedPurchases = [...purchases];
      updatedPurchases[existingPurchaseIndex] = {
        ...updatedPurchases[existingPurchaseIndex],
        quantity: updatedPurchases[existingPurchaseIndex].quantity + 1,
      };
      setPurchases(updatedPurchases);
    } else {
      // Add new purchase
      setPurchases([...purchases, { item, quantity: 1, timestamp: purchaseTimestamp }]);
    }

    // Update spent and remaining
    const newSpent = spent + item.price;
    const newRemaining = ELON_NET_WORTH - newSpent;
    
    setSpent(newSpent);
    setRemaining(newRemaining);

    // Add to transaction history
    const transaction = { item, quantity: 1, timestamp: purchaseTimestamp };
    setTransactionHistory(prev => [transaction, ...prev]);

    // Check for fun facts
    checkForFunFacts(newSpent);
  };

  const checkForFunFacts = (newSpent: number) => {
    // GDP comparisons
    if (newSpent > 1000000000 && !funFacts.includes("billion_spent")) {
      showFunFact("You just spent more than the GDP of several small island nations!");
      setFunFacts(prev => [...prev, "billion_spent"]);
    }
    
    if (newSpent > 10000000000 && !funFacts.includes("10billion_spent")) {
      showFunFact("Your spending now exceeds the GDP of countries like Jamaica and Iceland!");
      setFunFacts(prev => [...prev, "10billion_spent"]);
    }

    // Other milestones
    if (newSpent > ELON_NET_WORTH * 0.5 && !funFacts.includes("half_fortune")) {
      showFunFact("You've spent half of Elon's fortune! Still feeling rich?");
      setFunFacts(prev => [...prev, "half_fortune"]);
    }
  };

  const sellItem = (item: Item) => {
    const existingPurchaseIndex = purchases.findIndex(p => p.item.id === item.id);
    
    if (existingPurchaseIndex < 0 || purchases[existingPurchaseIndex].quantity <= 0) {
      return;
    }
    
    const updatedPurchases = [...purchases];
    
    if (updatedPurchases[existingPurchaseIndex].quantity === 1) {
      // Remove the purchase if quantity will be 0
      updatedPurchases.splice(existingPurchaseIndex, 1);
    } else {
      // Decrease quantity
      updatedPurchases[existingPurchaseIndex] = {
        ...updatedPurchases[existingPurchaseIndex],
        quantity: updatedPurchases[existingPurchaseIndex].quantity - 1,
      };
    }
    
    setPurchases(updatedPurchases);
    
    // Update spent and remaining
    const newSpent = spent - item.price;
    const newRemaining = ELON_NET_WORTH - newSpent;
    
    setSpent(newSpent);
    setRemaining(newRemaining);

    // Add to transaction history (selling is negative quantity)
    const transaction = { item, quantity: -1, timestamp: new Date() };
    setTransactionHistory(prev => [transaction, ...prev]);
  };

  const resetPurchases = () => {
    setPurchases([]);
    setSpent(0);
    setRemaining(ELON_NET_WORTH);
    setAchievementsList(achievements.map(a => ({ ...a, unlocked: false })));
    setTransactionHistory([]);
    setFunFacts([]);
    
    // Clear localStorage
    localStorage.removeItem("purchases");
    localStorage.removeItem("achievements");
    localStorage.removeItem("transactionHistory");
    localStorage.removeItem("funFacts");
    
    toast.success("Everything has been reset! Start fresh with all your money back.");
  };

  const getPurchaseQuantity = (itemId: string) => {
    const purchase = purchases.find(p => p.item.id === itemId);
    return purchase ? purchase.quantity : 0;
  };

  const showFunFact = (fact: string) => {
    toast.info("Fun Fact!", {
      description: fact,
      duration: 6000,
    });
  };

  const addCustomItem = (newItem: Item) => {
    // Generate a unique ID for the custom item
    const customItem = {
      ...newItem,
      id: `custom-${Date.now()}`,
      category: "custom"
    };
    
    setItems(prevItems => [...prevItems, customItem]);
    
    // Save to localStorage
    const customItems = JSON.parse(localStorage.getItem("customItems") || "[]");
    localStorage.setItem("customItems", JSON.stringify([...customItems, customItem]));
    
    toast.success(`Added "${newItem.name}" to your custom items!`);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">
      {error}
    </div>;
  }

  return (
    <SpendingContext.Provider
      value={{
        items,
        purchases,
        spent,
        remaining,
        ELON_NET_WORTH,

        buyItem,
        sellItem,
        resetPurchases,
        getPurchaseQuantity,
        achievements: achievementsList,
        showFunFact,
        funFacts,
        transactionHistory,
        addCustomItem
      }}
    >
      {children}
    </SpendingContext.Provider>
  );
};

export const useSpending = (): SpendingContextType => {
  const context = useContext(SpendingContext);
  if (context === undefined) {
    throw new Error("useSpending must be used within a SpendingProvider");
  }
  return context;
};

