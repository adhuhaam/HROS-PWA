import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 rounded-lg transition-all duration-300 hover:bg-accent hover:text-accent-foreground"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4 transition-all rotate-0 scale-100" />
      ) : (
        <Sun className="h-4 w-4 transition-all rotate-0 scale-100" />
      )}
    </Button>
  );
}