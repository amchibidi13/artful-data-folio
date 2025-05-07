
import React from 'react';
import { Button } from '@/components/ui/button';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute -top-8 -left-8 w-64 h-64 bg-data-purple/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 rounded-xl overflow-hidden shadow-lg border border-gray-200">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" 
                alt="Data Scientist" 
                className="object-cover w-full h-full"
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">About Me</h2>
            <p className="text-gray-600">
              I'm a data scientist with expertise in machine learning, statistical analysis, and data visualization. With over 5 years of experience, I've helped companies leverage their data to make informed decisions and solve complex problems.
            </p>
            <p className="text-gray-600">
              My work spans across various industries including finance, healthcare, and e-commerce. I'm passionate about extracting meaningful insights from data and communicating them in a clear, accessible way.
            </p>
            
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <h3 className="font-semibold text-lg">Skills</h3>
                <ul className="text-gray-600 space-y-2 mt-2">
                  <li>• Machine Learning</li>
                  <li>• Data Analysis</li>
                  <li>• Statistical Modeling</li>
                  <li>• Python, R, SQL</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Education</h3>
                <ul className="text-gray-600 space-y-2 mt-2">
                  <li>• M.S. in Data Science</li>
                  <li>• B.S. in Computer Science</li>
                  <li>• Certified Data Scientist</li>
                </ul>
              </div>
            </div>
            
            <div className="pt-4">
              <Button 
                className="bg-data-purple hover:bg-data-indigo"
                onClick={() => window.open('/resume.pdf', '_blank')}
              >
                Download Resume
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
