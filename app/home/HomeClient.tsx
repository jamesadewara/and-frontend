"use client";

import { ArrowRight, Search, Brain, Sparkles, Star, Target, Github, Linkedin, Twitter, Globe, RocketIcon } from "lucide-react";
import { TopNav } from "@/src/components/site-nav";
import Link from "next/link";
import { TEAM, TeamMember } from "@/src/data";
import Image from "next/image";
import Logo from "@/src/components/Logo";
import { config } from "@/src/lib/config";
import { Particles } from "./components/home-particles";
import { FooterLanguagePicker } from "./components/footer-language-picker";

export default function HomeClient() {
  return (
    <div className="min-h-screen">
      <TopNav>
        <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <a href="#how" className="hover:text-foreground transition">How it works</a>
          <a href="#what" className="hover:text-foreground transition">Capabilities</a>
          <a href="#team" className="hover:text-foreground transition">Team</a>
        </nav>
      </TopNav>

      {/* HERO */}
      <section className="relative gradient-mesh">
        <Particles />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-4 text-center">
          <div className="max-w-4xl mx-auto animate-fade-up flex flex-col items-center">
            <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs text-muted-foreground mb-8">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              DSN × BCT LLM Agent Challenge Submission
            </div>
            <h1 className="text-display font-bold text-4xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight">
              Culturally Intelligent <br />
              AI for the Nigerian Market
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              AnD AI simulates real Nigerian consumer behavior — from Lagos Hagglers to Abuja Big
              Women — delivering authentic recommendations and reviews grounded in cultural and
              economic context.
            </p>
            <div className="mt-10 flex flex-wrap gap-3 justify-center">
              <Link
                href="/workspace"
                className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 font-medium hover:glow-primary transition-all"
              >
                Try the Workspace <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="mx-auto max-w-7xl px-4 sm:px-6 py-24">
        <div className="max-w-2xl mb-14 text-center mx-auto">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">How it works</p>
          <h2 className="text-display text-3xl sm:text-4xl font-bold">
            A three-stage agentic pipeline
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: Search, t: "Retrieve", d: "Fetches user history and behavioral context. Pulls archetype profile, past reviews, and Nigerian-market signals into the working set." },
            { icon: Brain, t: "Reason", d: "Agents think in-character using Chain-of-Thought. Pidgin tone, price shock math, and cultural priors guide every step." },
            { icon: Sparkles, t: "Predict & Reflect", d: "Culturally grounded output with self-correction. The agent re-checks sentiment-rating alignment before shipping." },
          ].map((c) => (
            <div key={c.t} className="glass rounded-2xl p-6 hover:border-primary/40 transition group">
              <div className="size-11 rounded-xl bg-primary/15 ring-1 ring-primary/30 grid place-items-center mb-5 group-hover:scale-110 transition">
                <c.icon className="size-5 text-primary" />
              </div>
              <h3 className="text-display font-semibold text-lg mb-2">{c.t}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT IT DOES */}
      <section id="what" className="mx-auto max-w-7xl px-4 sm:px-6 py-24">
        <div className="max-w-2xl mb-14 text-center mx-auto">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">Capabilities</p>
          <h2 className="text-display text-3xl sm:text-4xl font-bold">What AnD AI does</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="glass rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 size-40 rounded-full bg-primary/10 blur-2xl" />
            <Star className="size-6 text-primary mb-4" />
            <h3 className="text-display text-2xl font-bold mb-2">Review Generation</h3>
            <p className="text-muted-foreground mb-5">
              Simulates authentic Nigerian consumer reviews. Factors in Price Shock, Pidgin style,
              and archetype traits.
            </p>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>• Price-shock log-scale rating adjustment</li>
              <li>• Pidgin & code-mix style markers</li>
              <li>• Archetype-conditioned sentiment</li>
            </ul>
          </div>
          <div className="glass rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 size-40 rounded-full bg-primary/10 blur-2xl" />
            <Target className="size-6 text-primary mb-4" />
            <h3 className="text-display text-2xl font-bold mb-2">Recommendations</h3>
            <p className="text-muted-foreground mb-5">
              Ranks products using location-aware scoring, cold-start inference, and occasion-based
              context.
            </p>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>• Lagos / Abuja / PH location boosting</li>
              <li>• Cold-start demographic priors</li>
              <li>• Occasion + time-of-day grounding</li>
            </ul>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section id="team" className="mx-auto max-w-7xl px-4 sm:px-6 py-24">
        <div className="max-w-2xl mb-14 text-center mx-auto">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">The Team</p>
          <h2 className="text-display text-3xl sm:text-4xl font-bold">Meet the team</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {TEAM.filter((m: TeamMember) => !!m.linkedin || !!m.github || !!m.x || !!m.website).map((m) => {
            const initials = m.name
              .split(" ")
              .map((s) => s[0])
              .slice(0, 2)
              .join("");
            return (
              <div
                key={m.name}
                className="glass rounded-2xl p-6 text-center hover:border-primary/40 transition group relative flex flex-col items-center"
              >
                <div className="mx-auto size-40 rounded-full bg-linear-to-br from-primary/20 to-primary/5 p-1 mb-4 group-hover:scale-105 transition-transform">
                  {m.image ? (
               <Image
  src={m.image}
  alt={m.name}
  width={240}
  height={240}
  className="rounded-full object-cover border-2 border-primary/20 aspect-square h-auto" 
/>
                  ) : (
                    <div className="size-full rounded-full bg-linear-to-br from-primary to-primary/40 grid place-items-center text-primary-foreground text-display text-xl font-bold">
                      {initials}
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                  {m.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 mb-4 line-clamp-2 min-h-8">{m.role}</p>

                <div className="flex items-center gap-3 mt-auto">
                  {m.linkedin && (
                    <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full glass hover:text-primary transition-colors" title="LinkedIn">
                      <Linkedin className="size-4" />
                    </a>
                  )}
                  {m.github && (
                    <a href={m.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full glass hover:text-primary transition-colors" title="GitHub">
                      <Github className="size-4" />
                    </a>
                  )}
                  {m.x && (
                    <a href={m.x} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full glass hover:text-primary transition-colors" title="X (Twitter)">
                      <Twitter className="size-4" />
                    </a>
                  )}
                  {m.website && (
                    <a href={m.website} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full glass hover:text-primary transition-colors" title="Website">
                      <Globe className="size-4" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border mt-24 bg-secondary/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-16">
            <div className="max-w-md">
              <Logo />
              <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                AnD AI is a culturally intelligent platform simulating real Nigerian consumer behavior
                to deliver authentic recommendations and reviews.
              </p>
              <div className="flex gap-4 mt-8">
                <a href={config.externalApis.mainGithubUrl} className="p-2.5 rounded-full glass hover:text-primary transition-all hover:scale-110">
                  <Github className="size-5" />
                </a>
              </div>
            </div>
            
            <div className="flex flex-col lg:items-end gap-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Language & Culture</p>
              <FooterLanguagePicker />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 justify-between items-center text-[13px] text-muted-foreground border-t border-border pt-10">
            <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
              <span>© {new Date().getFullYear()} AnD AI · Built in Lagos</span>
              <span className="hidden md:inline text-border">|</span>
              <span className="inline-flex items-center gap-2">
                <RocketIcon className="size-4 text-primary" />
                DSN × BCT LLM Agent Challenge
              </span>
            </div>
            
            <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 font-medium">
              <a href="#how" className="hover:text-primary transition-colors">How it works</a>
              <a href="#what" className="hover:text-primary transition-colors">Capabilities</a>
              <a href="#team" className="hover:text-primary transition-colors">Team</a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}


