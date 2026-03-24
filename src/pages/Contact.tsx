import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const Contact: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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
        <h1 className="text-5xl font-bold text-gray-900 mb-12 text-center">Contact Us</h1>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="p-6 rounded-lg border border-gray-200 bg-gray-50">
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <p className="text-gray-600">support@lifelink.org</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg border border-gray-200 bg-gray-50">
              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg border border-gray-200 bg-gray-50">
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                  <p className="text-gray-600">123 Medical Plaza<br />Healthcare City, HC 12345</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg border border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-4">Business Hours</h3>
              <p className="text-gray-600 space-y-1">
                <span className="block">Monday - Friday: 9:00 AM - 6:00 PM</span>
                <span className="block">Saturday: 10:00 AM - 4:00 PM</span>
                <span className="block">Sunday: Emergency Support Only</span>
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="p-8 rounded-lg border border-gray-200 bg-gray-50">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h2>

            {submitted ? (
              <div className="p-4 rounded-lg border border-green-200 bg-green-50 text-green-700">
                <p className="font-medium">Thank you! We'll be in touch soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-gray-700 text-sm font-medium block mb-2">Name</label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label className="text-gray-700 text-sm font-medium block mb-2">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="text-gray-700 text-sm font-medium block mb-2">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Your message..."
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            )}
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

export default Contact;
