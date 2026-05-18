import { motion, type Variants } from 'framer-motion';

import { Card, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

export default function SkeletonStatCard() {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 14, scale: 0.975 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: 'easeInOut' },
    },
  };

  return (
    <motion.div variants={itemVariants}>
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-7 w-20" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
