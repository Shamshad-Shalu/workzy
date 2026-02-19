import PageHeader from '@/components/molecules/PageHeader';
import { AdminHomeService } from '@/services/admin/home.service';

export default function AdminHomePage() {
  async function fetchHomeLayout() {
    const res = await AdminHomeService.getLayout();
    // return res.layout;
    console.log(res.layout);
  }

  fetchHomeLayout();
  return (
    <main>
      <PageHeader title="Home Management" description="Manage your platform's home sections" />
    </main>
  );
}
