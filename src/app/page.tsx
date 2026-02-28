import Link from "next/link";
import { ArrowRight, Briefcase, MapPin, TrendingUp, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-900/[0.03] blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-[-5%] w-[600px] h-[600px] rounded-full bg-blue-900/[0.02] blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <nav className="w-full px-6 py-6 flex justify-between items-center relative z-10 max-w-7xl mx-auto">
        <div className="font-black text-2xl tracking-tighter flex items-center gap-2 text-primary">
          <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white text-lg leading-none">R</span>
          </div>
          Recrutement.
        </div>
        <div>
          <Link
            href="/postuler"
            className="text-sm font-semibold text-primary hover:text-secondary transition-colors px-4 py-2"
          >
            Déposer une candidature
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-32 text-center relative z-10">
        <div className="max-w-4xl space-y-10 animate-in slide-in-from-bottom-8 duration-700 fade-in">
          <div className="inline-flex items-center rounded-full border border-foreground/10 bg-white/50 dark:bg-black/50 backdrop-blur-sm px-4 py-1.5 text-sm font-medium shadow-sm">
            <span className="relative flex h-2 w-2 mr-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Postes ouverts : <span className="font-bold ml-1">RCA & Gabon</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.1]">
            L'excellence <br className="hidden md:block" /> n'attend pas.
          </h1>

          <p className="text-xl md:text-2xl text-foreground/60 max-w-2xl mx-auto font-medium leading-relaxed">
            Nous recrutons l'élite des <span className="text-foreground font-bold">Closeurs</span> et des <span className="text-foreground font-bold">Livreurs</span> pour accompagner notre croissance exponentielle.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/postuler"
              className="inline-flex h-14 items-center justify-center rounded-xl bg-secondary text-white px-8 text-base font-bold uppercase tracking-wide transition-all hover:bg-primary shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-1"
            >
              Postuler maintenant
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="#avantages"
              className="inline-flex h-14 items-center justify-center rounded-xl border-2 border-slate-200 bg-white/80 backdrop-blur-md px-8 text-base font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300"
            >
              Découvrir le cadre
            </Link>
          </div>
        </div>
      </main>

      {/* Advantages Section */}
      <section id="avantages" className="w-full py-32 px-6 relative z-10 bg-slate-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 animate-in fade-in duration-1000">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-primary">Pourquoi nous rejoindre ?</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">Un cadre exigeant conçu pour la performance et la rentabilité.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-100 transition-all">
                <TrendingUp className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-primary">Rémunération</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Système de commissions no-limit pour les Closeurs et revenus stables et garantis pour les Livreurs.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-100 transition-all">
                <Briefcase className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-primary">Cadre structuré</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Outils de pointe (CRM, automatisation) et process clairs pour vous concentrer sur l'essentiel.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-100 transition-all">
                <MapPin className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-primary">Flexibilité</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                100% télétravail possible pour l'équipe Sales, autonomie totale sur le terrain pour la livraison.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-100 transition-all">
                <ShieldCheck className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-primary">Exigence</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Nous ne recrutons que des profils sérieux. Un filtrage drastique pour une équipe d'élite.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 py-12 px-6 text-center relative z-10 bg-white">
        <div className="font-black text-xl tracking-tighter mb-4 text-primary/40">Recrutement.</div>
        <p className="text-sm font-medium text-slate-500">
          © {new Date().getFullYear()} Tous droits réservés.
        </p>
      </footer>
    </div>
  );
}
