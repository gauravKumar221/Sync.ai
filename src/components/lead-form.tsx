'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateAutomatedLeadResponse } from '@/ai/flows/automated-lead-response';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  phone: z.string().min(10, {
    message: 'Please enter a valid phone number.',
  }),
  message: z.string().min(5, {
    message: 'Message must be at least 5 characters.',
  }),
  source: z.enum(['WhatsApp', 'Website', 'Facebook', 'Other']),
});

export function LeadForm() {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      message: '',
      source: 'Website',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('New lead captured:', values);

    try {
        const { response } = await generateAutomatedLeadResponse({
            name: values.name,
            message: values.message,
            source: values.source,
        });
        
        console.log('AI Generated Response:', response);

        toast({
            title: 'Lead Captured!',
            description: (
                <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <p className="text-sm text-white">
                        We've received your message and our AI has prepared a response. In a real app, this would be sent automatically.
                    </p>
                    <p className="mt-4 text-sm font-mono text-gray-400 p-2 border border-gray-700 rounded-md bg-gray-800">
                        {response}
                    </p>
                </div>
            )
        });

    } catch (error) {
        console.error('Error generating AI response:', error);
        toast({
            title: 'Lead Captured!',
            description: 'Your message has been received. We will get back to you shortly.',
            variant: 'default',
        });
    }

    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="+1 (555) 123-4567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="How did you hear about us?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Website">Website</SelectItem>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
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
                  placeholder="Tell us a little about your needs"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Send Message
        </Button>
      </form>
    </Form>
  );
}
