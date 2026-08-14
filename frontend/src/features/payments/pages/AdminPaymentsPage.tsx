import { motion } from 'framer-motion';

import PageHeader from '@/components/molecules/PageHeader';
import { AdminPaymentsContent } from '@/features/payments';

export default function AdminPaymentsPage() {
  return (
    <main className="p-4 lg:p-6">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <PageHeader title="Payments" description="Platform-wide transaction management" />
      </motion.div>
      <div className="mt-4">
        <AdminPaymentsContent />
      </div>
    </main>
  );
}
