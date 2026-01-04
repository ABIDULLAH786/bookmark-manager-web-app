
'use server'
import { Bookmark, Folder, Search, Moon, Sun, Layers, Zap, Shield, Grid3x3, ArrowRight, ChevronRight, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";
import { BRAND_NAME, GITHUB_URL } from "@/constants";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import HeaderAuth from "@/components/PageComponents/landing/HeaderAuth";

const GET_START_URL = "/login";

export default async function LandingPage() {
const session = await getServerSession(authOptions);
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated linear background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-primary/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-primary/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      {/* Navigation */}
      <nav className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center cursor-pointer">
                <Bookmark className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground " />
              </div>
              <span className="text-lg sm:text-xl tracking-tight font-medium cursor-pointer">{BRAND_NAME}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              {/* <div className="hidden sm:flex"> */}

             {!session&& <Button variant="ghost" size="icon" className="rounded-full" asChild>
                <Link
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-5 h-5" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </Button>}
              {/* </div> */}

              <ThemeToggle />
              <HeaderAuth session={session} />

            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full border border-border bg-card/50 backdrop-blur-sm mb-6 sm:mb-8">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
              <span className="text-xs sm:text-sm text-muted-foreground">Modern bookmark organization</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight mb-4 sm:mb-6 bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              Organize your web
              <br />
              the smart way
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-4">
              A beautiful, intuitive bookmark manager that helps you save, organize, and access your favorite websites with ease. Built for productivity.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Button
                size="lg"
                className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base group"
              >
                <Link href={GET_START_URL} className="flex items-center">
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base bg-card/50 backdrop-blur-sm"
              >
                View Demo
                <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Hero Image - Glass Card */}
          <div className="mt-12 sm:mt-20 relative">
            <div className="relative mx-auto max-w-5xl">
              {/* Glass effect container */}
              <div className="relative rounded-xl sm:rounded-2xl border border-border bg-linear-to-b from-card/80 to-card/40 backdrop-blur-xl shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent" />

                {/* Mock UI */}
                <div className="relative p-4 sm:p-8">
                  <div className="flex items-center gap-2 mb-4 sm:mb-6">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-destructive/80" />
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-muted" />
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-muted" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <div
                        key={i}
                        className="aspect-4/3 rounded-lg border border-border bg-card/60 backdrop-blur-sm p-3 sm:p-4 hover:bg-accent/50 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md bg-primary/10 flex items-center justify-center">
                            <Folder className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                          </div>
                        </div>
                        <div className="h-2 sm:h-2.5 bg-muted rounded w-3/4 mb-1.5 sm:mb-2" />
                        <div className="h-1.5 sm:h-2 bg-muted/50 rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 sm:-top-8 sm:-right-8 w-16 h-16 sm:w-24 sm:h-24 rounded-2xl border border-border bg-card/80 backdrop-blur-xl shadow-xl hidden sm:flex items-center justify-center animate-float">
                <Search className="w-8 h-8 sm:w-12 sm:h-12 text-primary" />
              </div>
              <div className="absolute -bottom-4 -left-4 sm:-bottom-8 sm:-left-8 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border border-border bg-card/80 backdrop-blur-xl shadow-xl hidden sm:flex items-center justify-center animate-float animation-delay-2000">
                <Grid3x3 className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight mb-3 sm:mb-4">
              Everything you need
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to make bookmark management effortless and enjoyable
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8" >
            {[
              {
                icon: Folder,
                title: "Smart Folders",
                description: "Organize bookmarks into folders with unlimited nesting and drag-and-drop support",
              },
              {
                icon: Search,
                title: "Fast Search",
                description: "Find any bookmark instantly with powerful search across titles, URLs, and tags",
              },
              {
                icon: Grid3x3,
                title: "Grid Layout",
                description: "Beautiful card-based interface that makes browsing your bookmarks a pleasure",
              },
              {
                icon: Layers,
                title: "Folder Tree",
                description: "Navigate your bookmark hierarchy with an intuitive sidebar tree view",
              },
              {
                icon: Moon,
                title: "Dark Mode",
                description: "Seamless light and dark themes that adapt to your preference automatically",
              },
              {
                icon: Shield,
                title: "Privacy First",
                description: "Your bookmarks stay on your device. No tracking, no ads, no compromises",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative rounded-xl sm:rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 sm:p-8 hover:bg-accent/30 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl sm:rounded-3xl border border-border bg-linear-to-br from-card/80 to-card/40 backdrop-blur-xl p-8 sm:p-12 lg:p-16 text-center overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-primary/5" />

            <div className="relative">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight mb-4 sm:mb-6">
                Ready to get organized?
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto">
                Start managing your bookmarks the modern way. No signup required, completely free to use.
              </p>
              <Button
                size="lg"
                className="h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base group"
              >
                <Link href={GET_START_URL} className="flex items-center">
                  Start Using Now
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-border py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center">
                <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
              </div>
              <span className="text-sm sm:text-base text-muted-foreground">{BRAND_NAME}</span>
            </div>
           <div className="flex flex-row items-center gap-3">
                {/* 1. Added GitHub Link Here */}
                
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Built with Next.js and shadcn/ui
                </p>

                <Link 
                  href={GITHUB_URL} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2 hover:text-foreground transition-colors"
                >
                    <Github className="w-4 h-4 text-white " />
                </Link>

            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}