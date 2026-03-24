import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-red-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-700/50 bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </button>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-600/20">
              <Heart className="h-6 w-6 text-red-500" />
            </div>
            <span className="text-xl font-bold text-transparent bg-gradient-to-r from-red-400 to-red-600 bg-clip-text">
              LifeLink
            </span>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-5xl font-bold text-transparent bg-gradient-to-r from-red-400 to-red-600 bg-clip-text mb-12 text-center">
          About LifeLink
        </h1>

        <div className="space-y-8 text-slate-400">
          <div className="p-8 rounded-lg border border-red-600/30 bg-red-600/5">
            <h2 className="text-2xl font-semibold text-red-400 mb-4">Our Mission</h2>
            <p className="text-lg leading-relaxed">
              LifeLink Organ Donation System was built with a single vision: to bridge the gap between organ donors and those in critical need. Every day, thousands of patients waiting for an organ transplant face uncertainty. Our mission is to reduce wait times and optimize the matching process through intelligent algorithms and secure verification.
            </p>
          </div>

          <div className="p-8 rounded-lg border border-red-600/30 bg-red-600/5">
            <h2 className="text-2xl font-semibold text-red-400 mb-4">How We Work</h2>
            <p className="text-lg leading-relaxed mb-4">
              By leveraging advanced matching algorithms that take into account blood type compatibility, geographic location, medical urgency, and donor availability, LifeLink connects willing donors, patients waiting for transplants, and verified administrators.
            </p>
            <p className="text-lg leading-relaxed">
              Our system ensures that every match is data-driven, secure, and ethically sound. No random connections—only intelligent, verified matches that maximize the chances of successful transplants.
            </p>
          </div>

          <div className="p-8 rounded-lg border border-red-600/30 bg-red-600/5">
            <h2 className="text-2xl font-semibold text-red-400 mb-6">Our Core Values</h2>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <span className="text-red-400 font-bold min-w-fit">✓ Transparency & Trust</span>
                <span>All admins on our platform undergo rigorous verification to ensure legitimacy.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-red-400 font-bold min-w-fit">✓ Speed & Efficiency</span>
                <span>We prioritize urgent cases to maximize the chances of successful transplants.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-red-400 font-bold min-w-fit">✓ Security & Privacy</span>
                <span>Medical records and personal data are safeguarded with enterprise-grade security.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-red-400 font-bold min-w-fit">✓ Accessibility</span>
                <span>Our platform is available to all qualified donors, recipients, and administrators.</span>
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-lg border border-red-600/30 bg-red-600/5">
            <h2 className="text-2xl font-semibold text-red-400 mb-4">The Impact</h2>
            <p className="text-lg leading-relaxed">
              Every day, we work to reduce the gap between supply and demand in organ transplantation. By connecting the right donor with the right recipient at the right time, LifeLink helps save lives and give people a second chance.
            </p>
          </div>

          <div className="text-center mt-12">
            <p className="text-lg mb-6">Ready to be part of the solution?</p>
            <Button
              onClick={() => navigate('/donor')}
              className="flex items-center justify-center gap-2 text-lg px-8 py-3 mx-auto"
            >
              Register as Donor
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-950/80 backdrop-blur-sm py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-500 text-sm">&copy; 2026 LifeLink Organ Donation Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
