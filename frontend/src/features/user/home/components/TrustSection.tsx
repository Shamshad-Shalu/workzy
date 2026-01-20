import { Shield, Star, Clock, Award } from 'lucide-react';

interface TrustPoint {
  icon: string;
  imageUrl: string;
  stat: string;
  title: string;
  description: string;
}

interface TrustSectionProps {
  trustPoints: TrustPoint[];
}

export default function TrustSection({ trustPoints }: TrustSectionProps) {
  return (
    <section className=" bg-section-dark py-20 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-background">
            Why Choose Workzy?
          </h2>
          <p className="text-xl text-muted">Your trust, our priority</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustPoints.map((point, idx) => {
            const IconComponent =
              point.icon === 'Shield'
                ? Shield
                : point.icon === 'Star'
                  ? Star
                  : point.icon === 'Clock'
                    ? Clock
                    : Award;

            return (
              <div key={idx} className="group">
                <div className="relative h-48 rounded-2xl overflow-hidden mb-4 shadow-lg border border-white/10 dark:border-black/5">
                  <img
                    src={point.imageUrl}
                    alt={point.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/30"></div>

                  <div className="absolute top-4 left-4 w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>

                  <div className="absolute bottom-4 left-4">
                    <div className="text-4xl font-bold text-white">{point.stat}</div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-background">{point.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{point.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
