import { Award, MapPin } from 'lucide-react';

import type { WorkerProfile } from '@/types/worker';

import { StarRating } from '../atoms/StarRating';
import ProfileImage from '../molecules/ProfileImage';

import type React from 'react';

interface Props {
  worker: WorkerProfile;
  workerAction?: React.ReactNode;
  showUserButtons?: boolean;
}

export default function WorkerProfileHeader({
  worker,
  workerAction,
  showUserButtons = false,
}: Props) {
  const {
    displayName,
    tagline,
    experience,
    averageRating,
    reviewCount,
    profileImage,
    addressLabel,
  } = worker;

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-10">
        <div className="flex flex-col md:flex-row gap-5 w-full">
          <div className="flex justify-center md:justify-start flex-shrink-0">
            <div className="relative">
              {workerAction ? (
                workerAction
              ) : (
                <ProfileImage src={profileImage} name={displayName} />
                // <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden ring-2 ring-border shadow-md">
                //   <img
                //     src={profileImage}
                //     alt={displayName}
                //     className="w-full h-full object-cover"
                //   />
                // </div>
              )}
            </div>
          </div>
          <div className="flex flex-col justify-center text-center md:text-left w-full gap-1.5">
            <h1 className="text-2xl md:text-[28px] font-extrabold text-foreground tracking-tight leading-tight">
              {displayName}
            </h1>
            <p className="text-sm text-muted-foreground">{tagline}</p>

            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 text-xs text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {addressLabel}
              </span>
              {experience && (
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> {experience} yrs exp
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 flex-shrink-0">
          <div className="flex flex-col items-center md:items-end gap-0.5">
            {/* <div className="flex items-center gap-1.5">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((_, i) => {
                  const fill = Math.max(0, Math.min(1, (averageRating || 0) - i));
                  return (
                    <div key={i} className="relative w-4 h-4">
                      <Star className="w-4 h-4 text-muted-foreground/20 absolute" />
                      <div
                        className="absolute overflow-hidden h-full"
                        style={{ width: `${fill * 100}%` }}
                      >
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
              <span className="text-base font-bold text-foreground">{averageRating}</span>
            </div> */}
            <StarRating rating={averageRating} />
            <span className="text-xs text-muted-foreground">({reviewCount} reviews)</span>
          </div>
          {/* <div className="text-right">
            <div className="flex items-start justify-end gap-0.5">
              <span className="text-sm font-bold text-foreground/60 mt-1">₹</span>
              <span className="text-3xl font-black text-foreground tracking-tighter leading-none">
                {rate}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">per visit</p>
          </div> */}
        </div>
      </div>

      {showUserButtons && (
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button className="flex-1 py-2.5 bg-foreground text-background text-sm font-semibold rounded-xl hover:opacity-85 transition-opacity">
            Send Message
          </button>
          <button className="flex-1 py-2.5 border border-border text-sm font-semibold rounded-xl hover:bg-muted transition-colors">
            Show Bookings
          </button>
        </div>
      )}
    </div>
  );
}
