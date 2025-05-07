
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface ArticleProps {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  link: string;
}

const ArticleCard: React.FC<ArticleProps> = ({ title, excerpt, date, readTime, category, link }) => {
  return (
    <Card className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700">
            {category}
          </Badge>
          <span className="text-xs text-gray-500">{date}</span>
        </div>
        <CardTitle className="text-xl">
          <a 
            href={link} 
            className="hover:text-data-purple transition-colors duration-200"
            target="_blank" 
            rel="noopener noreferrer"
          >
            {title}
          </a>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-600">
          {excerpt}
        </CardDescription>
      </CardContent>
      <CardFooter className="text-xs text-gray-500">
        {readTime} min read
      </CardFooter>
    </Card>
  );
};

export default ArticleCard;
