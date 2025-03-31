
import React from 'react';
import NavLink from './NavLink';

interface DesktopNavProps {
  navigationItems: Array<{ name: string, path: string }>;
  currentPath: string;
}

const DesktopNav: React.FC<DesktopNavProps> = ({ navigationItems, currentPath }) => {
  return (
    <nav className="hidden md:flex items-center space-x-8">
      {navigationItems.map(item => (
        <NavLink 
          key={item.name} 
          to={item.path} 
          currentPath={currentPath}
        >
          {item.name}
        </NavLink>
      ))}
    </nav>
  );
};

export default DesktopNav;
