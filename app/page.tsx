'use client' ;
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { User, Heart, TrendingUp, Info, MessageSquare } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import gsap from 'gsap';
import { useEffect } from 'react';

const LandingPage = () => {
  useEffect(() => {
    gsap.fromTo(".animate", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, stagger: 0.3, ease: "power1.out" });
  }, []);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#E6F7FF]">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 animated-section">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tight text-[#007ACC] sm:text-6xl animate">
                    Track Your Semen Health Effortlessly
                  </h1>
                  <p className="max-w-[600px] text-lg text-[#003366] animate">
                    Monitor key metrics, log habits, receive insights, and join discussions to boost your semen health.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="inline-flex items-center justify-center h-10 rounded-md bg-[#007ACC] text-white px-8 text-sm font-medium shadow-md transition-colors hover:bg-[#005999] animate">
                    Get Started
                  </Button>
                  <Button className="inline-flex items-center justify-center h-10 rounded-md border border-[#005999] bg-transparent px-8 text-sm font-medium text-[#007ACC] shadow transition-colors hover:bg-[#f0f0f0] animate">
                    Learn More
                  </Button>
                </div>
              </div>
              <img
                src="https://fastly.picsum.photos/id/13/2500/1667.jpg?hmac=SoX9UoHhN8HyklRA4A3vcCWJMVtiBXUg0W4ljWTor7s"
                width="550"
                height="550"
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square animate"
              />
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#ffffff]">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter text-[#007ACC] sm:text-5xl animate">Personalized Insights</h2>
                <p className="max-w-[900px] text-lg text-[#003366] animate">
                  Get tailored recommendations and reminders for healthier habits and upcoming tests.
                </p>
              </div>
            </div>
            <div className="grid max-w-5xl mx-auto gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card className="flex flex-col items-center justify-center space-y-4 animate p-6 bg-[#E6F7FF]">
                <Heart className="h-12 w-12 text-[#007ACC]" />
                <div className="space-y-1 text-center">
                  <h3 className="text-lg font-bold text-[#003366]">Health Metrics</h3>
                  <p className="text-[#005999]">Track vital semen health metrics effortlessly.</p>
                </div>
              </Card>
              <Card className="flex flex-col items-center justify-center space-y-4 animate p-6 bg-[#E6F7FF]">
                <TrendingUp className="h-12 w-12 text-[#007ACC]" />
                <div className="space-y-1 text-center">
                  <h3 className="text-lg font-bold text-[#003366]">Lifestyle Logs</h3>
                  <p className="text-[#005999]">Log your habits and observe trends over time.</p>
                </div>
              </Card>
              <Card className="flex flex-col items-center justify-center space-y-4 animate p-6 bg-[#E6F7FF]">
                <Info className="h-12 w-12 text-[#007ACC]" />
                <div className="space-y-1 text-center">
                  <h3 className="text-lg font-bold text-[#003366]">Educational Resources</h3>
                  <p className="text-[#005999]">Access a plethora of articles for educational purposes.</p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#D9EFFF]">
          <div className="container px-4 md:px-6">
            <Tabs defaultValue="forums" className="w-full space-y-4 text-center animate">
              <TabsList className="justify-center">
                <TabsTrigger value="forums">Forums</TabsTrigger>
                <TabsTrigger value="qa">Q&A</TabsTrigger>
              </TabsList>
              <TabsContent value="forums">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-[#007ACC] sm:text-5xl">Community Engagement</h2>
                  <p className="max-w-[900px] mx-auto text-[#003366]">
                    Participate in anonymous forums, join discussions, and engage with experts.
                  </p>
                </div>
                <Card className="mt-6 p-6 bg-white shadow-md rounded-md">
                  <CardHeader>
                    <CardTitle>Anonymous Forum</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Engage in conversations and share experiences with others anonymously.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="qa">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-[#007ACC] sm:text-5xl">Expert Q&A Sessions</h2>
                  <p className="max-w-[900px] mx-auto text-[#003366]">
                    Get your questions answered by experts in our Q&A sessions.
                  </p>
                </div>
                <Card className="mt-6 p-6 bg-white shadow-md rounded-md">
                  <CardHeader>
                    <CardTitle>Expert-Led Q&A</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Join sessions and ask questions directly to our panel of experts.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#E6F7FF]">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-[#007ACC] sm:text-5xl">Educational Articles</h2>
                <p className="max-w-[900px] text-[#003366]">
                  Browse through a curated list of articles to enhance your knowledge.
                </p>
              </div>
              <div className="grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                <Card className="flex flex-col items-start space-y-4 p-6 bg-white shadow-md rounded-md animate">
                  <Avatar>
                    <AvatarImage src="https://picsum.photos/seed/picsum/200/300" />
                    <AvatarFallback>AR</AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-bold text-[#003366]">Understanding Semen Health</h3>
                  <p className="text-[#005999]">A comprehensive guide to understanding semen health metrics.</p>
                </Card>
                <Card className="flex flex-col items-start space-y-4 p-6 bg-white shadow-md rounded-md animate">
                  <Avatar>
                    <AvatarImage src="https://fastly.picsum.photos/id/17/2500/1667.jpg?hmac=HD-JrnNUZjFiP2UZQvWcKrgLoC_pc_ouUSWv8kHsJJY" />
                    <AvatarFallback>HS</AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-bold text-[#003366]">Healthy Lifestyle Habits</h3>
                  <p className="text-[#005999]">Explore habits that can positively impact your semen health.</p>
                </Card>
                <Card className="flex flex-col items-start space-y-4 p-6 bg-white shadow-md rounded-md animate">
                  <Avatar>
                    <AvatarImage src="https://picsum.photos/seed/picsum/200/300" />
                    <AvatarFallback>RT</AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-bold text-[#003366]">Latest Research Trends</h3>
                  <p className="text-[#005999]">Stay updated with the latest research and trends in semen health.</p>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-[#007ACC] p-6 md:py-12 text-white">
        <div className="container max-w-7xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 text-sm">
          <div className="grid gap-1">
            <h3 className="font-semibold">Product</h3>
            <a href="#" className="hover:underline">Features</a>
            <a href="#" className="hover:underline">Integrations</a>
            <a href="#" className="hover:underline">Pricing</a>
            <a href="#" className="hover:underline">Security</a>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold">Company</h3>
            <a href="#" className="hover:underline">About Us</a>
            <a href="#" className="hover:underline">Careers</a>
            <a href="#" className="hover:underline">Blog</a>
            <a href="#" className="hover:underline">Contact</a>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold">Resources</h3>
            <a href="#" className="hover:underline">Documentation</a>
            <a href="#" className="hover:underline">Help Center</a>
            <a href="#" className="hover:underline">Community</a>
            <a href="#" className="hover:underline">Templates</a>
          </div>
          <div className="grid gap-1">
            <h3 className="font-semibold">Legal</h3>
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage;