
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useNavigationItems } from '@/hooks/useSiteData';
import { usePages } from '@/hooks/useSiteData';
import { SearchBar } from '@/components/SearchBar';

const Header = () => {
  const { data: navigationItems } = useNavigationItems();
  const { data: pages } = usePages();

  // Process pages to extract menu items (if they are set to include_in_navigation)
  const menuItems = React.useMemo(() => {
    if (!pages) return [];
    return pages
      .filter(page => page.is_visible && page.include_in_navigation && page.page_name !== 'admin')
      .sort((a, b) => a.display_order - b.display_order)
      .map(page => ({
        label: page.page_name,
        target: page.page_link || page.page_name.toLowerCase(),
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
          MyWebsite
        </Link>
        
        <div className="hidden md:flex items-center">
          {menuItems.map((item, index) => renderNavigationItem(item, index))}
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="hidden md:block w-64">
            <SearchBar />
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin">Admin</Link>
          </Button>
        </div>
      </div>
      <div className="md:hidden container mx-auto px-4 py-2 border-t">
        <SearchBar />
      </div>
    </header>
  );
};

export default Header;
