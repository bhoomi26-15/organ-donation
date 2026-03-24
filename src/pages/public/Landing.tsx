import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Activity, ShieldCheck, Users } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';

export function Landing() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    if (profile?.role) {
      if (profile.role === 'donor') return navigate('/donor/dashboard');
      if (profile.role === 'recipient') return navigate('/recipient/dashboard');
      if (profile.role === 'hospital') return navigate('/hospital/dashboard');
      if (profile.role === 'admin') return navigate('/admin/dashboard');
    }

    return navigate('/role-selection');
  }, [user, profile, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 lg:px-14 h-20 flex items-center shadow-sm bg-white shrink-0">
        <Link to="/" className="flex items-center justify-center">
          <Heart className="h-8 w-8 text-rose-500 mr-2" />
          <span className="font-bold text-2xl tracking-tight text-slate-900">LifeLink</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link to="/about" className="text-sm font-medium hover:text-primary-600 transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-sm font-medium hover:text-primary-600 transition-colors">
            Contact
          </Link>
          <Link to="/login">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link to="/signup">
            <Button>Sign Up</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="w-full py-20 lg:py-32 bg-slate-50 border-b border-slate-200">
          <div className="container px-4 md:px-6 mx-auto text-center max-w-4xl">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-slate-900 mb-6">
              Connect <span className="text-primary-600">Donors</span> with Those in Need
            </h1>
            <p className="mx-auto max-w-[700px] text-lg sm:text-xl text-slate-500 mb-10">
              LifeLink is a centralized platform bringing together organ donors, recipients, and hospitals to save lives through seamless matching.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto">Become a Donor</Button>
              </Link>
              <Link to="/signup">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white">Request an Organ</Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="w-full py-20 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 sm:grid-cols-3">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-rose-100 rounded-full text-rose-600">
                  <Heart size={32} />
                </div>
                <h3 className="text-xl font-bold">Save Lives</h3>
                <p className="text-slate-500">Register as a donor and give the ultimate gift of life. One donor can save up to 8 lives.</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-primary-100 rounded-full text-primary-600">
                  <Activity size={32} />
                </div>
                <h3 className="text-xl font-bold">Smart Matching</h3>
                <p className="text-slate-500">Our advanced algorithm matches urgency, blood types, and locations instantly.</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-green-100 rounded-full text-green-600">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-xl font-bold">Secure & Verified</h3>
                <p className="text-slate-500">All hospitals are verified, ensuring a safe, legal, and ethical process.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="w-full py-6 bg-slate-50 border-t border-slate-200 mt-auto">
        <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row items-center justify-between">
          <p className="text-xs text-slate-500">© 2026 LifeLink Organ Donation System. All rights reserved.</p>
          <nav className="flex gap-4 sm:gap-6 mt-4 md:mt-0">
            <Link to="#" className="text-xs hover:underline underline-offset-4 text-slate-500">
              Terms of Service
            </Link>
            <Link to="#" className="text-xs hover:underline underline-offset-4 text-slate-500">
              Privacy Policy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
