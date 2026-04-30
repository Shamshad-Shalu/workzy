import { motion, type MotionProps } from 'framer-motion';
import { ClipboardCheck, Star, TrendingUp } from 'lucide-react';
import { NavLink, Outlet, useParams } from 'react-router-dom';

import ErrorState from '@/components/molecules/ErrorState';
import StatCard from '@/components/molecules/StatCard';
import WorkerProfileHeader from '@/components/organisms/WorkerProfileHeader';
import { useWorkerProfile } from '@/features/profile/hooks/useWorkerProfile';
import WorkerProfileLayoutSkeleton from '@/features/worker/profile/components/WorkeAboutSkeleton';
import { cn } from '@/lib/utils';

const TABS = [
  { name: 'About', path: '' },
  { name: 'Services', path: 'services' },
  { name: 'Reviews', path: 'reviews' },
];

const fadeUp = (delay = 0): MotionProps => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay, ease: 'easeOut' },
});

export default function WorkerProfileRouteLayout() {
  const { workerId } = useParams();
  const { data, isLoading, error, isError, refetch } = useWorkerProfile(workerId);

  const { id, averageRating, completedJobs, coverImage, complitionRate } = data ?? {};

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'px-5 py-3.5 text-sm font-medium transition-all duration-150 border-b-2 whitespace-nowrap',
      isActive
        ? 'text-foreground font-semibold border-foreground'
        : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/40'
    );

  return (
    <main className="flex flex-col min-h-screen bg-background">
      {isLoading ? (
        <WorkerProfileLayoutSkeleton />
      ) : isError ? (
        <ErrorState description={error.message} onRetry={refetch} />
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative w-full h-[200px] md:h-[260px] overflow-hidden"
          >
            <img src={coverImage} alt="cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-background/10 to-transparent" />
          </motion.div>
          <section className="section-container -mt-20 relative z-10 pb-16 flex flex-col gap-5">
            {data && (
              <motion.div {...fadeUp(0.05)}>
                <WorkerProfileHeader worker={data} />
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.12, ease: 'easeOut' }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              <StatCard
                icon={<ClipboardCheck className="w-5 h-5" />}
                label="Jobs Completed"
                value={completedJobs}
                tone="info"
              />
              <StatCard
                icon={<Star className="w-5 h-5" />}
                label="Average Rating"
                value={averageRating}
                tone="warning"
              />
              <StatCard
                icon={<TrendingUp className="w-5 h-5" />}
                label="Completion Rate"
                value={`${complitionRate}%`}
                tone="success"
              />
            </motion.div>
            <motion.div {...fadeUp(0.2)}>
              <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                <div className="flex border-b border-border px-2">
                  {TABS.map(tab => (
                    <NavLink
                      key={tab.name}
                      to={tab.path}
                      end={tab.path === ''}
                      className={getNavLinkClass}
                    >
                      {tab.name}
                    </NavLink>
                  ))}
                </div>
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="p-5 md:p-6"
                >
                  <Outlet />
                </motion.div>
              </div>
            </motion.div>
          </section>
        </>
      )}
    </main>
  );
}
