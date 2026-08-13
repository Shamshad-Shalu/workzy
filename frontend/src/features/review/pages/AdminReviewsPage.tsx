import PageHeader from '@/components/molecules/PageHeader';
import { AdminReviewsContent } from '@/features/review';

export default function AdminReviewsPage() {
  return (
    <main className="pt-0 p-4 lg:p-6 space-y-4">
      <PageHeader title="All Reviews" description="Platform-wide Review management" />
      <AdminReviewsContent />
    </main>
  );
}
