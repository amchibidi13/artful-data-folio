
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useNavigationItems } from '@/hooks/useSiteData';
import { usePages } from '@/hooks/useSiteData';
import { SearchBar } from '@/components/SearchBar';
import { Menu, ChevronDown } from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteData';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onPageChange: (pageName: string) => void;
  currentPage: string;
}

const Header: React.FC<HeaderProps> = ({ onPageChange, currentPage }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: navigationItems } = useNavigationItems();
  const { data: pages } = usePages();
  const { data: siteContent } = useSiteContent('header');
  
  // Get the site title from site content or use default
  const siteTitle = React.useMemo(() => {
    if (siteContent) {
      const titleContent = siteContent.find(content => content.content_type === 'site_title');
      return titleContent ? titleContent.content : 'MyWebsite';
    }
    return 'MyWebsite';
  }, [siteContent]);

  // Process pages to extract menu items (if they are set to include_in_navigation)
  const menuItems = React.useMemo(() => {
    if (!pages) return [];
    return pages
      .filter(page => page.is_visible && page.include_in_navigation && page.page_name !== 'admin')
      .sort((a, b) => a.display_order - b.display_order)
      .map(page => ({
        label: page.page_name,
        pageName: page.page_name,
        type: 'link'
      }));
  }, [pages]);

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-xl font-bold" onClick={() => onPageChange('home')}>
            {siteTitle}
          </Link>
          
          {/* Desktop Navigation Menu */}
          <div className="hidden md:flex items-center">
            <NavigationMenu>
              <NavigationMenuList>
                {menuItems.map((item, index) => (
                  <NavigationMenuItem key={index}>
                    <Link 
                      to="/" 
                      className={`${navigationMenuTriggerStyle()} ${currentPage === item.pageName.toLowerCase() ? 'bg-accent/50' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange(item.pageName.toLowerCase());
                      }}
                    >
                      {item.label}
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="hidden md:block w-64">
            <SearchBar />
          </div>
          
          {/* Pages Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Pages <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              {pages && pages
                .filter(page => page.is_visible && page.page_name !== 'admin')
                .map((page) => (
                  <DropdownMenuItem 
                    key={page.id}
                    className="cursor-pointer"
                    onClick={() => onPageChange(page.page_name.toLowerCase())}
                  >
                    {page.page_name}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin">Admin</Link>
          </Button>
          
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t py-4 px-4">
          <nav className="flex flex-col space-y-2">
            {menuItems.map((item, index) => (
              <Link 
                key={index} 
                to="/"
                className={`px-4 py-2 text-sm hover:bg-gray-100 rounded-md ${currentPage === item.pageName.toLowerCase() ? 'bg-accent/50' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(item.pageName.toLowerCase());
                  setMobileMenuOpen(false);
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
      
      <div className="md:hidden container mx-auto px-4 py-2 border-t">
        <SearchBar />
      </div>
    </header>
  );
};

export default Header;
