import { Heart, Star } from 'lucide-react';

import type { TestimonialsContent } from '@/types/home/home.sectionContent';

type TestimonialsSectionProps = Pick<TestimonialsContent, 'items' | 'title'>;

export default function TestimonialsSection({ items, title }: TestimonialsSectionProps) {
  return (
    <section className="py-16  bg-section-blue ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full text-indigo-600 text-sm mb-4 shadow-md">
            <Heart className="w-4 h-4 fill-red-500 text-red-500" />
            Customer Love
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            {title || 'What Our Customers Say'}
          </h2>
          <p className="text-xl text-muted-foreground">Real reviews from real people</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((testimonial, i) => (
            <div
              key={i}
              className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${ i < testimonial.rating  ? "fill-yellow-400 text-yellow-400" : "fill-transparent text-gray-300"}`}
                />
              ))}
            </div>
              <p className="text-muted-foreground mb-6 italic leading-relaxed">
                "{testimonial.comment}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-muted-foreground/20">
                <img
                  src={testimonial.imageUrl}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground ">{testimonial.service}</div>
                </div>
                <div className="text-xs text-muted-foreground">{testimonial.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
