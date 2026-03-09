import { motion, type MotionProps } from 'framer-motion';

import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  hint?: string;
  action?: ReactNode;
  className?: string;
}

const fadeUp: MotionProps = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

export default function EmptyState({
  icon,
  title,
  description,
  hint,
  action,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      {...fadeUp}
      className={`flex flex-col items-center justify-center text-center py-16 px-6 bg-card border border-border rounded-2xl ${className ?? ''}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4 text-muted-foreground">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs">{description}</p>
      {hint && (
        <p className="mt-3 text-xs text-muted-foreground/60 bg-muted px-3 py-1.5 rounded-full">
          {hint}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
}
