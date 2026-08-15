import { Building2, MapPin } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

import { Separator } from '@/components/ui/separator';
import type { UserProfileDetails } from '@/types/admin/user';

type UserOutletContext = {
  user: UserProfileDetails;
};

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium truncate">{value ?? '—'}</p>
      </div>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <Separator />
      {children}
    </div>
  );
}

export default function AdminUserOverviewPage() {
  const { user } = useOutletContext<UserOutletContext>();
  const address = user?.profile?.address;
  const location = user?.profile?.location;

  const addressFields: { label: string; value?: string; icon: React.ElementType }[] = [
    { label: 'House / Apartment', value: address?.house, icon: Building2 },
    { label: 'Area / Place', value: address?.place, icon: MapPin },
    { label: 'City', value: address?.city, icon: MapPin },
    { label: 'State', value: address?.state, icon: MapPin },
    { label: 'Pincode', value: address?.pincode, icon: MapPin },
  ].filter(f => f.value);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <SectionCard title="Address">
        {addressFields.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {addressFields.map(f => (
              <InfoRow key={f.label} icon={f.icon} label={f.label} value={f.value} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">No address on file.</p>
        )}
      </SectionCard>

      <SectionCard title="Location Coordinates">
        {location?.coordinates ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoRow icon={MapPin} label="Longitude" value={String(location.coordinates[0])} />
            <InfoRow icon={MapPin} label="Latitude" value={String(location.coordinates[1])} />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">No location data available.</p>
        )}
      </SectionCard>
    </div>
  );
}
