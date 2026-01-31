import { MapPin } from 'lucide-react';

import { AppCarousel } from '@/components/molecules/AppCarousel';
import { ServiceCard } from '@/components/molecules/ServiceCard';
import { HeroCarousel } from '@/components/organisms/HeroCarousel';
import CTASection from '@/features/user/home/components/CTASection';
import HowItWorksSection from '@/features/user/home/components/HowItWorksSection';
import SponsoredBannerSection from '@/features/user/home/components/SponsoredBannerSection';
import TestimonialsSection from '@/features/user/home/components/TestimonialsSection';
import TopServiceSection from '@/features/user/home/components/TopServiceSection';
import TrustSection from '@/features/user/home/components/TrustSection';
import { WorkerCard } from '@/features/user/home/components/WorkerCard';

const API_DATA = {
  hero: {
    type: 'carousel',
    autoPlay: true,
    interval: 5000,
    slides: [
      {
        imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=80',
        title: 'Professional Services',
        subtitle: 'At Your Doorstep',
        description:
          'From home repairs to beauty services, find trusted professionals for any task',
        category: 'Home Services',
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80',
        title: 'Beauty & Wellness',
        subtitle: 'Premium Care at Home',
        description: 'Expert beauticians and wellness professionals ready to serve you',
        category: 'Beauty',
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=1200&q=80',
        title: 'Tech Solutions',
        subtitle: 'Quick & Reliable',
        description: 'Fast repairs and setup for all your devices and networks',
        category: 'Technology',
      },
    ],
  },

  serviceCategories: [
    {
      id: 'home-appliance',
      title: 'Home & Appliance',
      subTitle: 'Profesional you can trust ',
      order: 1,
      services: [
        {
          id: 's1',
          name: 'Plumbing Services',
          description: 'Electrical, plumbing, appliance repair & more',
          imageUrl: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&q=80',
          bookings: '18K+',
          subServices: [
            'Fix Water Leakage',
            'Tap Installation',
            'Drainage Cleaning',
            'Fix Water Leakage dfsdsfgdf',
          ],
        },
        {
          id: 's2',
          name: 'Appliance Repair',
          description: 'Fix washing machines, refrigerators & more',
          imageUrl: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=400&q=80',
          bookings: '12K+',
          subServices: ['Washing Machine', 'Refrigerator', 'Microwave', 'Dishwasher'],
        },
        {
          id: 's3',
          name: 'Electrical Services',
          description: 'Licensed electricians for wiring & installations',
          imageUrl: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&q=80',
          bookings: '15K+',
          startingPrice: '₹249',
          subServices: ['Wiring', 'Switchboard', 'Fan Installation', 'Light Fitting'],
        },
        {
          id: 's4',
          name: 'AC Services',
          description: 'AC repair, servicing & installation experts',
          imageUrl: 'https://images.unsplash.com/photo-1631545806609-7e7e1a3c6f3b?w=400&q=80',
          bookings: '22K+',
          startingPrice: '₹349',
          subServices: ['AC Repair', 'Gas Refill', 'Installation', 'Deep Cleaning'],
        },
        {
          id: 's5',
          name: 'Carpenter Services',
          description: 'Furniture repair, installation & custom work',
          imageUrl: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&q=80',
          bookings: '8K+',
          startingPrice: '₹399',
          subServices: ['Furniture Repair', 'Door Fix', 'Cabinet Work', 'Custom Work'],
        },
      ],
    },
    {
      id: 'cleaning',
      title: 'Cleaning & Home Care',
      subTitle: 'Cleaning & Home Care',
      order: 2,
      services: [
        {
          id: 's6',
          name: 'Deep Cleaning',
          description: 'Comprehensive home cleaning service',
          imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80',
          bookings: '25K+',
          subServices: ['Kitchen Deep Clean', 'Bathroom', 'Living Room', 'Bedroom'],
        },
        {
          id: 's7',
          name: 'Bathroom Cleaning',
          description: 'Professional bathroom sanitization',
          imageUrl: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=400&q=80',
          bookings: '14K+',
          subServices: ['Toilet Cleaning', 'Tile Scrubbing', 'Drain Clean', 'Sanitization'],
        },
        {
          id: 's8',
          name: 'Sofa Cleaning',
          description: 'Steam cleaning for sofas & upholstery',
          imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80',
          bookings: '10K+',
          subServices: ['Fabric Sofa', 'Leather Sofa', 'Chair Cleaning', 'Cushion Clean'],
        },
        {
          id: 's9',
          name: 'Kitchen Cleaning',
          description: 'Complete kitchen deep cleaning',
          imageUrl: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&q=80',
          bookings: '16K+',
          subServices: ['Chimney Clean', 'Cabinet Clean', 'Sink Clean', 'Floor Clean'],
        },
      ],
    },
    {
      id: 'beauty',
      title: 'Beauty & Wellness',
      subTitle: 'Profesional you can trust ',
      order: 3,
      services: [
        {
          id: 's10',
          name: 'Home Salon',
          description: 'Professional salon services at home',
          imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&q=80',
          bookings: '20K+',
          subServices: ['Haircut', 'Hair Color', 'Styling', 'Treatment'],
        },
        {
          id: 's11',
          name: 'Makeup & Styling',
          description: 'Professional makeup for all occasions',
          imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80',
          bookings: '15K+',
          subServices: ['Party Makeup', 'Bridal', 'Pre-wedding', 'Engagement'],
        },
        {
          id: 's12',
          name: 'Spa & Massage',
          description: 'Relaxing massage therapy at home',
          imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80',
          bookings: '12K+',
          subServices: ['Swedish', 'Deep Tissue', 'Thai', 'Aromatherapy'],
        },
        {
          id: 's13',
          name: 'Facial & Skincare',
          description: 'Professional facial treatments',
          imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80',
          bookings: '18K+',
          subServices: ['Classic Facial', 'Anti-aging', 'Brightening', 'Acne Care'],
        },
      ],
    },
  ],

  topServices: [
    {
      id: '1',
      name: 'AC Repair',
      bookings: '22K+',
      imageUrl: 'https://images.unsplash.com/photo-1631545806609-7e7e1a3c6f3b?w=300&q=80',
    },
    {
      id: '2',
      name: 'Deep Cleaning',
      bookings: '25K+',
      imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&q=80',
    },
    {
      id: '3',
      name: 'Plumbing Fix',
      bookings: '18K+',
      imageUrl: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=300&q=80',
    },
    {
      id: '4',
      name: 'Home Salon',
      bookings: '20K+',
      imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&q=80',
    },
    {
      id: '5',
      name: 'Electrical Work',
      bookings: '15K+',
      imageUrl: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&q=80',
    },
    {
      id: '6',
      name: 'Facial & Skincare',
      bookings: '18K+',
      imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=300&q=80',
    },
    {
      id: '7',
      name: 'Appliance Repair',
      bookings: '12K+',
      imageUrl: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=300&q=80',
    },
    {
      id: '8',
      name: 'Kitchen Cleaning',
      bookings: '16K+',
      imageUrl: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=300&q=80',
    },
  ],

  nearbyWorkers: [
    {
      id: 'w1',
      displayName: 'Rajesh Kumar',
      tagline: 'Electrician',
      experience: 12,
      completedJobs: 1247,
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
      distance: '2.5 km',
      verified: true,
    },
    {
      id: 'w2',
      displayName: 'Priya Sharma',
      tagline: 'Beautician',
      experience: 8,
      completedJobs: 892,
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
      distance: '3.2 km',
      verified: true,
    },
    {
      id: 'w3',
      displayName: 'Amit Patel',
      tagline: 'Plumber',
      experience: 10,
      completedJobs: 1056,
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
      distance: '1.8 km',
      verified: true,
    },
    {
      id: 'w4',
      displayName: 'Sneha Reddy',
      tagline: 'Interior Designer',
      experience: 6,
      completedJobs: 234,
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
      distance: '4.1 km',
      verified: true,
    },
    {
      id: 'w5',
      displayName: 'Vikram Singh',
      tagline: 'AC Technician',
      experience: 9,
      completedJobs: 678,
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
      distance: '2.9 km',
      verified: true,
    },
    {
      id: 'w6',
      displayName: 'Kavya Nair',
      tagline: 'Cleaner',
      experience: 5,
      completedJobs: 543,
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
      distance: '3.7 km',
      verified: true,
    },
  ],

  sponsoredBanners: [
    {
      id: 'b1',
      title: 'Planning Kitchen Renovation?',
      description: 'Get expert consultation & flat 20% off on complete modular kitchen setup',
      imageUrl: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80',
      ctaText: 'Book Consultation',
      position: 'after_services',
    },
    {
      id: 'b2',
      title: 'Bathroom Makeover Special',
      description: 'Professional waterproofing, tiling & complete bathroom renovation services',
      imageUrl: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&q=80',
      ctaText: 'Get Quote',
      position: 'after_workers',
    },
  ],

  howItWorks: [
    {
      step: 1,
      title: 'Search & Select',
      description: 'Browse verified professionals in your area with ratings and reviews',
      imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&q=80',
    },
    {
      step: 2,
      title: 'Book & Pay',
      description: 'Secure escrow payment - money released only after job completion',
      imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80',
    },
    {
      step: 3,
      title: 'Track & Review',
      description: 'Real-time tracking, OTP verification, and rate your experience',
      imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80',
    },
  ],
  trustPoints: [
    {
      icon: 'Shield',
      title: 'Verified Professionals',
      description: 'Background-checked & ID verified',
      stat: '10,000+',
      imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&q=80',
    },
    {
      icon: 'Star',
      title: '4.8 Average Rating',
      description: 'Highly rated by customers',
      stat: '4.8/5',
      imageUrl: 'https://images.unsplash.com/photo-1556745753-b2904692b3cd?w=300&q=80',
    },
    {
      icon: 'Clock',
      title: 'Quick Response',
      description: 'Average 30-min arrival time',
      stat: '<30 min',
      imageUrl: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=300&q=80',
    },
    {
      icon: 'Award',
      title: 'Money-Back Guarantee',
      description: 'Secure escrow payments',
      stat: '100%',
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80',
    },
  ],

  testimonials: [
    {
      id: '1',
      name: 'Priya Menon',
      service: 'Home Cleaning',
      comment: 'Excellent service! The escrow payment system made me feel secure.',
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
      date: '2 weeks ago',
    },
    {
      id: '2',
      name: 'Rajesh Kumar',
      service: 'AC Repair',
      comment: 'Real-time tracking was amazing. Worker arrived on time!',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
      date: '1 month ago',
    },
    {
      id: '3',
      name: 'Anjali Patel',
      service: 'Bridal Makeup',
      comment: 'The OTP verification gave me confidence. Makeup was stunning!',
      imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
      date: '3 days ago',
    },
  ],

  stats: {
    customers: '12M+',
    professionals: '50K+',
    rating: '4.8',
    services: '200+',
  },
};

