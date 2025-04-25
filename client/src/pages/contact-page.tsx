import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin } from "lucide-react";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });
  
  function onSubmit(data: ContactFormValues) {
    console.log(data);
    
    // In a real app, this would send the data to a server
    toast({
      title: "Message sent",
      description: "Thank you for your message. We'll get back to you soon!",
    });
    
    form.reset();
  }
  
  return (
    <div className="container mx-auto py-16 px-4 max-w-6xl">
      <h1 className="text-4xl font-bold mb-6 text-center">Contact Christian Ward Music</h1>
      
      <div className="max-w-3xl mx-auto mb-12 text-center">
        <p className="text-lg text-muted-foreground">
          Have questions about licensing or need a custom track for your project? 
          Get in touch with us and we'll be happy to help.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <Mail className="h-10 w-10 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">Email Us</h3>
          <p className="text-muted-foreground mb-2">For general inquiries</p>
          <a href="mailto:christian.ward@gmail.com" className="text-primary hover:underline">
            christian.ward@gmail.com
          </a>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <Phone className="h-10 w-10 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">Call Us</h3>
          <p className="text-muted-foreground mb-2">Monday-Friday, 9am-5pm</p>
          <a href="tel:+15551234567" className="text-primary hover:underline">
            +1 (555) 123-4567
          </a>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <MapPin className="h-10 w-10 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">Visit Us</h3>
          <p className="text-muted-foreground mb-2">By appointment only</p>
          <address className="not-italic text-primary">
            Los Angeles, CA
          </address>
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Your email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="What is this regarding?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us about your project or inquiry" 
                      className="min-h-32"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Please include details about your project if you're interested in custom music.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full md:w-auto">
              Send Message
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
