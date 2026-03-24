import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', message: '' });
      }, 3000);
    }, 1000);
  };

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
          Contact Us
        </h1>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="p-6 rounded-lg border border-red-600/30 bg-red-600/5">
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-red-400 mb-1">Email</h3>
                  <p className="text-slate-400">support@lifelink.org</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg border border-red-600/30 bg-red-600/5">
              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-red-400 mb-1">Phone</h3>
                  <p className="text-slate-400">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg border border-red-600/30 bg-red-600/5">
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-red-400 mb-1">Address</h3>
                  <p className="text-slate-400">123 Medical Plaza<br />Healthcare City, HC 12345</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg border border-red-600/30 bg-red-600/5">
              <h3 className="font-semibold text-red-400 mb-4">Business Hours</h3>
              <p className="text-slate-400 space-y-1">
                <span className="block">Monday - Friday: 9:00 AM - 6:00 PM</span>
                <span className="block">Saturday: 10:00 AM - 4:00 PM</span>
                <span className="block">Sunday: Emergency Support Only</span>
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="p-8 rounded-lg border border-red-600/30 bg-red-600/5">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-red-400 font-medium mb-2">Name</label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label className="block text-red-400 font-medium mb-2">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-red-400 font-medium mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Your message here..."
                  rows={5}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-300 placeholder-slate-500 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20 transition-colors"
                  required
                />
              </div>

              {submitted && (
                <div className="p-4 bg-green-900/30 border border-green-600/30 rounded-lg text-green-300">
                  Thank you! We'll get back to you soon.
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
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
}
