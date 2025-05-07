
import React from 'react';
import { motion } from 'framer-motion';
import ProjectCard, { ProjectProps } from './ProjectCard';

const projects: ProjectProps[] = [
  {
    title: "Customer Segmentation Analysis",
    description: "Applied K-means clustering to segment customers based on purchasing behavior and demographics.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    tags: ["K-means", "Python", "Scikit-learn", "Data Visualization"],
    link: "#"
  },
  {
    title: "Natural Language Processing for Sentiment Analysis",
    description: "Built an NLP model to analyze sentiment in customer reviews for a retail company.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    tags: ["NLP", "BERT", "PyTorch", "Sentiment Analysis"],
    link: "#"
  },
  {
    title: "Time Series Forecasting for Sales Prediction",
    description: "Implemented ARIMA and Prophet models to forecast monthly sales for a retail chain.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    tags: ["Time Series", "Prophet", "ARIMA", "Forecasting"],
    link: "#"
  },
  {
    title: "Image Classification with Deep Learning",
    description: "Developed a convolutional neural network for classifying medical images.",
    image: "https://images.unsplash.com/photo-1564865878688-9a244444042a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    tags: ["CNN", "TensorFlow", "Deep Learning", "Medical Imaging"],
    link: "#"
  }
];

const ProjectsSection: React.FC = () => {
  return (
    <section id="projects" className="py-20 bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Featured Projects</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            A collection of data science projects showcasing my skills in machine learning, data analysis, and visualization.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              {...project}
            />
          ))}
          
          <div className="md:col-span-2 lg:col-span-3 flex justify-center mt-8">
            <a 
              href="https://github.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-data-purple hover:text-data-indigo underline underline-offset-4"
            >
              View more projects on GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
