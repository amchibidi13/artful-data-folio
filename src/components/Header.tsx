
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useNavigationItems } from '@/hooks/useSiteData';
import { usePages } from '@/hooks/useSiteData';
import { SearchBar } from '@/components/SearchBar';
import { Menu } from 'lucide-react';
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

const Header = () => {
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
        target: page.page_name.toLowerCase(),
        type: 'link'
      }));
  }, [pages]);

  const renderNavigationItem = (item: any, index: number) => {
    if (!item.label) return null;
    
    if (item.type === 'button') {
      return (
        <Button key={index} variant="default" size="sm" asChild>
          <Link to={`/${item.target}`}>{item.label}</Link>
        </Button>
      );
    } else if (item.type === 'outline') {
      return (
        <Button key={index} variant="outline" size="sm" asChild>
          <Link to={`/${item.target}`}>{item.label}</Link>
        </Button>
      );
    } else {
      // Default to link
      return (
        <Button key={index} variant="ghost" size="sm" asChild>
          <Link to={`/${item.target}`}>{item.label}</Link>
        </Button>
      );
    }
  };

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          {siteTitle}
        </Link>
        
        {/* Desktop Navigation Menu */}
        <div className="hidden md:flex items-center space-x-1">
          <NavigationMenu>
            <NavigationMenuList>
              {menuItems.map((item, index) => (
                <NavigationMenuItem key={index}>
                  <Link to={`/${item.target}`} className={navigationMenuTriggerStyle()}>
                    {item.label}
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="hidden md:block w-64">
            <SearchBar />
          </div>
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
                to={`/${item.target}`}
                className="px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
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
