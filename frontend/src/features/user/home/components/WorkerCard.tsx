import { CheckCircle, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { Worker } from '@/types/home/home';

interface WorkerCardProps {
  worker: Worker;
  onclick?: (workerId: string) => void;
}

export const WorkerCard = ({ worker, onclick }: WorkerCardProps) => {
  return (
    <div
      className="
        w-full flex-shrink-0
        bg-popover rounded-xl
        border border-muted-foreground/10
        shadow-md hover:shadow-xl
        transition-all duration-300
        overflow-hidden
        cursor-pointer group
        hover:-translate-y-1
        min-h-[220px]
        flex flex-col
      "
      onClick={() => onclick?.(worker.workerId)}
      role="button"
      tabIndex={0}
    >
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start gap-4 ">
          <div className="relative shrink-0">
            <img
              src={worker.profileImage}
              alt={worker.displayName}
              className="w-14 h-14 rounded-full object-cover"
            />

            {worker.verified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center border-2 border-white">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-foreground text-lg group-hover:text-indigo-600 transition-colors">
              {worker.displayName}
            </h3>
            <p className="text-sm text-indigo-600 font-medium leading-snug overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">
              {worker.tagline}
            </p>

            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span>{worker.experience}y exp</span>
              {/* <span>•</span>
              <span>{worker.completedJobs} jobs</span> */}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{worker.distance}km away</span>
          </div>
        </div>
        <Link to={`/workers/${worker.workerId}`}>
          <button
            className="
            w-full py-3 rounded-lg
            bg-gradient-to-r from-indigo-600 to-purple-600
            text-white font-semibold
            hover:shadow-lg
            transition-all
            "
          >
            View Profile
          </button>
        </Link>
      </div>
    </div>
  );
};
