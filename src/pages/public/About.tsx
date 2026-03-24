import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function About() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="px-6 lg:px-14 h-20 flex items-center shadow-sm bg-white shrink-0">
        <Link to="/" className="flex items-center justify-center">
          <Heart className="h-8 w-8 text-rose-500 mr-2" />
          <span className="font-bold text-2xl tracking-tight text-slate-900">LifeLink</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link to="/" className="text-sm font-medium hover:text-primary-600">Home</Link>
          <Link to="/contact" className="text-sm font-medium hover:text-primary-600">Contact</Link>
        </nav>
      </header>

      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold text-slate-900 mb-8 text-center">About LifeLink</h1>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-slate-600 space-y-6 text-lg leading-relaxed">
            <p>
              LifeLink Organ Donation System was built with a single vision: to bridge the gap between organ donors and those in critical need. Every day, thousands of patients waiting for an organ transplant face uncertainty. Our mission is to reduce wait times and optimize the matching process.
            </p>
            <p>
              By leveraging advanced matching algorithms taking into account blood type compatibility, geographic location, and medical urgency, LifeLink connects verified hospitals, willing donors, and patients waiting for a second chance at life.
            </p>
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">Our Core Values</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Transparency & Trust:</strong> All hospitals on our platform undergo rigorous verification.</li>
              <li><strong>Speed & Efficiency:</strong> We prioritize urgent cases to maximize the chances of successful transplants.</li>
              <li><strong>Security & Privacy:</strong> Medical records and personal data are safeguarded with enterprise-grade security.</li>
            </ul>
            <div className="mt-10 flex justify-center pt-8 border-t border-slate-100">
              <Link to="/signup">
                <Button size="lg">Join Our Mission Today</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
