
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useNavigationItems } from '@/hooks/useSiteData';
import { usePages } from '@/hooks/useSiteData';
import { SearchBar } from '@/components/SearchBar';
import { Menu, ChevronDown } from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteData';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

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

  // Get search placeholder text
  const searchPlaceholder = React.useMemo(() => {
    if (siteContent) {
      const searchContent = siteContent.find(content => content.content_type === 'search_placeholder');
      return searchContent ? searchContent.content : 'Search...';
    }
    return 'Search...';
  }, [siteContent]);

  // Get admin button text
  const adminButtonText = React.useMemo(() => {
    if (siteContent) {
      const adminContent = siteContent.find(content => content.content_type === 'admin_button_text');
      return adminContent ? adminContent.content : 'Admin';
    }
    return 'Admin';
  }, [siteContent]);

  // Process sections for navigation (if they are set to include_in_navigation)
  const sectionItems = React.useMemo(() => {
    if (!navigationItems) return [];
    return navigationItems
      .filter(item => item.is_visible)
      .sort((a, b) => a.display_order - b.display_order);
  }, [navigationItems]);

  // Process pages for navigation menu
  const pageItems = React.useMemo(() => {
    if (!pages) return [];
    return pages
      .filter(page => page.is_visible && page.include_in_navigation && page.page_name !== 'admin')
      .sort((a, b) => a.display_order - b.display_order);
  }, [pages]);

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* Hamburger menu for pages */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>{siteTitle}</SheetTitle>
                <SheetDescription>Navigation</SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <nav className="flex flex-col space-y-2">
                  {pageItems.map((page, index) => (
                    <Link 
                      key={page.id} 
                      to={`/${page.page_link || page.page_name.toLowerCase()}`}
                      className={`py-2 px-3 rounded-md transition-colors ${
                        currentPage === (page.page_link || page.page_name.toLowerCase())
                          ? 'bg-accent/50 text-accent-foreground font-medium'
                          : 'hover:bg-accent/20 text-foreground'
                      }`}
                      onClick={() => onPageChange(page.page_name.toLowerCase())}
                    >
                      {page.page_name}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          {/* Website Title */}
          <Link to="/" className="text-xl font-bold" onClick={() => onPageChange('home')}>
            {siteTitle}
          </Link>
          
          {/* Desktop Navigation Menu - Only Section Links */}
          <div className="hidden md:flex items-center">
            <NavigationMenu>
              <NavigationMenuList>
                {sectionItems.map((item, index) => (
                  <NavigationMenuItem key={index}>
                    <Button 
                      variant="link"
                      className={`${currentPage === item.target_section.toLowerCase() ? 'text-primary font-semibold' : 'text-foreground'}`}
                      onClick={() => {
                        if (item.target_section) {
                          const element = document.getElementById(item.target_section);
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                          }
                        }
                      }}
                    >
                      {item.label}
                    </Button>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="hidden md:block w-64">
            <SearchBar placeholder={searchPlaceholder} />
          </div>
          
          {/* Mobile section menu button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          {/* Admin Button */}
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin">{adminButtonText}</Link>
          </Button>
        </div>
      </div>
      
      {/* Mobile section navigation menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t py-4 px-4">
          <nav className="flex flex-col space-y-2">
            {sectionItems.map((item, index) => (
              <Button 
                key={index}
                variant="ghost"
                className={`justify-start ${currentPage === item.target_section.toLowerCase() ? 'bg-accent/50' : ''}`}
                onClick={() => {
                  if (item.target_section) {
                    const element = document.getElementById(item.target_section);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                  setMobileMenuOpen(false);
                }}
              >
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
      )}
      
      <div className="md:hidden container mx-auto px-4 py-2 border-t">
        <SearchBar placeholder={searchPlaceholder} />
      </div>
    </header>
  );
};

export default Header;
