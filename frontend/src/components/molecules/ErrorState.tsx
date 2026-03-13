import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = 'Something went wrong',
  description = "We couldn't load the data. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center text-center py-10 px-6 border rounded-2xl bg-card"
    >
      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4 text-destructive">
        <AlertCircle className="w-5 h-5" />
      </div>

      <h3 className="font-semibold text-sm mb-1">{title}</h3>

      <p className="text-xs text-muted-foreground max-w-xs">{description}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 text-xs font-medium px-4 py-2 rounded-lg border hover:bg-muted"
        >
          Try Again
        </button>
      )}
    </motion.div>
  );
}
