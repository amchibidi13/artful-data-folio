
import React from 'react';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="w-full py-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm fixed top-0 z-10">
      <div className="container flex justify-between items-center">
        <div className="flex gap-1.5 items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-data-blue to-data-purple flex items-center justify-center">
            <span className="text-white font-semibold">DS</span>
          </div>
          <span className="font-semibold text-lg">DataFolio</span>
        </div>
        <nav className="hidden md:flex gap-6 items-center">
          <Button 
            variant="link" 
            className="text-gray-700 hover:text-data-purple"
            onClick={() => scrollToSection('projects')}
          >
            Projects
          </Button>
          <Button 
            variant="link" 
            className="text-gray-700 hover:text-data-purple"
            onClick={() => scrollToSection('articles')}
          >
            Articles
          </Button>
          <Button 
            variant="link" 
            className="text-gray-700 hover:text-data-purple"
            onClick={() => scrollToSection('about')}
          >
            About
          </Button>
          <Button 
            variant="default" 
            className="bg-data-purple hover:bg-data-indigo"
            onClick={() => scrollToSection('contact')}
          >
            Contact
          </Button>
        </nav>
        
        <Button variant="outline" size="icon" className="md:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </Button>
      </div>
    </header>
  );
};

export default Header;
