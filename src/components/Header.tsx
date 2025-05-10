
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useNavigationItems, usePages } from '@/hooks/useSiteData';
import { NavigationItem, Page } from '@/types/database-types';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: navigationItems } = useNavigationItems();
  const { data: pages } = usePages();

  const visiblePages = React.useMemo(() => {
    if (!pages) return [];
    return pages.filter(page => page.is_visible && !page.is_system_page);
  }, [pages]);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-bold text-xl">Website</Link>
          <nav className="hidden md:flex items-center gap-6">
            {/* Regular navigation items */}
            {navigationItems?.map((item: NavigationItem) => (
              <a 
                key={item.id} 
                href={`#${item.target_section}`}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.label}
              </a>
            ))}
            
            {/* Links to other pages */}
            {visiblePages.map((page: Page) => (
              <Link
                key={page.id}
                to={`/${page.page_link || page.page_name.toLowerCase()}`}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {page.page_name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/admin" className="hidden md:block">
            <Button variant="outline">Admin</Button>
          </Link>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="flex flex-col gap-4 mt-8">
                {/* Mobile navigation items */}
                {navigationItems?.map((item: NavigationItem) => (
                  <a 
                    key={item.id} 
                    href={`#${item.target_section}`}
                    className="text-sm font-medium transition-colors hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                
                {/* Mobile links to other pages */}
                {visiblePages.map((page: Page) => (
                  <Link
                    key={page.id}
                    to={`/${page.page_link || page.page_name.toLowerCase()}`}
                    className="text-sm font-medium transition-colors hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    {page.page_name}
                  </Link>
                ))}
                
                <Link 
                  to="/admin" 
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Admin
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
