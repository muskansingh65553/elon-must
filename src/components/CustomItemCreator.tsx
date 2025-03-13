
import { useState } from "react";
import { useSpending, Item } from "@/contexts/SpendingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export function CustomItemCreator() {
  const { addCustomItem } = useSpending();
  const [isOpen, setIsOpen] = useState(false);
  const [newItem, setNewItem] = useState<Partial<Item>>({
    name: "",
    price: 0,
    description: "",
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027"
  });
  
  const handleCreate = () => {
    if (!newItem.name || !newItem.price) {
      toast.error("Please provide a name and price for your item");
      return;
    }
    
    addCustomItem({
      id: "", // Will be auto-generated
      name: newItem.name,
      price: newItem.price || 0,
      description: newItem.description || "Custom item",
      image: newItem.image || "https://images.unsplash.com/photo-1472396961693-142e6e269027",
      category: "custom"
    });
    
    setNewItem({
      name: "",
      price: 0,
      description: "",
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027"
    });
    
    setIsOpen(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Custom Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Your Own Item</DialogTitle>
          <DialogDescription>
            Add a custom item that you'd like to buy with Elon's money
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Item Name
            </label>
            <Input
              id="name"
              placeholder="e.g. My Dream House"
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="price" className="text-sm font-medium">
              Price (USD)
            </label>
            <Input
              id="price"
              type="number"
              placeholder="e.g. 1000000"
              value={newItem.price || ""}
              onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value)})}
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              placeholder="Describe your item..."
              value={newItem.description || ""}
              onChange={(e) => setNewItem({...newItem, description: e.target.value})}
              rows={3}
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="image" className="text-sm font-medium">
              Image URL (optional)
            </label>
            <Input
              id="image"
              placeholder="https://example.com/image.jpg"
              value={newItem.image || ""}
              onChange={(e) => setNewItem({...newItem, image: e.target.value})}
            />
            <p className="text-xs text-muted-foreground">
              Leave blank to use a default image
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={handleCreate}>Create Item</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
