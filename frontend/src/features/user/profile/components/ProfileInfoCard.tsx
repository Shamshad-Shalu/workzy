import type { User } from '@/types/user';

interface ProfileInfoCardProps {
  user: User;
  onEdit?: () => void;
}

export default function ProfileInfoCard({ user, onEdit }: ProfileInfoCardProps) {
  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold">{user.name}</h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <div>
          <button
            type="button"
            onClick={onEdit}
            className="px-3 py-2 bg-primary text-white rounded"
          >
            Edit Profile
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted-foreground">Phone</label>
          <div className="mt-1">{user.phone ?? '—'}</div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground">Role</label>
          <div className="mt-1">{user.role}</div>
        </div>

        {/* Example of nested profile */}
        <div className="col-span-2">
          <label className="text-xs text-muted-foreground">About</label>
          <div className="mt-1">{user.profile?.bio ?? 'No bio'}</div>
        </div>
      </div>
    </div>
  );
}
