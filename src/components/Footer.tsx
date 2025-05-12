
import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteContent } from '@/hooks/useSiteData';

const Footer: React.FC = () => {
  const { data: footerContent } = useSiteContent('footer');
  
  // Get footer content from site content or use defaults
  const companyName = React.useMemo(() => {
    if (footerContent) {
      const content = footerContent.find(content => content.content_type === 'company_name');
      return content ? content.content : 'DataFolio';
    }
    return 'DataFolio';
  }, [footerContent]);
  
  const companyDescription = React.useMemo(() => {
    if (footerContent) {
      const content = footerContent.find(content => content.content_type === 'company_description');
      return content ? content.content : 'A portfolio showcasing data science projects, articles, and insights.';
    }
    return 'A portfolio showcasing data science projects, articles, and insights.';
  }, [footerContent]);
  
  const copyrightText = React.useMemo(() => {
    if (footerContent) {
      const content = footerContent.find(content => content.content_type === 'copyright_text');
      return content ? content.content : `© ${new Date().getFullYear()} ${companyName}. All rights reserved.`;
    }
    return `© ${new Date().getFullYear()} ${companyName}. All rights reserved.`;
  }, [footerContent, companyName]);
  
  const contactEmail = React.useMemo(() => {
    if (footerContent) {
      const content = footerContent.find(content => content.content_type === 'contact_email');
      return content ? content.content : 'contact@example.com';
    }
    return 'contact@example.com';
  }, [footerContent]);

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex gap-1.5 items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-data-blue to-data-purple flex items-center justify-center">
                <span className="text-white font-semibold">{companyName.substring(0, 2)}</span>
              </div>
              <span className="font-semibold text-lg">{companyName}</span>
            </div>
            <p className="mt-4 text-gray-400 max-w-xs">
              {companyDescription}
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-xl mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/projects" className="text-gray-400 hover:text-white transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-xl mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
            </div>
            <p className="mt-4 text-gray-400">
              Email: <a href={`mailto:${contactEmail}`} className="hover:text-white transition-colors">{contactEmail}</a>
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>{copyrightText}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
