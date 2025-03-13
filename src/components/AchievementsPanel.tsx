
import { useSpending } from "@/contexts/SpendingContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy, CheckCircle2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function AchievementsPanel() {
  const { achievements } = useSpending();
  
  const unlockedCount = achievements.filter(achievement => achievement.unlocked).length;
  const totalCount = achievements.length;
  
  return (
    <Sheet>
      <SheetTrigger className="flex items-center gap-2 rounded-lg px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors">
        <Trophy className="h-4 w-4" />
        <span>Achievements</span>
        <span className="text-xs ml-1">
          {unlockedCount}/{totalCount}
        </span>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Achievements</SheetTitle>
          <SheetDescription>
            Track your spending milestones and unlock achievements
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-8rem)] pr-4 mt-6">
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id}
                className={`p-4 rounded-lg border transition-all ${
                  achievement.unlocked 
                    ? "bg-primary/10 border-primary/30" 
                    : "bg-muted/50 border-border opacity-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    achievement.unlocked ? "bg-primary/20" : "bg-muted"
                  }`}>
                    <Trophy className={`h-5 w-5 ${
                      achievement.unlocked ? "text-primary" : "text-muted-foreground"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{achievement.title}</h3>
                      {achievement.unlocked && (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

