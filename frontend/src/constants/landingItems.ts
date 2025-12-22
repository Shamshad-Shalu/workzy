import { BarChart, CalendarCheck, CreditCard, MessageSquare, Shield, Users } from 'lucide-react';

export interface FAQItemProps {
  question: string;
  answer: string;
}

export interface FeatureCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}
export const PROCESS_STEPS = [
  {
    title: 'Create Your Profile',
    description:
      'Sign up and build your professional profile showcasing your services, experience, and availability.',
  },
  {
    title: 'Set Your Services & Rates',
    description:
      'Define what services you offer, your service area, and set competitive rates that work for your business.',
  },
  {
    title: 'Get Matched With Customers',
    description:
      'Our algorithm connects you with customers seeking your specific services in your area.',
  },
  {
    title: 'Provide Great Service & Grow',
    description:
      'Deliver excellent service, collect reviews, and watch your business expand through our platform.',
  },
];
export const FAQ_ITEMS: FAQItemProps[] = [
  {
    question: 'How much does it cost to join Workzy?',
    answer:
      'Joining Workzy is completely free. We offer a Basic plan with no monthly fees, where we only take a 10% service fee on completed bookings.',
  },
  {
    question: 'How do I receive payments for my services?',
    answer:
      'All payments are processed securely through our platform. Clients pay through the app, and funds are automatically transferred to your linked bank account within 2 business days after service completion.',
  },
  {
    question: 'Can I set my own prices and availability?',
    answer:
      "You have complete control over your pricing, service offerings, and availability. You can set different rates for different services and block off times when you're unavailable.",
  },
  {
    question: 'What happens if a client cancels a booking?',
    answer:
      "Our cancellation policy protects service providers. If a client cancels within 24 hours of the scheduled service, you'll receive a 50% payment.",
  },
  {
    question: 'How does Workzy help me find new clients?',
    answer:
      'Our platform uses a sophisticated matching algorithm to connect you with customers seeking your specific services in your area. We also provide marketing tools and promotional opportunities.',
  },
];

export const FEATURE_CARDS: FeatureCardProps[] = [
  {
    icon: Users,
    title: 'Reach More Customers',
    description:
      'Connect with customers in your area looking for quality services. Our matching algorithm ensures you get clients that fit your services.',
  },
  {
    icon: CalendarCheck,
    title: 'Easy Appointment Management',
    description:
      'Our intuitive platform helps you manage bookings, schedules, and client communications all in one place.',
  },
  {
    icon: CreditCard,
    title: 'Zero Setup Cost',
    description:
      'Get started without any upfront investment. We only earn when you do, with our fair commission structure.',
  },
  {
    icon: Shield,
    title: 'Verified Customers',
    description:
      'All customers on our platform are verified, ensuring you work with reliable clients who value quality service.',
  },
  {
    icon: BarChart,
    title: 'Business Analytics',
    description:
      'Access detailed reports and analytics to understand your business performance and identify growth opportunities.',
  },
  {
    icon: MessageSquare,
    title: 'Client  Communication',
    description:
      'Built-in messaging system allows for seamless communication with customers before, during, and after service.',
  },
];
