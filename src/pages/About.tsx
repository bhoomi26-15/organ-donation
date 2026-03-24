import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </button>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
              <Heart className="h-6 w-6 text-red-600" />
            </div>
            <span className="text-xl font-bold text-red-600">LifeLink</span>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-12 text-center">About LifeLink</h1>

        <div className="space-y-8">
          <div className="p-8 rounded-lg border border-gray-200 bg-gray-50">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              LifeLink is dedicated to saving lives by connecting organ donors with people in critical need of transplants.
              We believe that every life is precious, and our platform makes the donation process simple, transparent, and secure.
            </p>
          </div>

          <div className="p-8 rounded-lg border border-gray-200 bg-gray-50">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Work</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Our intelligent matching algorithm connects willing donors, patients waiting for transplants, and verified administrators
              based on blood type compatibility, geographic location, medical urgency, and donor availability.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Every match is data-driven, secure, and ethically sound. Only intelligent, verified matches that maximize the chances of successful transplants.
            </p>
          </div>

          <div className="p-8 rounded-lg border border-gray-200 bg-gray-50">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Our Core Values</h2>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <span className="text-red-600 font-bold min-w-fit">✓ Transparency</span>
                <span className="text-gray-700">All admins undergo rigorous verification to ensure legitimacy.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-red-600 font-bold min-w-fit">✓ Speed</span>
                <span className="text-gray-700">We prioritize urgent cases to maximize successful transplants.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-red-600 font-bold min-w-fit">✓ Security</span>
                <span className="text-gray-700">Medical records and personal data are safeguarded with enterprise-grade encryption.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-red-600 font-bold min-w-fit">✓ Accessibility</span>
                <span className="text-gray-700">Available to all qualified donors, recipients, and administrators.</span>
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-lg border border-gray-200 bg-gray-50">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">The Impact</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Every day, we work to reduce the gap between supply and demand in organ transplantation. By connecting the right donor
              with the right recipient at the right time, LifeLink helps save lives.
            </p>
          </div>

          <div className="text-center mt-12 p-8 rounded-lg border border-red-200 bg-red-50">
            <p className="text-lg text-gray-700 mb-6">Ready to be part of the solution?</p>
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
      <footer className="border-t border-gray-200 bg-gray-50 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 text-sm">&copy; 2026 LifeLink Organ Donation Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
