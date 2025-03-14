
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, Github, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Switch } from '@/components/ui/switch';

const navigationItems = [
  { name: 'Home', path: '/' },
  { name: 'Documentation', path: '/documentation' },
  { name: 'Deployment', path: '/deployment' },
  { name: 'API', path: '/api' },
];

interface NavbarProps {
  className?: string;
  transparent?: boolean;
}

const Navbar = ({ 
  className, 
  transparent = false 
}: NavbarProps) => {
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
        <div className="flex items-center justify-between">
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
                <Link key={item.name} to={item.path} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
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
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
