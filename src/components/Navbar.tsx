
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

import Logo from './navigation/Logo';
import DesktopNav from './navigation/DesktopNav';
import ThemeToggle from './navigation/ThemeToggle';
import MobileMenu from './navigation/MobileMenu';
import { navigationItems } from './navigation/navigationItems';

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

  return (
    <motion.header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-300',
        isScrolled || !transparent 
          ? 'border-b border-[#00FF41]/20 bg-black/80 backdrop-blur-md' 
          : 'bg-transparent',
        className
      )}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />
          
          {!isMobile && (
            <DesktopNav navigationItems={navigationItems} currentPath={location.pathname} />
          )}
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <a 
              href="https://github.com/devonn-ai/framework" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-white/70 hover:text-white transition-colors"
              aria-label="GitHub Repository"
            >
              <Github className="h-5 w-5" />
            </a>
            
            {/* Mobile menu */}
            {isMobile && (
              <MobileMenu navigationItems={navigationItems} />
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
