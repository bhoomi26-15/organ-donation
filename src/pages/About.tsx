import React from 'react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              LifeLink
            </Link>
            <div className="flex gap-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium">
                Home
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

      {/* Content */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About LifeLink</h1>

        <div className="prose max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            LifeLink is dedicated to saving lives by connecting organ donors with people in critical need of transplants.
            We believe that every life is precious, and our platform makes the donation process simple, transparent, and secure.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What We Do</h2>
          <p className="text-gray-600 mb-6">
            We provide a digital platform where:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li>Organ donors can register and provide their information</li>
            <li>People in need can register as seekers</li>
            <li>Hospital administrators can manage both donors and seekers</li>
            <li>Authorized personnel can create matches based on compatibility</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why LifeLink?</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li><strong>Transparent:</strong> Clear information about all registered donors and seekers</li>
            <li><strong>Secure:</strong> Your medical information is protected and confidential</li>
            <li><strong>Simple:</strong> Easy registration and intuitive user interface</li>
            <li><strong>Efficient:</strong> Quick matching process to save precious time</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact Us</h2>
          <p className="text-gray-600 mb-6">
            Have questions? Visit our <Link to="/contact" className="text-blue-600 hover:underline">contact page</Link> to
            reach out to us.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
