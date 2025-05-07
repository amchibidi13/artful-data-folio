
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface ProjectProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
}

const ProjectCard: React.FC<ProjectProps> = ({ title, description, image, tags, link }) => {
  return (
    <Card className="overflow-hidden border border-gray-200 project-card-hover">
      <div className="h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 ease-in-out"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs bg-gray-50 text-gray-700">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-600">
          {description}
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full border-data-purple text-data-purple hover:text-data-indigo hover:border-data-indigo"
          onClick={() => window.open(link, '_blank')}
        >
          View Project
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
