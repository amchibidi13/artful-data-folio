
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useSiteContent, getContentByType } from '@/hooks/useSiteData';
import { Skeleton } from '@/components/ui/skeleton';

const ContactSection: React.FC = () => {
  const { toast } = useToast();
  const { data: contactContent, isLoading } = useSiteContent('contact');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message sent!",
        description: "Thank you for your message. I'll get back to you soon.",
        duration: 5000,
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };

  // Loading skeleton for contact section
  const ContactSkeleton = () => (
    <>
      <Skeleton className="h-10 w-48 mb-4 mx-auto" />
      <Skeleton className="h-5 w-full max-w-2xl mx-auto mb-12" />
      <div className="max-w-2xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
        <Skeleton className="h-12 w-full mb-6" />
        <Skeleton className="h-40 w-full mb-6" />
        <Skeleton className="h-12 w-32 mx-auto" />
      </div>
    </>
  );

  // Get content from database
  const title = getContentByType(contactContent, 'title');
  const description = getContentByType(contactContent, 'description');
  const nameLabel = getContentByType(contactContent, 'form_name_label');
  const emailLabel = getContentByType(contactContent, 'form_email_label');
  const messageLabel = getContentByType(contactContent, 'form_message_label');
  const buttonText = getContentByType(contactContent, 'form_button_text');

  return (
    <section id="contact" className="py-20">
      <div className="container">
        {isLoading ? (
          <ContactSkeleton />
        ) : (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">{title || 'Get In Touch'}</h2>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                {description || 'Have a project in mind or want to collaborate? Feel free to reach out through the form below.'}
              </p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      {nameLabel || 'Name'}
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      {emailLabel || 'Email'}
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full"
                    placeholder="What is this about?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    {messageLabel || 'Message'}
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full h-40"
                    placeholder="Your message..."
                  />
                </div>
                
                <div className="flex justify-center">
                  <Button 
                    type="submit" 
                    className="w-full sm:w-auto bg-data-purple hover:bg-data-indigo"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : (buttonText || 'Send Message')}
                  </Button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ContactSection;