export default function HomePage() {
  return (
    <main>
      <HeroCarousel data={API_DATA.hero} stats={API_DATA.stats} />

      {API_DATA.serviceCategories
        .sort((a, b) => a.order - b.order)
        .map((category, index) => (
          <div key={category.id}>
            <section className="py-20 ">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* header */}
                <div className="text-start mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-3">{category.title}</h2>
                  <p className="text-xl text-muted-foreground">{category.subTitle}</p>
                </div>
                <AppCarousel
                  items={API_DATA.serviceCategories[0].services}
                  renderItem={service => <ServiceCard service={service} />}
                  className="min-[550px]:basis-1/2 md:basis-1/3"
                />
              </div>
            </section>

            {index === 0 && API_DATA.sponsoredBanners[0] && (
              <SponsoredBannerSection banner={API_DATA.sponsoredBanners[0]} />
            )}
          </div>
        ))}

      <TrustSection trustPoints={API_DATA.trustPoints} />
      <HowItWorksSection steps={API_DATA.howItWorks} />

      <TopServiceSection topServices={API_DATA.topServices} />

      <section className="py-16 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full text-indigo-600 text-sm mb-3">
                <MapPin className="w-4 h-4" />
                In Your Area
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Professionals Near You
              </h2>
              <p className="text-gray-600">Verified experts ready to serve</p>
            </div>
          </div>

          <AppCarousel
            items={API_DATA.nearbyWorkers}
            renderItem={worker => <WorkerCard key={worker.id} worker={worker} />}
            className="pl-5"
          />
        </div>
      </section>

      {/* Second Sponsored Banner */}
      {API_DATA.sponsoredBanners[1] && (
        <SponsoredBannerSection banner={API_DATA.sponsoredBanners[1]} />
      )}

      {/* Testimonials */}
      <TestimonialsSection testimonials={API_DATA.testimonials} />

      <CTASection />
    </main>
  );
}
