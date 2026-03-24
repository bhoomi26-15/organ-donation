import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Users, Zap, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-red-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-700/50 bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-600/20">
              <Heart className="h-6 w-6 text-red-500" />
            </div>
            <span className="text-xl font-bold text-transparent bg-gradient-to-r from-red-400 to-red-600 bg-clip-text">
              LifeLink
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/about')}
              className="text-slate-400 hover:text-red-400 transition-colors font-medium"
            >
              About
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="text-slate-400 hover:text-red-400 transition-colors font-medium"
            >
              Contact
            </button>
            <Button
              variant="outline"
              onClick={() => navigate('/admin/login')}
            >
              Admin Login
            </Button>
            <Button onClick={() => navigate('/donor')}>
              Register as Donor
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-600/20 mb-6 mx-auto">
          <Heart className="h-8 w-8 text-red-500" />
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text mb-4">
          Donate Life, Save Lives
        </h1>
        
        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          A secure, intelligent organ donation platform that connects donors with recipients. 
          Register as a donor, request an organ, or manage the verification process.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <Button
            onClick={() => navigate('/donor')}
            className="flex items-center justify-center gap-2 text-lg px-8 py-3"
          >
            Register as Donor <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/about')}
            className="flex items-center justify-center gap-2 text-lg px-8 py-3"
          >
            Learn More
          </Button>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-8 rounded-lg border border-red-600/30 bg-red-600/5 hover:bg-red-600/10 transition-all hover:border-red-600/50">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-600/20 mb-4">
              <Users className="h-6 w-6 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-red-400 mb-2">For Donors</h3>
            <p className="text-slate-400 text-sm">
              Register your willingness to donate organs and help save lives in your community.
            </p>
          </div>

          <div className="p-8 rounded-lg border border-red-600/30 bg-red-600/5 hover:bg-red-600/10 transition-all hover:border-red-600/50">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-600/20 mb-4">
              <Heart className="h-6 w-6 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-red-400 mb-2">For Recipients</h3>
            <p className="text-slate-400 text-sm">
              Request organs with intelligent matching based on blood type, location, and urgency.
            </p>
          </div>

          <div className="p-8 rounded-lg border border-red-600/30 bg-red-600/5 hover:bg-red-600/10 transition-all hover:border-red-600/50">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-600/20 mb-4">
              <Shield className="h-6 w-6 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-red-400 mb-2">Admins</h3>
            <p className="text-slate-400 text-sm">
              Verify details, approve requests, and manage the entire matching process securely.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-slate-700/50">
        <h2 className="text-4xl font-bold text-red-400 mb-16 text-center">How It Works</h2>
        
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { num: '1', title: 'Register', desc: 'Create account as donor or recipient',  icon: '📝' },
            { num: '2', title: 'Complete Profile', desc: 'Fill in your medical and location details', icon: '📋' },
            { num: '3', title: 'Verification', desc: 'Admin verification for security', icon: '✅' },
            { num: '4', title: 'Get Matched', desc: 'System connects compatible users', icon: '🎯' },
          ].map((step, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-red-600 to-red-700 text-white font-bold text-lg mb-4 mx-auto">
                {step.num}
              </div>
              <h3 className="text-lg font-semibold text-red-400 mb-2 text-center">{step.title}</h3>
              <p className="text-slate-400 text-sm text-center">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-slate-700/50">
        <h2 className="text-4xl font-bold text-red-400 mb-16 text-center">Platform Features</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { icon: Shield, title: 'Secure Authentication', desc: 'Email/password and Google sign-in with Supabase Auth' },
            { icon: Zap, title: 'Intelligent Matching', desc: 'Algorithm-based donor-recipient matching by blood type, location, and urgency' },
            { icon: Users, title: 'Role-Based Access', desc: 'Separate dashboards for donors, recipients, hospitals, and admins' },
            { icon: CheckCircle2, title: 'Verification System', desc: 'Hospitals verify donors and approve requests with audit trails' },
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="flex gap-4 p-6 rounded-lg border border-slate-700/30 hover:border-red-600/30 bg-slate-900/50 hover:bg-slate-900 transition-colors">
                <Icon className="h-8 w-8 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-red-400 mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm">{feature.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* User Journey Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-slate-700/50">
        <h2 className="text-4xl font-bold text-red-400 mb-16 text-center">Your Journey</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              role: 'Donor Journey',
              steps: [
                'Sign up with email or Google',
                'Select donor role',
                'Complete donor profile (organs, blood type, medical info)',
                'Upload documents if needed',
                'Wait for hospital verification',
                'Get shown potential matches',
              ]
            },
            {
              role: 'Recipient Journey',
              steps: [
                'Sign up with email or Google',
                'Select recipient role',
                'Complete recipient profile',
                'Create organ request',
                'Wait for hospital approval',
                'Receive match updates',
              ]
            },
            {
              role: 'Hospital Journey',
              steps: [
                'Sign up with email or Google',
                'Select hospital role',
                'Complete hospital profile & upload license',
                'Review donors and recipients',
                'Approve/reject requests',
                'Manage and confirm matches',
              ]
            },
          ].map((journey, idx) => (
            <div key={idx} className="p-6 rounded-lg border border-red-600/30 bg-red-600/5">
              <h3 className="text-lg font-semibold text-red-400 mb-4">{journey.role}</h3>
              <ul className="space-y-3">
                {journey.steps.map((step, stepIdx) => (
                  <li key={stepIdx} className="flex items-start gap-3 text-slate-400 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-slate-700/50 text-center">
        <h2 className="text-4xl font-bold text-red-400 mb-4">Ready to Save Lives?</h2>
        <p className="text-slate-400 mb-10 max-w-2xl mx-auto text-lg">
          Join thousands of donors, recipients, and healthcare professionals on LifeLink. 
          Every registration brings us closer to saving lives.
        </p>
        <Button
          onClick={() => navigate('/donor')}
          className="flex items-center justify-center gap-2 text-lg px-8 py-3 mx-auto"
        >
          Start Your Journey <ArrowRight className="h-4 w-4" />
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-950/80 backdrop-blur-sm py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-500 text-sm mb-4">&copy; 2026 LifeLink Organ Donation Platform. All rights reserved.</p>
          <div className="flex justify-center gap-8 flex-wrap">
            <button className="text-slate-400 hover:text-red-400 transition-colors text-sm font-medium">Privacy Policy</button>
            <button className="text-slate-400 hover:text-red-400 transition-colors text-sm font-medium">Terms of Service</button>
            <button onClick={() => navigate('/contact')} className="text-slate-400 hover:text-red-400 transition-colors text-sm font-medium">Contact Us</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
