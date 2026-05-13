import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Search, Brain, Sparkles, Star, Target, Github } from "lucide-react";
import { TopNav, Logo } from "@/components/site-nav";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AnD AI — Culturally Intelligent AI for the Nigerian Market" },
      {
        name: "description",
        content:
          "AnD AI simulates real Nigerian consumer behavior — delivering authentic recommendations and reviews grounded in cultural and economic context.",
      },
      { property: "og:title", content: "AnD AI — Culturally Intelligent AI" },
      {
        property: "og:description",
        content: "Simulate Nigerian consumer behavior with culturally-grounded AI agents.",
      },
    ],
  }),
  component: Landing,
});

function Particles() {
  const dots = Array.from({ length: 22 });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((_, i) => {
        const size = 2 + (i % 5);
        return (
          <span
            key={i}
            className="particle absolute rounded-full bg-primary/40"
            style={{
              width: size,
              height: size,
              top: `${(i * 53) % 100}%`,
              left: `${(i * 37) % 100}%`,
              animationDelay: `${(i % 8) * 0.7}s`,
              animationDuration: `${10 + (i % 6)}s`,
            }}
          />
        );
      })}
    </div>
  );
}

function Landing() {
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
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 min-h-[calc(100vh-4rem)] flex flex-col justify-center py-20">
          <div className="max-w-3xl animate-fade-up">
            <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs text-muted-foreground mb-8">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              DSN × BCT LLM Agent Challenge Submission
            </div>
            <h1 className="text-display font-bold text-4xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight">
              Culturally Intelligent <br />
              AI for the <span className="text-gradient">Nigerian Market</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
              AnD AI simulates real Nigerian consumer behavior — from Lagos Hagglers to Abuja Big
              Women — delivering authentic recommendations and reviews grounded in cultural and
              economic context.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/workspace"
                className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 font-medium hover:glow-primary transition-all"
              >
                Try the Workspace <ArrowRight className="size-4" />
              </Link>
              <a
                href="#how"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 font-medium hover:bg-secondary transition"
              >
                <BookOpen className="size-4" /> Read the Paper
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="mx-auto max-w-7xl px-4 sm:px-6 py-24">
        <div className="max-w-2xl mb-14">
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
        <div className="max-w-2xl mb-14">
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
        <div className="max-w-2xl mb-14">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">The Team</p>
          <h2 className="text-display text-3xl sm:text-4xl font-bold">Meet the team</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { n: "James Ayomide Adewara", r: "Lead Engineer" },
            { n: "Esther Omole", r: "Research" },
            { n: "Fedora", r: "Design" },
            { n: "Ifeoluwa", r: "Engineering" },
          ].map((m) => {
            const initials = m.n.split(" ").map((s) => s[0]).slice(0, 2).join("");
            return (
              <div key={m.n} className="glass rounded-2xl p-6 text-center hover:border-primary/40 transition">
                <div className="mx-auto size-16 rounded-full bg-gradient-to-br from-primary to-primary/40 grid place-items-center text-primary-foreground text-display text-lg font-bold mb-4">
                  {initials}
                </div>
                <h3 className="font-semibold text-sm">{m.n}</h3>
                <p className="text-xs text-muted-foreground mt-1">{m.r}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <Logo />
            <p className="text-sm text-muted-foreground mt-2">
              Culturally intelligent agents for African markets.
            </p>
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-3">
            <Github className="size-4" />
            Built for DSN × BCT LLM Agent Challenge
          </div>
        </div>
      </footer>
    </div>
  );
}
