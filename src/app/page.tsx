
'use client';

import Link from 'next/link';
import { ArrowRight, MessageSquare, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { LeadForm } from '@/components/lead-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/logo';
import Plasma from '@/components/ui/plasma';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 30;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-colors duration-300',
          scrolled ? 'bg-background/80 backdrop-blur-sm border-b' : 'bg-transparent'
        )}
      >
        <div className="container mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className="h-6 w-6" />
            <span className="font-bold">LeadFlowAI</span>
          </Link>
          <div className="flex items-center space-x-2 md:space-x-4">
            <Button asChild variant="ghost">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="relative w-full h-screen flex items-center justify-center -mt-14">
          <div className="absolute inset-0 -z-10 h-full w-full">
            <Plasma
              color="#ffffff"
              speed={0.6}
              direction="forward"
              scale={1.1}
              opacity={0.3}
              mouseInteractive={true}
            />
          </div>
          <div className="container mx-auto flex flex-col items-center gap-6 px-4 md:px-6">
            <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 text-center">
              <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Convert Conversations <br className="hidden sm:inline" />
                into <span className="bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">Customers</span>
              </h1>
              <p className="max-w-2xl text-lg text-muted-foreground">
                Capture leads from any platform, engage them with AI-powered auto-replies, and manage your entire sales pipeline in one powerful dashboard.
              </p>
            </div>
            <div className="mx-auto flex w-full max-w-sm flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/dashboard/overview">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                <Link href="#capture">Capture Leads</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="capture" className="w-full py-12 md:py-20">
          <div className="container mx-auto grid max-w-4xl gap-12 px-4 md:grid-cols-2 md:px-6">
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold">Never Miss a Lead</h2>
              <p className="mt-4 text-muted-foreground">
                Our universal lead capture form can be embedded anywhere. Instantly sync leads from your website, social media, or any other source directly into your CRM.
              </p>
              <div className="mt-8 flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Instant Capture</h3>
                    <p className="text-sm text-muted-foreground">Leads are saved and displayed on your dashboard in real-time.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Automated First Touch</h3>
                    <p className="text-sm text-muted-foreground">Trigger intelligent auto-replies to engage leads from the first moment.</p>
                  </div>
                </div>
              </div>
            </div>
            <Card className="shadow-2xl shadow-primary/10">
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
              </CardHeader>
              <CardContent>
                <LeadForm />
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:px-8 md:py-0">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground">
            Built by Your Company. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
