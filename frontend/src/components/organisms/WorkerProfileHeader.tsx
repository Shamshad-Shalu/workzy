import type { WorkerInfo } from '@/types/worker';
import { Check, MapPin, Clock, Star, Award } from 'lucide-react';
import type React from 'react';

interface Props {
  workerInfo: WorkerInfo;
  workerAction?: React.ReactNode;
  showUserButtons?: boolean;
}

export default function WorkerProfileHeader({
  workerInfo,
  workerAction,
  showUserButtons = false,
}: Props) {
  const {
    displayName,
    tagline,
    location,
    experience,
    responseTime,
    rating,
    reviewsCount,
    rate,
    availability,
    profileImage,
    coverImage,
  } = workerInfo;

  return (
    <div className="w-full ">
      {/* Top Banner*/}
      <div className="relative -mx-4 lg:-mx-6 h-[260px] md:h-[320px] overflow-hidden">
        <img src={coverImage} className="w-full h-full object-cover" alt="banner" />
        <div className="absolute inset-0 bg-black/10" />
      </div>
      <div className="relative mx-auto -mt-15">
        <div className="bg-card rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between gap-10">
            <div className="flex flex-col md:flex-row gap-6 w-full">
              <div className="flex justify-center md:justify-start w-full md:w-auto">
                <div className="relative">
                  <div>
                    {workerAction ? (
                      workerAction
                    ) : (
                      <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow ">
                        <img
                          src={profileImage}
                          alt="Worker"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center text-left w-full">
                <div className="flex items-center flex-wrap gap-3">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">{displayName}</h1>
                  <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" /> Verified
                  </span>
                </div>

                <p className="text-muted-foreground text-lg">{tagline}</p>

                <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm mt-3">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} /> {location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Award size={16} /> {experience}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} /> {responseTime}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 hover:underline">
                <div className="flex text-yellow-500">
                  {[1, 2, 3, 4, 5].map((_, i) => {
                    const fillAmount = Math.max(0, Math.min(1, (rating || 0) - i));
                    return (
                      <div key={i} className="relative w-5 h-5">
                        <Star className="w-5 h-5 text-gray-300 absolute top-0 left-0" />
                        <div
                          className="absolute top-0 left-0 overflow-hidden h-full"
                          style={{ width: `${fillAmount * 100}%` }}
                        >
                          <Star key={i} className="w-5 h-5 fill-yellow-500" />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <span className="text-xl font-bold text-foreground">{rating}</span>
                <span className="text-muted-foreground text-sm whitespace-nowrap">
                  ({reviewsCount} reviews)
                </span>
              </div>
              <div className="text-left md:text-right">
                <p className="text-3xl font-bold text-foreground">₹{rate.amount}</p>
                <p className="text-muted-foreground text-sm">{rate.type}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  {availability}
                </span>
              </div>
            </div>
          </div>
          {showUserButtons && (
            <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
              <button className="px-10 py-3 bg-[#4c3f36] text-white rounded-full font-medium hover:bg-[#3a2f29] transition">
                Send Message
              </button>

              <button className="px-10 py-3 border border-border rounded-full font-medium hover:bg-accent transition">
                Show Bookings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
