import { CheckCircle, Clock, MapPin } from 'lucide-react';
export interface Worker {
  id: string;
  name: string;
  imageUrl: string;
  profession: string;
  experience: number;
  completedJobs: number;
  distance: string;
  responseTime: string;
  verified: boolean;
}

interface WorkerCardProps {
  worker: Worker;
}

export const WorkerCard = ({ worker }: WorkerCardProps) => {
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
      "
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <img
              src={worker.imageUrl}
              alt={worker.name}
              className="w-16 h-16 rounded-full object-cover"
            />

            {worker.verified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center border-2 border-white">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-foreground text-lg group-hover:text-indigo-600 transition-colors">
              {worker.name}
            </h3>
            <p className="text-sm text-indigo-600 font-medium">{worker.profession}</p>

            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span>{worker.experience}y exp</span>
              <span>•</span>
              <span>{worker.completedJobs} jobs</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{worker.distance} away</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{worker.responseTime}</span>
          </div>
        </div>
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
      </div>
    </div>
  );
};
