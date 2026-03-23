import { Calendar, MapPin, User, FileText, IndianRupee, Info } from 'lucide-react';

import { AppModal } from '@/components/molecules/AppModal';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/features/user/booking/components/bookingActions/UserBookingCard';
import { useBookingDetails } from '@/hooks/useBookingDetails';
import { formatCurrency } from '@/utils/currency';
import { formatSmartDate, formatTime12 } from '@/utils/time.format';

export default function WorkerBookingDetailModal({
  open,
  onClose,
  bookingIdByCard,
}: {
  open: boolean;
  onClose: () => void;
  bookingIdByCard: string | null;
}) {
  const { data: booking, isLoading } = useBookingDetails(bookingIdByCard);

  return (
    <AppModal open={open} onClose={onClose} title="Booking Details" className="max-w-xl">
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      ) : !booking ? (
        <div className="py-10 text-center text-muted-foreground">Booking details not found.</div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden">
                {booking.category.iconUrl ? (
                  <img
                    src={booking.category.iconUrl}
                    alt={booking.category.name}
                    className="w-10 h-10 object-contain"
                  />
                ) : (
                  <FileText className="text-primary" size={32} />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold">{booking.category.name}</h3>
                <p className="text-sm text-muted-foreground">Booking ID: {booking.bookingId}</p>
                <div className="mt-2 text-xs">
                  <StatusBadge status={booking.status} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border bg-muted/30 space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Calendar size={16} className="text-primary" />
                Schedule
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">{formatSmartDate(booking.date)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-medium">
                    {formatTime12(booking.startTime)} - {formatTime12(booking.endTime)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{booking.duration} mins</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border bg-muted/30 space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <User size={16} className="text-primary" />
                Client
              </h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                  {booking.user.profileImage ? (
                    <img
                      src={booking.user.profileImage}
                      alt={booking.user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-bold text-lg">{booking.user.name[0]}</span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold">{booking.user.name}</p>
                  <p className="text-xs text-muted-foreground">Verified Client</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border bg-muted/30 space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <MapPin size={16} className="text-primary" />
              Service Location
            </h4>
            <p className="text-sm leading-relaxed">
              {booking.address?.label || 'Location not provided'}
            </p>
          </div>

          {booking.userNote && (
            <div className="p-4 rounded-xl border bg-blue-50/50 border-blue-100 space-y-2">
              <h4 className="text-sm font-semibold flex items-center gap-2 text-blue-800">
                <FileText size={16} />
                Client Note
              </h4>
              <p className="text-sm italic text-blue-700">"{booking.userNote}"</p>
            </div>
          )}

          <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-4">
            <h4 className="text-sm font-semibold flex items-center gap-2 text-primary">
              <IndianRupee size={16} />
              Payment Breakdown
            </h4>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Service Subtotal ({booking.itemCount} units)
                </span>
                <span>{formatCurrency(booking.subtotal)}</span>
              </div>

              {booking.discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Bulk Discount ({booking.discountPercent}%)</span>
                  <span>-{formatCurrency(booking.discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Travel Cost</span>
                <span>{formatCurrency(booking.travelCost)}</span>
              </div>

              <div className="pt-2 border-t border-primary/10 flex justify-between items-center">
                <span className="font-medium">Client Total Paid</span>
                <span className="font-bold">{formatCurrency(booking.total)}</span>
              </div>

              <div className="flex justify-between text-sm text-red-500 pt-1">
                <span className="flex items-center gap-1">
                  Platform Fee ({booking.platformFeePercent}%)
                  <Info size={12} className="cursor-help" />
                </span>
                <span>-{formatCurrency(booking.platformFee)}</span>
              </div>

              <div className="pt-3 border-t-2 border-dashed border-primary/20 flex justify-between items-center">
                <span className="text-lg font-extrabold text-primary">Your Net Earnings</span>
                <span className="text-2xl font-black text-green-600">
                  {formatCurrency(booking.total - booking.platformFee)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppModal>
  );
}
