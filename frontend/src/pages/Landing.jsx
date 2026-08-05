import { Link } from 'react-router-dom';
import { PawPrint } from 'lucide-react';

const features = [
  { emoji: '🐾', title: 'Pet Profiles', desc: 'Create detailed profiles for each pet including behavior, allergies, routines, and care instructions.' },
  { emoji: '🩺', title: 'Vet Visit Records', desc: 'Log every vet appointment with dates, reasons, treatments, and important notes.' },
  { emoji: '🔔', title: 'Vaccination Reminders', desc: 'Never miss a vaccination date with reminders that flag what’s due or overdue.' },
  { emoji: '👥', title: 'Community Support', desc: 'Connect with fellow pet owners to share experiences and get advice.' },
];

const steps = [
  { title: 'Create Pet Profile', desc: 'Add your pet’s details, behavior, and care needs.' },
  { title: 'Track Health Records', desc: 'Track vet visits, vaccinations, and medications.' },
  { title: 'Join Community', desc: 'Share experiences and get advice from other pet parents.' },
];

const reviews = [
  { emoji: '🐕', name: 'Sarah M.', subtitle: 'Owner of Luna (Golden Retriever)', quote: 'PawCare has been a lifesaver! I can finally keep track of all of Luna’s appointments and vaccinations in one place.' },
  { emoji: '🐱', name: 'James K.', subtitle: 'Owner of Whiskers & Mittens (Cats)', quote: 'The community feature is amazing. Got great advice from other cat owners about my kitties’ diet concerns.' },
  { emoji: '🦮', name: 'Emily R.', subtitle: 'Owner of Max (Beagle)', quote: 'I love how easy it is to share Max’s care instructions with pet sitters. Everything is in one profile!' },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      <header className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 font-extrabold text-lg text-brand-700">
          <PawPrint className="w-6 h-6" /> PawCare
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-secondary">Log in</Link>
          <Link to="/register" className="btn-primary">Get started</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-brand-700 font-semibold mb-3">♡ Your pet's health companion</p>
          <h1 className="gradient-text font-extrabold leading-tight text-4xl sm:text-5xl mb-4">
            Keep Your Pets Happy &amp; Healthy
          </h1>
          <p className="text-slate-600 text-lg mb-6">
            Track vet visits, manage vaccinations, and connect with a community of pet lovers.
            Everything you need to give your furry friends the best care.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/register" className="btn-primary !px-5 !py-2.5">Get started</Link>
            <Link to="/login" className="btn-secondary !px-5 !py-2.5">Log in</Link>
          </div>
        </div>
        <img src="/dog-and-cat.png" alt="A dog and a cat" className="w-full max-w-md mx-auto" />
      </section>

      {/* Features */}
      <section className="bg-slate-50/70 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Everything Your Pet Needs</h2>
            <p className="text-slate-500 mt-3">From health tracking to community support, we've got all the tools to help you be the best pet parent.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f) => (
              <div key={f.title} className="card">
                <p className="text-2xl mb-2">{f.emoji}</p>
                <h3 className="font-bold text-slate-800">{f.title}</h3>
                <p className="text-sm text-slate-500 mt-2">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">How It Works</h2>
            <p className="text-slate-500 mt-3">Get started in minutes and keep your pet's health organized forever.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            {steps.map((s, i) => (
              <div key={s.title}>
                <div
                  className="w-14 h-14 mx-auto mb-4 rounded-xl grid place-items-center text-white font-extrabold text-lg"
                  style={{ background: 'linear-gradient(180deg, #1D4ED8, #22C1DC)' }}
                >
                  {i + 1}
                </div>
                <h3 className="font-bold text-slate-800">{s.title}</h3>
                <p className="text-sm text-slate-500 mt-2">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-slate-50/70 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Loved by Pet Parents</h2>
            <p className="text-slate-500 mt-3">See what other pet owners are saying about PawCare.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {reviews.map((r) => (
              <div key={r.name} className="card">
                <p className="font-bold text-slate-800">{r.emoji} {r.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{r.subtitle}</p>
                <p className="text-sm text-slate-600 mt-3">&ldquo;{r.quote}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-20 text-center bg-slate-50/70">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="gradient-text font-extrabold text-3xl sm:text-4xl mb-4">Ready to Give Your Pet the Best Care?</h2>
          <p className="text-slate-600 mb-6">Join pet parents who trust PawCare to keep their furry friends healthy and happy.</p>
          <Link to="/register" className="btn-primary !px-6 !py-3 text-base">Start Your Free Account Today</Link>
        </div>
      </section>

      <footer className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid sm:grid-cols-3 gap-8">
          <div>
            <p className="font-extrabold text-lg text-slate-800 flex items-center gap-2"><PawPrint className="w-5 h-5" /> PawCare</p>
            <p className="text-sm text-slate-500 mt-2">Keep track of your pet's health, connect with other pet parents, and give your furry friends the best care possible.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 mb-2">Quick Links</h3>
            <ul className="space-y-1 text-sm text-slate-500">
              <li><Link to="/register" className="hover:text-brand-700">My Pets</Link></li>
              <li><Link to="/register" className="hover:text-brand-700">Health Records</Link></li>
              <li><Link to="/register" className="hover:text-brand-700">Community</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 mb-2">Support</h3>
            <ul className="space-y-1 text-sm text-slate-500">
              <li>Help Center</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>
        <p className="text-center text-xs text-slate-400 mt-10">&copy; 2026 PawCare. All rights reserved.</p>
      </footer>
    </div>
  );
}
