import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Shield } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-blue-600">LifeLink</div>
            <div className="flex gap-4">
              <Link to="/about" className="text-gray-600 hover:text-gray-900 font-medium">
                About
              </Link>
              <Link to="/contact" className="text-gray-600 hover:text-gray-900 font-medium">
                Contact
              </Link>
              <Link to="/admin/login" className="text-gray-600 hover:text-gray-900 font-medium">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Save Lives, Give Hope</h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Connect as a donor or find the organ you need. LifeLink brings together donors and people in need through a simple, transparent platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/donor"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Register as Donor
            </Link>
            <Link
              to="/needer"
              className="inline-block bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Seek an Organ
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Register</h3>
              <p className="text-gray-600">
                Sign up as a donor or needer by filling out a simple form with your details.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect</h3>
              <p className="text-gray-600">
                Our admins review registrations and find compatible matches based on blood group and organ type.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Process</h3>
              <p className="text-gray-600">
                All information is secure and confidential. Only authorized hospital staff can access details.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50 p-8 rounded-lg text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">Donors</div>
              <p className="text-gray-600">Register and list the organs you can donate</p>
            </div>
            <div className="bg-green-50 p-8 rounded-lg text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">Seekers</div>
              <p className="text-gray-600">Find the organ match you need through our platform</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2026 LifeLink. All rights reserved. Saving lives, one organ at a time.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
