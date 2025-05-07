
import React from 'react';
import ArticleCard, { ArticleProps } from './ArticleCard';

const articles: ArticleProps[] = [
  {
    title: "Demystifying Neural Networks: A Beginner's Guide",
    excerpt: "A comprehensive introduction to neural networks, explaining the basic concepts without the complex math.",
    date: "May 1, 2023",
    readTime: "8",
    category: "Machine Learning",
    link: "#"
  },
  {
    title: "Data Visualization Best Practices for Effective Communication",
    excerpt: "Learn how to create impactful visualizations that effectively communicate your data insights.",
    date: "April 15, 2023",
    readTime: "6",
    category: "Data Visualization",
    link: "#"
  },
  {
    title: "A/B Testing: Statistical Methods for Decision Making",
    excerpt: "An in-depth look at statistical methods for designing and analyzing A/B tests for business decisions.",
    date: "March 22, 2023",
    readTime: "10",
    category: "Statistics",
    link: "#"
  },
  {
    title: "Feature Engineering Techniques for Machine Learning Models",
    excerpt: "Discover effective feature engineering techniques to improve your machine learning models.",
    date: "February 10, 2023",
    readTime: "7",
    category: "Feature Engineering",
    link: "#"
  }
];

const ArticlesSection: React.FC = () => {
  return (
    <section id="articles" className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Latest Articles</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Thoughts, tutorials, and insights about data science, machine learning, and analytics.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {articles.map((article, index) => (
            <ArticleCard
              key={index}
              {...article}
            />
          ))}
        </div>
        
        <div className="flex justify-center mt-12">
          <a 
            href="#" 
            className="text-data-purple hover:text-data-indigo underline underline-offset-4"
          >
            View all articles
          </a>
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;
