
import { Achievement } from "@/contexts/SpendingContext";
import { Trophy, Rocket, Car, Home, Ship, DollarSign, Crown, Coffee, Heart, Globe } from "lucide-react";

export const achievements: Achievement[] = [
  {
    id: "first-purchase",
    title: "First-Time Spender",
    description: "Make your first purchase",
    condition: (purchases) => purchases.length > 0,
    icon: "DollarSign",
    unlocked: false
  },
  {
    id: "billion-club",
    title: "Billionaire Club",
    description: "Spend over $1 billion",
    condition: (_, spent) => spent >= 1000000000,
    icon: "Crown",
    unlocked: false
  },
  {
    id: "car-collector",
    title: "Luxury Car Collector",
    description: "Buy at least 5 luxury vehicles",
    condition: (purchases) => {
      const vehicleCount = purchases.reduce((count, purchase) => {
        if (purchase.item.category === "vehicles") {
          return count + purchase.quantity;
        }
        return count;
      }, 0);
      return vehicleCount >= 5;
    },
    icon: "Car",
    unlocked: false
  },
  {
    id: "real-estate-mogul",
    title: "Real Estate Mogul",
    description: "Own at least $100 million in real estate",
    condition: (purchases) => {
      const realEstateValue = purchases.reduce((total, purchase) => {
        if (purchase.item.category === "real-estate") {
          return total + (purchase.item.price * purchase.quantity);
        }
        return total;
      }, 0);
      return realEstateValue >= 100000000;
    },
    icon: "Home",
    unlocked: false
  },
  {
    id: "space-enthusiast",
    title: "Space Enthusiast",
    description: "Buy a space tourism ticket",
    condition: (purchases) => {
      return purchases.some(purchase => purchase.item.id === "space-tourism" && purchase.quantity > 0);
    },
    icon: "Rocket",
    unlocked: false
  },
  {
    id: "yacht-life",
    title: "Yacht Life",
    description: "Purchase a luxury super yacht",
    condition: (purchases) => {
      return purchases.some(purchase => purchase.item.id === "super-yacht" && purchase.quantity > 0);
    },
    icon: "Ship",
    unlocked: false
  },
  {
    id: "coffee-addict",
    title: "Coffee Addict",
    description: "Buy 100 cups of coffee",
    condition: (purchases) => {
      const coffeeCount = purchases.find(p => p.item.id === "coffee")?.quantity || 0;
      return coffeeCount >= 100;
    },
    icon: "Coffee",
    unlocked: false
  },
  {
    id: "philanthropist",
    title: "Philanthropist",
    description: "Donate at least $50 million to charity",
    condition: (purchases) => {
      const charityAmount = purchases.reduce((total, purchase) => {
        if (purchase.item.category === "charity") {
          return total + (purchase.item.price * purchase.quantity);
        }
        return total;
      }, 0);
      return charityAmount >= 50000000;
    },
    icon: "Heart",
    unlocked: false
  },
  {
    id: "global-mogul",
    title: "Global Mogul",
    description: "Own property on at least 3 continents",
    condition: (purchases) => {
      // This would need actual continent data for each property
      // Using a simplified check here
      const hasIsland = purchases.some(p => p.item.id === "private-island" && p.quantity > 0);
      const hasMansion = purchases.some(p => p.item.id === "mansion-beverly-hills" && p.quantity > 0);
      const hasRealEstate = purchases.filter(p => p.item.category === "real-estate").length >= 2;
      
      return hasIsland && hasMansion && hasRealEstate;
    },
    icon: "Globe",
    unlocked: false
  },
  {
    id: "sports-tycoon",
    title: "Sports Tycoon",
    description: "Own both an NBA team and a Premier League team",
    condition: (purchases) => {
      const hasNbaTeam = purchases.some(p => p.item.id === "nba-team" && p.quantity > 0);
      const hasFootballTeam = purchases.some(p => p.item.id === "football-team" && p.quantity > 0);
      
      return hasNbaTeam && hasFootballTeam;
    },
    icon: "Trophy",
    unlocked: false
  }
];
