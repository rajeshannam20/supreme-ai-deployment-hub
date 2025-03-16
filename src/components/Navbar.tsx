
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, Github, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Switch } from '@/components/ui/switch';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetClose 
} from '@/components/ui/sheet';

const navigationItems = [
  { name: 'Home', path: '/' },
  { name: 'Documentation', path: '/documentation' },
  { name: 'Deployment', path: '/deployment' },
  { name: 'API', path: '/api' },
  { name: 'About', path: '/about' },
];

interface NavbarProps {
  className?: string;
  transparent?: boolean;
}

const Navbar = ({ 
  className, 
  transparent = false 
}: NavbarProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Force a reload to ensure theme changes are applied
  useEffect(() => {
    if (isMounted) {
      console.log("Current theme:", theme);
    }
  }, [theme, isMounted]);

  return (
    <motion.header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-300',
        isScrolled || !transparent ? 'border-b bg-background/80 backdrop-blur' : 'bg-transparent',
        className
      )}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Bot className="w-8 h-8 mr-2 text-primary" />
            <Link 
              to="/" 
              className="text-xl font-display font-semibold text-foreground"
            >
              DEVONN<span className="text-primary">.AI</span>
            </Link>
          </div>
          
          {!isMobile && (
            <nav className="hidden md:flex items-center space-x-8">
              {navigationItems.map(item => (
                <Link 
                  key={item.name} 
                  to={item.path} 
                  className={cn(
                    "text-sm font-medium transition-colors",
                    location.pathname === item.path
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          )}
          
          <div className="flex items-center space-x-4">
            {isMounted && (
              <div className="flex items-center space-x-2 bg-secondary/50 p-2 rounded-full">
                <Sun className="h-4 w-4 text-yellow-500" />
                <Switch 
                  checked={theme === 'dark'} 
                  onCheckedChange={toggleTheme}
                  aria-label="Toggle dark mode"
                />
                <Moon className="h-4 w-4 text-blue-500" />
              </div>
            )}
            <a 
              href="https://github.com/devonn-ai/framework" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub Repository"
            >
              <Github className="h-5 w-5" />
            </a>
            
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <Bot className="w-6 h-6 mr-2 text-primary" />
                        <span className="text-lg font-display font-semibold">
                          DEVONN<span className="text-primary">.AI</span>
                        </span>
                      </div>
                      <SheetClose asChild>
                        <Button variant="ghost" size="icon">
                          <X className="h-5 w-5" />
                        </Button>
                      </SheetClose>
                    </div>
                    
                    <nav className="flex flex-col space-y-4">
                      {navigationItems.map(item => (
                        <SheetClose asChild key={item.name}>
                          <Link 
                            to={item.path} 
                            className={cn(
                              "px-2 py-1.5 rounded-md text-sm font-medium transition-colors",
                              location.pathname === item.path
                                ? "bg-secondary text-foreground"
                                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                            )}
                          >
                            {item.name}
                          </Link>
                        </SheetClose>
                      ))}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;

// Define the Button component for the mobile menu
const Button = React.forwardRef<
  HTMLButtonElement, 
  React.ButtonHTMLAttributes<HTMLButtonElement> & { 
    variant?: 'default' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
  }
>(({ 
  className, 
  variant = 'default', 
  size = 'default', 
  ...props 
}, ref) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50",
        {
          'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'default',
          'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
          'text-primary underline-offset-4 hover:underline': variant === 'link',
          'h-10 px-4 py-2': size === 'default',
          'h-9 px-3': size === 'sm',
          'h-11 px-8': size === 'lg',
          'h-9 w-9 p-0': size === 'icon',
        },
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";
