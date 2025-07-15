import React, { useState } from 'react';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Smartphone, 
  Users, 
  Star, 
  CheckCircle,
  Download,
  Apple,
  ChevronRight,
  Menu,
  X,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from 'lucide-react';

function Hero() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const features = [
    {
      icon: MapPin,
      title: 'Real-Time Availability',
      description:
        'Find available parking spots in real-time with live updates from our network of sensors and users.',
    },
    {
      icon: Clock,
      title: 'Reserve in Advance',
      description:
        'Book your parking spot ahead of time and never worry about finding a space when you arrive.',
    },
    {
      icon: DollarSign,
      title: 'Best Prices',
      description:
        'Compare prices from multiple parking providers and find the most affordable options in your area.',
    },
    {
      icon: Smartphone,
      title: 'Mobile Payments',
      description:
        'Pay securely through the app with multiple payment options including digital wallets and cards.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Business Professional',
      content:
        'ParkSpot has completely changed how I approach parking in the city. No more circling blocks!',
      rating: 5,
      avatar:
        'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    },
    {
      name: 'Michael Chen',
      role: 'Uber Driver',
      content:
        'As a rideshare driver, finding quick parking is crucial. This app saves me time and money every day.',
      rating: 5,
      avatar:
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Tourist',
      content:
        'Visiting the city was stress-free thanks to ParkSpot. Found parking near all the attractions easily.',
      rating: 5,
      avatar:
        'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    },
  ];

  const steps = [
    {
      step: '1',
      title: 'Search',
      description: 'Enter your destination and find available parking spots nearby',
    },
    {
      step: '2',
      title: 'Reserve',
      description: 'Choose your preferred spot and reserve it with one tap',
    },
    {
      step: '3',
      title: 'Park',
      description: 'Get turn-by-turn directions to your reserved parking space',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur shadow-sm border-b border-gray-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">ParkSpot</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">How It Works</a>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Reviews</a>
              <a href="#download" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Download</a>
            </nav>
            <button className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition-all font-semibold">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden flex items-center min-h-[70vh] py-16 md:py-32">
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-br from-blue-200/60 via-indigo-100/60 to-white" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-4 animate-fade-in-up">
                Find Parking <span className="text-blue-600">Fast</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 mb-6 animate-fade-in-up delay-100">
                The easiest way to discover, reserve, and pay for parking in seconds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8 animate-fade-in-up delay-200">
                <button className="bg-blue-600 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2 text-lg font-semibold">
                  <Download className="h-5 w-5" />
                  <span>Download Now</span>
                </button>
                <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center space-x-2 text-lg font-semibold">
                  <span>Watch Demo</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-8 flex items-center space-x-8 animate-fade-in-up delay-300">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-700">50K+</div>
                  <div className="text-sm text-gray-600">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-700">10K+</div>
                  <div className="text-sm text-gray-600">Parking Spots</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-700">4.9</div>
                  <div className="text-sm text-gray-600">App Rating</div>
                </div>
              </div>
            </div>
            <div className="relative animate-fade-in-up delay-200">
              <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm mx-auto border border-blue-100">
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl h-64 flex items-center justify-center mb-6">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-2 animate-bounce" />
                    <div className="text-gray-600">Interactive Map View</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-700">Available - $2.50/hr</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Reserved - $3.00/hr</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Occupied - $2.75/hr</span>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg animate-pulse">
                <span className="text-sm font-bold">LIVE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose ParkSpot?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our innovative platform makes parking simple, affordable, and stress-free for millions of users worldwide.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
              >
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <feature.icon className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Getting started is simple. Just three easy steps to secure your parking spot.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative bg-white rounded-2xl p-8 shadow hover:shadow-lg transition-all">
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-6 text-xl font-bold shadow-md">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 w-12 h-1 bg-blue-200 rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied users who have transformed their parking experience.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-shadow border border-blue-100 flex flex-col items-center relative overflow-hidden"
              >
                <span className="absolute left-4 top-4 text-blue-200 text-6xl font-serif opacity-30 select-none">“</span>
                <div className="flex items-center mb-4 z-10">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed text-center italic relative z-10">
                  {testimonial.content}
                </p>
                <div className="flex items-center mt-auto z-10">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 border-2 border-blue-100 shadow"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
                <span className="absolute right-4 bottom-4 text-blue-200 text-6xl font-serif opacity-30 select-none">”</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Parking?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join millions of users who have already discovered the easiest way to find and reserve parking.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="bg-black text-white px-10 py-4 rounded-xl hover:bg-gray-800 transition-colors flex items-center space-x-3 shadow-lg text-lg font-semibold">
              <Apple className="h-6 w-6" />
              <div className="text-left">
                <div className="text-xs">Download on the</div>
                <div className="text-lg font-semibold">App Store</div>
              </div>
            </button>
            <button className="bg-black text-white px-10 py-4 rounded-xl hover:bg-gray-800 transition-colors flex items-center space-x-3 shadow-lg text-lg font-semibold">
              <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                <div className="text-black text-xs font-bold">GP</div>
              </div>
              <div className="text-left">
                <div className="text-xs">Get it on</div>
                <div className="text-lg font-semibold">Google Play</div>
              </div>
            </button>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-blue-100">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Free to Download</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>No Hidden Fees</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">ParkSpot</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Making parking simple, affordable, and stress-free for everyone.
              </p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="hover:text-blue-400 transition-colors"><Facebook className="h-5 w-5" /></a>
                <a href="#" className="hover:text-blue-400 transition-colors"><Twitter className="h-5 w-5" /></a>
                <a href="#" className="hover:text-blue-400 transition-colors"><Instagram className="h-5 w-5" /></a>
                <a href="#" className="hover:text-blue-400 transition-colors"><Linkedin className="h-5 w-5" /></a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors hover:underline">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:underline">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:underline">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:underline">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors hover:underline">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:underline">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:underline">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:underline">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors hover:underline">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:underline">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:underline">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors hover:underline">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 bg-gray-900">
            <p>&copy; 2025 ParkSpot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Hero;