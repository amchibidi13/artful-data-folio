
import React from 'react';
import { useSiteContent } from '@/hooks/useSiteData';
import { Skeleton } from '@/components/ui/skeleton';

interface GenericSectionProps {
  sectionName: string;
}

const GenericSection: React.FC<GenericSectionProps> = ({ sectionName }) => {
  const { data: sectionContent, isLoading } = useSiteContent(sectionName);
  
  // Get content by type helper
  const getContentByType = (type: string): string => {
    if (!sectionContent) return '';
    const content = sectionContent.find(item => item.content_type === type);
    return content ? content.content : '';
  };

  // Get styled content - applies any custom styling from the database
  const getStyledContent = (content: string, type: string): JSX.Element => {
    const styles = sectionContent?.find(item => item.content_type === `${type}_style`)?.content;
    
    let styleObj = {};
    if (styles) {
      try {
        styleObj = JSON.parse(styles);
      } catch (err) {
        console.error("Error parsing styles:", err);
      }
    }
    
    return <div style={styleObj} dangerouslySetInnerHTML={{ __html: content }} />;
  };

  if (isLoading) {
    return (
      <section id={sectionName.toLowerCase()} className="py-20">
        <div className="container">
          <Skeleton className="h-12 w-64 mx-auto mb-6" />
          <Skeleton className="h-6 w-full max-w-2xl mx-auto mb-12" />
        </div>
      </section>
    );
  }

  const title = getContentByType('title') || sectionName;
  const subtitle = getContentByType('subtitle') || '';
  const content = getContentByType('content') || '';
  const backgroundStyle = getContentByType('background_style') || '';
  
  let sectionStyle = {};
  try {
    if (backgroundStyle) {
      sectionStyle = JSON.parse(backgroundStyle);
    }
  } catch (err) {
    console.error("Error parsing background style:", err);
  }

  return (
    <section id={sectionName.toLowerCase()} className="py-20" style={sectionStyle}>
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
            {getStyledContent(title, 'title')}
          </h2>
        )}
        
        {subtitle && (
          <div className="text-xl text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
            {getStyledContent(subtitle, 'subtitle')}
          </div>
        )}
        
        {content && (
          <div className="prose max-w-4xl mx-auto">
            {getStyledContent(content, 'content')}
          </div>
        )}
      </div>
    </section>
  );
};

export default GenericSection;
