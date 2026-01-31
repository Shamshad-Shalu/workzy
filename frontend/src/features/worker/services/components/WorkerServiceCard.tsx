import { Award, Clock, MapPin } from 'lucide-react';

import { StatusBadge } from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import type { Service } from '@/types/service';

interface ServiceCardTypes {
  service: Service;
  onToggleStatus?: (service: Service) => void;
  onEdit?: (service: Service) => void;
  isBooking?: boolean;
  onBookService?: (serviceId: string) => void;
}

export default function WorkerServiceCard({
  service,
  onEdit,
  onToggleStatus,
  isBooking = false,
  onBookService,
}: ServiceCardTypes) {
  return (
    <section className="group card bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={service.imageUrl}
          alt={service.serviceName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {!isBooking && (
          <div className="absolute top-3 left-3">
            <StatusBadge
              label={service.isAvailable ? 'Active' : 'Inactive'}
              status={service.isAvailable ? 'success' : 'error'}
            />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <span className="px-2.5 py-1 bg-purple-500/90 text-white rounded-full text-xs font-semibold">
            {service.serviceType}
          </span>
          {service.allowSuddenBooking && (
            <StatusBadge label="Instant" className="bg-orange-500/90 text-white " />
          )}
          {service.bulkDiscounts && service?.bulkDiscounts?.length > 0 && (
            <>
              {service.bulkDiscounts.map((discount, i) => (
                <StatusBadge
                  key={i}
                  label={`${discount.percent} % on ${discount.count}`}
                  className="bg-blue-500 text-white"
                />
              ))}
            </>
          )}
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1">
          {service.serviceName}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{service.description}</p>

        <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-border">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Award className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs text-muted-foreground">Experience</p>
            <p className="text-sm font-semibold text-foreground">{service.experience}y</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs text-muted-foreground">Duration</p>
            <p className="text-sm font-semibold text-foreground">{service.estimatedDuration}m</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs text-muted-foreground">Radius</p>
            <p className="text-sm font-semibold text-foreground">{service.maxTravelRadius}km</p>
          </div>
        </div>

        {/* Rate */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">₹{service.rate}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {service.pricingMode.replace('_', ' ')}
            </p>
          </div>
          <div className="flex gap-2">
            {isBooking ? (
              <>
                <Button onClick={() => onBookService?.(service.id)}>Book Service</Button>
              </>
            ) : (
              <>
                <Button onClick={() => onEdit?.(service)}>Edit</Button>
                <Button
                  onClick={() => onToggleStatus?.(service)}
                  variant={service.isAvailable ? 'red' : 'green'}
                >
                  {service.isAvailable ? 'Block' : 'Unblock'}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
