import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export function Contact() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="px-6 lg:px-14 h-20 flex items-center shadow-sm bg-white shrink-0">
        <Link to="/" className="flex items-center justify-center">
          <Heart className="h-8 w-8 text-rose-500 mr-2" />
          <span className="font-bold text-2xl tracking-tight text-slate-900">LifeLink</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link to="/" className="text-sm font-medium hover:text-primary-600">Home</Link>
          <Link to="/about" className="text-sm font-medium hover:text-primary-600">About</Link>
        </nav>
      </header>

      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Contact Us</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Have questions? We're here to help you understand the donation system, platform integration, or anything else.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8 md:p-12 bg-primary-900 text-white">
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="mt-1 mr-4 h-6 w-6 text-primary-300" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-primary-200 mt-1">support@lifelink.org</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="mt-1 mr-4 h-6 w-6 text-primary-300" />
                  <div>
                    <p className="font-medium">Direct Line</p>
                    <p className="text-primary-200 mt-1">1-800-LIFELINK</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="mt-1 mr-4 h-6 w-6 text-primary-300" />
                  <div>
                    <p className="font-medium">Office Location</p>
                    <p className="text-primary-200 mt-1">123 Healthway Drive<br/>Medical District<br/>NY 10001</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-8 md:p-12">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="First Name" placeholder="John" />
                  <Input label="Last Name" placeholder="Doe" />
                </div>
                <Input label="Email Address" type="email" placeholder="john@example.com" />
                <div className="w-full">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                  <textarea 
                    className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[120px]"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                <Button type="button" className="w-full" size="lg">Send Message</Button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
