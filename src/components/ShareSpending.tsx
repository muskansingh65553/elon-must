
import { useRef, useState } from "react";
import { useSpending } from "@/contexts/SpendingContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Share2, Download, Copy, Check } from "lucide-react";
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
import html2canvas from "html2canvas";

export function ShareSpending() {
  const { purchases, spent, remaining, customBudget } = useSpending();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);
  
  const totalBudget = customBudget || 244000000000; // Elon's net worth
  
  const handleDownload = async () => {
    if (!shareRef.current) return;
    
    try {
      const canvas = await html2canvas(shareRef.current, {
        scale: 2,
        backgroundColor: theme === 'dark' ? '#1A1F2C' : '#FFFFFF',
        logging: false
      });
      
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "elon-spending.png";
      link.href = url;
      link.click();
      
      toast.success("Image downloaded successfully!");
    } catch (error) {
      console.error("Failed to generate image:", error);
      toast.error("Failed to generate image. Please try again.");
    }
  };
  
  const handleCopyToClipboard = async () => {
    if (!shareRef.current) return;
    
    try {
      const canvas = await html2canvas(shareRef.current, {
        scale: 2,
        backgroundColor: theme === 'dark' ? '#1A1F2C' : '#FFFFFF',
        logging: false
      });
      
      canvas.toBlob(async (blob) => {
        if (!blob) {
          toast.error("Failed to generate image. Please try again.");
          return;
        }
        
        try {
          const item = new ClipboardItem({ "image/png": blob });
          await navigator.clipboard.write([item]);
          
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          
          toast.success("Image copied to clipboard!");
        } catch (error) {
          console.error("Failed to copy image:", error);
          toast.error("Failed to copy image. Please try downloading instead.");
        }
      });
    } catch (error) {
      console.error("Failed to generate image:", error);
      toast.error("Failed to generate image. Please try again.");
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <Share2 className="h-4 w-4 mr-2" />
          Share My Spending
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Elon Spending</DialogTitle>
          <DialogDescription>
            Generate a shareable image of what you bought with Elon's money
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div
            ref={shareRef}
            className={`p-6 rounded-lg border shadow-sm ${
              theme === 'dark' ? 'bg-elon-dark text-white' : 'bg-white text-elon-dark'
            }`}
            style={{ width: "100%", maxWidth: "500px", margin: "0 auto" }}
          >
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold mb-1">How I Spent Elon's Money</h2>
              <p className="text-sm opacity-80">spendelonscash.com</p>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Total Budget:</span>
                <span className="font-medium">{formatCurrency(totalBudget)}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span>Amount Spent:</span>
                <span className="font-medium">{formatCurrency(spent)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Remaining:</span>
                <span className="font-medium">{formatCurrency(remaining)}</span>
              </div>
            </div>
            
            <div className="w-full bg-muted/20 rounded-full h-2 mb-6">
              <div 
                className="h-full bg-elon-red rounded-full"
                style={{ width: `${Math.min((spent / totalBudget) * 100, 100)}%` }}
              ></div>
            </div>
            
            {purchases.length > 0 ? (
              <div className="space-y-3">
                <h3 className="font-medium text-sm mb-2">My Purchases:</h3>
                {purchases.slice(0, 6).map((purchase) => (
                  <div key={purchase.item.id} className="flex items-center justify-between text-sm">
                    <span>{purchase.item.name}</span>
                    <span className="font-medium">
                      {purchase.quantity} × {formatCurrency(purchase.item.price)}
                    </span>
                  </div>
                ))}
                {purchases.length > 6 && (
                  <div className="text-center text-sm italic opacity-80">
                    +{purchases.length - 6} more items
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center italic opacity-80">
                No purchases yet
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex-col sm:flex-col gap-2">
          <div className="flex gap-2 w-full">
            <Button onClick={handleCopyToClipboard} className="flex-1">
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? "Copied!" : "Copy to Clipboard"}
            </Button>
            <Button onClick={handleDownload} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
