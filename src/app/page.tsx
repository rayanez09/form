import Link from "next/link";
import { ArrowRight, Briefcase, MapPin, TrendingUp, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navigation (Minimalist) */}
      <nav className="w-full border-b border-foreground/10 px-6 py-4 flex justify-between items-center">
        <div className="font-bold text-xl tracking-tight">Recrutement.</div>
        <div>
          <Link
            href="/postuler"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Déposer une candidature
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="max-w-3xl space-y-8">
          <div className="inline-flex items-center rounded-full border border-foreground/20 px-3 py-1 text-sm font-medium">
            <span className="flex h-2 w-2 rounded-full bg-foreground mr-2"></span>
            Postes ouverts en République Centrafricaine & Gabon
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight">
            Accélérez votre <br /> carrière avec nous.
          </h1>
          
          <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto">
            Nous recherchons des <span className="text-foreground font-semibold">Closeurs</span> performants et des <span className="text-foreground font-semibold">Livreurs</span> fiables pour accompagner notre forte croissance.
          </p>
          
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/postuler"
              className="inline-flex h-12 items-center justify-center rounded-md bg-foreground text-background px-8 text-sm font-medium transition-transform hover:scale-105"
            >
              Postuler maintenant
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="#avantages"
              className="inline-flex h-12 items-center justify-center rounded-md border border-foreground bg-transparent px-8 text-sm font-medium transition-colors hover:bg-foreground/5"
            >
              Découvrir les avantages
            </Link>
          </div>
        </div>
      </main>

      {/* Advantages Section */}
      <section id="avantages" className="w-full bg-foreground/5 py-24 px-6 border-t border-foreground/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight">Pourquoi nous rejoindre ?</h2>
            <p className="text-foreground/60 mt-4">Des conditions claires, structurées et exigeantes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-background border border-foreground/10 p-6 rounded-lg shadow-sm">
              <TrendingUp className="h-8 w-8 mb-4 opacity-80" />
              <h3 className="font-semibold text-lg mb-2">Rémunération attractive</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">
                Système de commissions motivant pour les Closeurs et revenus stables pour les Livreurs.
              </p>
            </div>
            
            <div className="bg-background border border-foreground/10 p-6 rounded-lg shadow-sm">
              <Briefcase className="h-8 w-8 mb-4 opacity-80" />
              <h3 className="font-semibold text-lg mb-2">Cadre structuré</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">
                Des processus de travail clairs et des outils modernes (CRM, automatisation) à votre disposition.
              </p>
            </div>
            
            <div className="bg-background border border-foreground/10 p-6 rounded-lg shadow-sm">
              <MapPin className="h-8 w-8 mb-4 opacity-80" />
              <h3 className="font-semibold text-lg mb-2">Flexibilité</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">
                Possibilité de travail à distance (pour les sales) et autonomie sur le terrain.
              </p>
            </div>
            
            <div className="bg-background border border-foreground/10 p-6 rounded-lg shadow-sm">
              <ShieldCheck className="h-8 w-8 mb-4 opacity-80" />
              <h3 className="font-semibold text-lg mb-2">Sérieux exigé</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">
                Nous filtrons rigoureusement nos candidats pour ne travailler qu'avec les meilleurs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-foreground/10 py-8 px-6 text-center">
        <p className="text-sm text-foreground/50">
          © {new Date().getFullYear()} Plateforme de Recrutement. Design Minimaliste.
        </p>
      </footer>
    </div>
  );
}
