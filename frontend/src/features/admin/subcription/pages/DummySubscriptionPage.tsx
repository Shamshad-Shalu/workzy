import { useState } from 'react';

import type { ReactNode } from 'react';

// ─────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────

type Tab = 'plans' | 'subscribers';
type BillingCycle = 'monthly' | 'quarterly' | 'halfYearly' | 'yearly';
type BadgeColor = 'green' | 'red' | 'amber' | 'blue' | 'slate' | 'violet';
type SubStatus = 'active' | 'expired' | 'cancelled';
type FilterKey = 'all' | 'regular' | 'special' | 'inactive';
type SubFilter = 'all' | 'active' | 'expired' | 'cancelled';

interface IPlanPrice {
  monthly: number;
  quarterly?: number;
  halfYearly?: number;
  yearly?: number;
}

interface IPlan {
  id: string;
  name: string;
  description?: string;
  isSpecialOffer: boolean;
  isActive: boolean;
  price: IPlanPrice;
  availableCycles: BillingCycle[];
  validFrom?: string;
  validTill?: string;
  createdAt: string;
}

interface ISubscriptionRecord {
  id: string;
  planName: string;
  billingCycle: BillingCycle;
  amountPaid: number;
  status: SubStatus;
  startDate: string;
  expiryDate: string;
  autoRenew: boolean;
}

interface ISubscriber {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  joinedAt: string;
  currentPlan: string;
  billingCycle: BillingCycle;
  status: SubStatus;
  expiryDate: string;
  autoRenew: boolean;
  amountPaid: number;
  history: ISubscriptionRecord[];
}

interface IFormPrice {
  monthly: string;
  quarterly: string;
  halfYearly: string;
  yearly: string;
}
interface IForm {
  name: string;
  description: string;
  isSpecialOffer: boolean;
  price: IFormPrice;
  validFrom: string;
  validTill: string;
}
type FormErrors = Partial<Record<string, string>>;

// ─────────────────────────────────────────────
//  Constants
// ─────────────────────────────────────────────

const CYCLE_LABELS: Record<BillingCycle, string> = {
  monthly: 'Monthly',
  quarterly: '3 Months',
  halfYearly: '6 Months',
  yearly: 'Yearly',
};

// const BENEFITS = [
//   'Priority in Search Results',
//   'Verified Premium Badge',
//   'Detailed Analytics Dashboard',
//   'Priority Support from Admin',
//   'First Priority for Cancelled Job Reassignment',
//   'Early Access to New Features',
// ];

// ─────────────────────────────────────────────
//  Mock Data
// ─────────────────────────────────────────────

const MOCK_PLANS: IPlan[] = [
  {
    id: '1',
    name: 'Premium',
    description: 'Get more bookings and grow faster',
    isSpecialOffer: false,
    isActive: true,
    price: { monthly: 499, quarterly: 1299, halfYearly: 2499, yearly: 4999 },
    availableCycles: ['monthly', 'quarterly', 'halfYearly', 'yearly'],
    createdAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'New Year 2026 Special',
    description: 'Save 40% on yearly — limited time',
    isSpecialOffer: true,
    isActive: true,
    price: { monthly: 399, yearly: 2999 },
    availableCycles: ['monthly', 'yearly'],
    validFrom: '2026-01-01T00:00:00.000Z',
    validTill: '2026-01-31T23:59:59.000Z',
    createdAt: '2025-12-20T00:00:00.000Z',
  },
  {
    id: '3',
    name: 'Diwali 2025 Special',
    description: 'Celebrate Diwali with exclusive discounts',
    isSpecialOffer: true,
    isActive: false,
    price: { monthly: 349, yearly: 2499 },
    availableCycles: ['monthly', 'yearly'],
    validFrom: '2025-10-01T00:00:00.000Z',
    validTill: '2025-10-20T00:00:00.000Z',
    createdAt: '2025-09-15T00:00:00.000Z',
  },
];

const MOCK_SUBSCRIBERS: ISubscriber[] = [
  {
    id: 'w1',
    name: 'Raju Sharma',
    email: 'raju@example.com',
    phone: '+91 98765 43210',
    avatar: 'RS',
    joinedAt: '2025-03-15',
    currentPlan: 'Premium',
    billingCycle: 'yearly',
    status: 'active',
    expiryDate: '2026-03-15',
    autoRenew: true,
    amountPaid: 4999,
    history: [
      {
        id: 's1',
        planName: 'Premium',
        billingCycle: 'yearly',
        amountPaid: 4999,
        status: 'active',
        startDate: '2025-03-15',
        expiryDate: '2026-03-15',
        autoRenew: true,
      },
      {
        id: 's2',
        planName: 'New Year 2025 Special',
        billingCycle: 'yearly',
        amountPaid: 2999,
        status: 'expired',
        startDate: '2025-01-01',
        expiryDate: '2025-01-31',
        autoRenew: false,
      },
    ],
  },
  {
    id: 'w2',
    name: 'Priya Nair',
    email: 'priya@example.com',
    phone: '+91 87654 32109',
    avatar: 'PN',
    joinedAt: '2025-06-01',
    currentPlan: 'Premium',
    billingCycle: 'monthly',
    status: 'active',
    expiryDate: '2026-02-01',
    autoRenew: true,
    amountPaid: 499,
    history: [
      {
        id: 's3',
        planName: 'Premium',
        billingCycle: 'monthly',
        amountPaid: 499,
        status: 'active',
        startDate: '2026-01-01',
        expiryDate: '2026-02-01',
        autoRenew: true,
      },
      {
        id: 's4',
        planName: 'Premium',
        billingCycle: 'monthly',
        amountPaid: 499,
        status: 'expired',
        startDate: '2025-12-01',
        expiryDate: '2026-01-01',
        autoRenew: true,
      },
    ],
  },
  {
    id: 'w3',
    name: 'Arjun Menon',
    email: 'arjun@example.com',
    phone: '+91 76543 21098',
    avatar: 'AM',
    joinedAt: '2025-08-20',
    currentPlan: 'New Year 2026 Special',
    billingCycle: 'yearly',
    status: 'active',
    expiryDate: '2027-01-15',
    autoRenew: false,
    amountPaid: 2999,
    history: [
      {
        id: 's5',
        planName: 'New Year 2026 Special',
        billingCycle: 'yearly',
        amountPaid: 2999,
        status: 'active',
        startDate: '2026-01-15',
        expiryDate: '2027-01-15',
        autoRenew: false,
      },
    ],
  },
  {
    id: 'w4',
    name: 'Fatima Khan',
    email: 'fatima@example.com',
    phone: '+91 65432 10987',
    avatar: 'FK',
    joinedAt: '2025-04-10',
    currentPlan: 'Premium',
    billingCycle: 'quarterly',
    status: 'expired',
    expiryDate: '2025-12-10',
    autoRenew: false,
    amountPaid: 1299,
    history: [
      {
        id: 's6',
        planName: 'Premium',
        billingCycle: 'quarterly',
        amountPaid: 1299,
        status: 'expired',
        startDate: '2025-09-10',
        expiryDate: '2025-12-10',
        autoRenew: false,
      },
    ],
  },
  {
    id: 'w5',
    name: 'Suresh Kumar',
    email: 'suresh@example.com',
    phone: '+91 54321 09876',
    avatar: 'SK',
    joinedAt: '2025-07-05',
    currentPlan: 'Premium',
    billingCycle: 'monthly',
    status: 'cancelled',
    expiryDate: '2026-01-05',
    autoRenew: false,
    amountPaid: 499,
    history: [
      {
        id: 's7',
        planName: 'Premium',
        billingCycle: 'monthly',
        amountPaid: 499,
        status: 'cancelled',
        startDate: '2025-12-05',
        expiryDate: '2026-01-05',
        autoRenew: false,
      },
    ],
  },
  {
    id: 'w6',
    name: 'Deepa Pillai',
    email: 'deepa@example.com',
    phone: '+91 43210 98765',
    avatar: 'DP',
    joinedAt: '2025-11-12',
    currentPlan: 'Premium',
    billingCycle: 'halfYearly',
    status: 'active',
    expiryDate: '2026-05-12',
    autoRenew: true,
    amountPaid: 2499,
    history: [
      {
        id: 's8',
        planName: 'Premium',
        billingCycle: 'halfYearly',
        amountPaid: 2499,
        status: 'active',
        startDate: '2025-11-12',
        expiryDate: '2026-05-12',
        autoRenew: true,
      },
    ],
  },
];

// ─────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────

const fmt = (iso?: string) =>
  !iso
    ? '—'
    : new Date(iso).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
const isExpired = (v?: string) => !!v && new Date(v) < new Date();
const daysLeft = (v?: string) =>
  !v ? null : Math.max(0, Math.ceil((new Date(v).getTime() - Date.now()) / 86400000));
const avatarColor = (name: string) => {
  const colors = [
    'bg-violet-500',
    'bg-blue-500',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-indigo-500',
  ];
  return colors[name.charCodeAt(0) % colors.length];
};

// ─────────────────────────────────────────────
//  Shared: Badge
// ─────────────────────────────────────────────

function Badge({ children, color }: { children: ReactNode; color: BadgeColor }) {
  const c: Record<BadgeColor, string> = {
    green: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    red: 'bg-red-500/15 text-red-400 border-red-500/25',
    amber: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
    blue: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
    slate: 'bg-slate-500/15 text-slate-400 border-slate-500/25',
    violet: 'bg-violet-500/15 text-violet-400 border-violet-500/25',
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${c[color]}`}
    >
      {children}
    </span>
  );
}

function StatusBadge({ status }: { status: SubStatus }) {
  if (status === 'active') {
    return <Badge color="green">Active</Badge>;
  }
  if (status === 'expired') {
    return <Badge color="slate">Expired</Badge>;
  }
  if (status === 'cancelled') {
    return <Badge color="red">Cancelled</Badge>;
  }
  return null;
}

// ─────────────────────────────────────────────
//  Plan Modal
// ─────────────────────────────────────────────

function PlanModal({
  plan,
  onClose,
  onSave,
}: {
  plan: IPlan | null;
  onClose: () => void;
  onSave: (f: IForm) => void;
}) {
  const isEdit = !!plan?.id;
  const isReg = plan ? !plan.isSpecialOffer : false;

  const [form, setForm] = useState<IForm>({
    name: plan?.name ?? '',
    description: plan?.description ?? '',
    isSpecialOffer: plan?.isSpecialOffer ?? false,
    price: {
      monthly: String(plan?.price?.monthly ?? ''),
      quarterly: String(plan?.price?.quarterly ?? ''),
      halfYearly: String(plan?.price?.halfYearly ?? ''),
      yearly: String(plan?.price?.yearly ?? ''),
    },
    validFrom: plan?.validFrom?.split('T')[0] ?? '',
    validTill: plan?.validTill?.split('T')[0] ?? '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  function setF<K extends keyof IForm>(k: K, v: IForm[K]) {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: undefined }));
  }
  function setP(c: BillingCycle, v: string) {
    setForm(f => ({ ...f, price: { ...f.price, [c]: v } }));
    setErrors(e => ({ ...e, [c]: undefined }));
  }

  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!form.name.trim()) {
      e.name = 'Name is required.';
    }
    if (!form.price.monthly) {
      e.monthly = 'Required.';
    }
    if (!form.isSpecialOffer) {
      if (!form.price.quarterly) {
        e.quarterly = 'Required.';
      }
      if (!form.price.halfYearly) {
        e.halfYearly = 'Required.';
      }
      if (!form.price.yearly) {
        e.yearly = 'Required.';
      }
    }
    if (form.isSpecialOffer) {
      if (!form.validTill) {
        e.validTill = 'Required.';
      }
      if (form.validFrom && form.validTill && form.validFrom >= form.validTill) {
        e.validFrom = 'Must be before valid till.';
      }
      if (form.validTill && new Date(form.validTill) <= new Date()) {
        e.validTill = 'Cannot be in the past.';
      }
    }
    return e;
  }

  function submit() {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    onSave(form);
  }

  const cycles: { key: BillingCycle; label: string; req: boolean }[] = [
    { key: 'monthly', label: 'Monthly', req: true },
    { key: 'quarterly', label: '3 Months', req: !form.isSpecialOffer },
    { key: 'halfYearly', label: '6 Months', req: !form.isSpecialOffer },
    { key: 'yearly', label: 'Yearly', req: !form.isSpecialOffer },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#0d0f14] border border-white/10 rounded-2xl shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-[#0d0f14] border-b border-white/10">
          <div>
            <p className="text-white font-semibold">{isEdit ? 'Edit Plan' : 'New Plan'}</p>
            <p className="text-slate-500 text-xs mt-0.5">
              {isEdit ? 'Update plan details' : 'Create regular or special offer'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-5 space-y-5">
          {!isEdit && (
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { val: false, label: 'Regular Plan', icon: '⭐', desc: 'Always visible' },
                  { val: true, label: 'Special Offer', icon: '🎉', desc: 'Limited time' },
                ] as { val: boolean; label: string; icon: string; desc: string }[]
              ).map(o => (
                <button
                  key={String(o.val)}
                  onClick={() => setF('isSpecialOffer', o.val)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${form.isSpecialOffer === o.val ? 'border-violet-500 bg-violet-500/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
                >
                  <span className="text-lg">{o.icon}</span>
                  <div>
                    <p
                      className={`text-sm font-medium ${form.isSpecialOffer === o.val ? 'text-violet-300' : 'text-white'}`}
                    >
                      {o.label}
                    </p>
                    <p className="text-xs text-slate-500">{o.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">
              Plan Name <span className="text-red-400">*</span>
            </label>
            <input
              value={form.name}
              onChange={e => setF('name', e.target.value)}
              disabled={isEdit && isReg}
              placeholder={form.isSpecialOffer ? 'e.g. Ramadan 2026 Special' : 'Premium'}
              className={`w-full bg-white/5 border rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 text-sm outline-none transition-colors ${errors.name ? 'border-red-500' : 'border-white/10 focus:border-violet-500'} ${isEdit && isReg ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={e => setF('description', e.target.value)}
              rows={2}
              className="w-full bg-white/5 border border-white/10 focus:border-violet-500 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 text-sm outline-none transition-colors resize-none"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-2">
              Pricing (₹){' '}
              {form.isSpecialOffer && (
                <span className="text-slate-600">— must be lower than regular plan</span>
              )}
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {cycles.map(({ key, label, req }) => (
                <div key={key}>
                  <label className="block text-xs text-slate-600 mb-1">
                    {label}{' '}
                    {req ? (
                      <span className="text-red-400">*</span>
                    ) : (
                      <span className="text-slate-700">(opt)</span>
                    )}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={form.price[key]}
                      onChange={e => setP(key, e.target.value)}
                      placeholder="—"
                      className={`w-full bg-white/5 border rounded-lg pl-7 pr-3 py-2 text-white placeholder-slate-600 text-sm outline-none transition-colors ${errors[key] ? 'border-red-500' : 'border-white/10 focus:border-violet-500'}`}
                    />
                  </div>
                  {errors[key] && <p className="text-xs text-red-400 mt-0.5">{errors[key]}</p>}
                </div>
              ))}
            </div>
          </div>
          {form.isSpecialOffer && (
            <div>
              <label className="block text-xs text-slate-400 mb-2">Offer Duration</label>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Valid From</label>
                  <input
                    type="date"
                    value={form.validFrom}
                    onChange={e => setF('validFrom', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-violet-500 rounded-lg px-3 py-2 text-white text-sm outline-none transition-colors"
                  />
                  {errors.validFrom && (
                    <p className="text-xs text-red-400 mt-0.5">{errors.validFrom}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">
                    Valid Till <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.validTill}
                    onChange={e => setF('validTill', e.target.value)}
                    className={`w-full bg-white/5 border rounded-lg px-3 py-2 text-white text-sm outline-none transition-colors ${errors.validTill ? 'border-red-500' : 'border-white/10 focus:border-violet-500'}`}
                  />
                  {errors.validTill && (
                    <p className="text-xs text-red-400 mt-0.5">{errors.validTill}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-xl transition-colors"
          >
            {isEdit ? 'Save Changes' : 'Create Plan'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  Plans Tab
// ─────────────────────────────────────────────

function PlansTab() {
  const [plans, setPlans] = useState<IPlan[]>(MOCK_PLANS);
  const [modal, setModal] = useState<IPlan | 'create' | null>(null);
  const [filter, setFilter] = useState<FilterKey>('all');

  const filtered = plans.filter(p => {
    if (filter === 'regular') {
      return !p.isSpecialOffer;
    }
    if (filter === 'special') {
      return p.isSpecialOffer;
    }
    if (filter === 'inactive') {
      return !p.isActive;
    }
    return true;
  });

  function handleSave(form: IForm) {
    const price: IPlanPrice = {
      monthly: Number(form.price.monthly),
      ...(form.price.quarterly && { quarterly: Number(form.price.quarterly) }),
      ...(form.price.halfYearly && { halfYearly: Number(form.price.halfYearly) }),
      ...(form.price.yearly && { yearly: Number(form.price.yearly) }),
    };
    const cycles: BillingCycle[] = (
      ['monthly', 'quarterly', 'halfYearly', 'yearly'] as BillingCycle[]
    ).filter(k => form.price[k] !== '');
    if (modal && modal !== 'create' && 'id' in modal) {
      setPlans(ps =>
        ps.map(p =>
          p.id === (modal as IPlan).id
            ? {
                ...p,
                name: form.name,
                description: form.description,
                price,
                availableCycles: cycles,
                validFrom: form.validFrom || undefined,
                validTill: form.validTill || undefined,
              }
            : p
        )
      );
    } else {
      setPlans(ps => [
        ...ps,
        {
          id: Date.now().toString(),
          name: form.name,
          description: form.description,
          isSpecialOffer: form.isSpecialOffer,
          isActive: true,
          price,
          availableCycles: cycles,
          validFrom: form.validFrom || undefined,
          validTill: form.validTill || undefined,
          createdAt: new Date().toISOString(),
        },
      ]);
    }
    setModal(null);
  }

  const stats = {
    total: plans.length,
    active: plans.filter(p => p.isActive).length,
    liveOffers: plans.filter(p => p.isSpecialOffer && p.isActive && !isExpired(p.validTill)).length,
  };

  return (
    <div className="space-y-5">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {(
          [
            { l: 'Total Plans', v: stats.total, c: 'text-white' },
            { l: 'Active', v: stats.active, c: 'text-emerald-400' },
            { l: 'Live Offers', v: stats.liveOffers, c: 'text-amber-400' },
          ] as { l: string; v: number; c: string }[]
        ).map(s => (
          <div key={s.l} className="bg-white/[0.03] border border-white/8 rounded-xl p-4">
            <p className="text-slate-500 text-xs mb-1">{s.l}</p>
            <p className={`text-2xl font-bold ${s.c}`}>{s.v}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
          {(['all', 'regular', 'special', 'inactive'] as FilterKey[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${filter === f ? 'bg-white/15 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {f === 'all'
                ? 'All Plans'
                : f === 'regular'
                  ? 'Regular'
                  : f === 'special'
                    ? 'Special Offers'
                    : 'Inactive'}
            </button>
          ))}
        </div>
        <button
          onClick={() => setModal('create')}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-xl transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Plan
        </button>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-600">
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-3">
            <svg
              className="w-6 h-6 opacity-40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-sm">No plans found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(plan => {
            const exp = isExpired(plan.validTill);
            const left = daysLeft(plan.validTill);
            return (
              <div
                key={plan.id}
                className={`group relative bg-white/[0.02] border rounded-2xl p-5 transition-all hover:bg-white/[0.04] ${plan.isSpecialOffer ? 'border-amber-500/25 hover:border-amber-500/40' : 'border-white/8 hover:border-white/15'} ${!plan.isActive ? 'opacity-55' : ''}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm">{plan.isSpecialOffer ? '🎉' : '⭐'}</span>
                    <p className="text-white font-semibold text-sm">{plan.name}</p>
                    {plan.isSpecialOffer ? (
                      <Badge color={exp ? 'slate' : plan.isActive ? 'amber' : 'slate'}>
                        {exp ? 'Expired' : plan.isActive ? 'Live Offer' : 'Inactive'}
                      </Badge>
                    ) : (
                      <Badge color="blue">Regular</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setModal(plan)}
                      className="p-1.5 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                    {plan.isSpecialOffer && (
                      <button
                        onClick={() =>
                          setPlans(ps =>
                            ps.map(p => (p.id === plan.id ? { ...p, isActive: !p.isActive } : p))
                          )
                        }
                        className={`p-1.5 rounded-lg transition-colors ${plan.isActive ? 'text-red-400 hover:bg-red-500/10' : 'text-emerald-400 hover:bg-emerald-500/10'}`}
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={
                              plan.isActive
                                ? 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636'
                                : 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                            }
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                {plan.description && (
                  <p className="text-slate-500 text-xs mb-4 leading-relaxed">{plan.description}</p>
                )}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {plan.availableCycles.map(c => (
                    <div key={c} className="bg-white/5 rounded-lg px-3 py-2">
                      <p className="text-slate-500 text-xs">{CYCLE_LABELS[c]}</p>
                      <p className="text-white font-bold text-sm mt-0.5">
                        ₹{(plan.price[c] ?? 0).toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                </div>
                {plan.isSpecialOffer && (
                  <div className="flex items-center justify-between pt-3 border-t border-white/8 text-xs">
                    <span className="text-slate-500">
                      {fmt(plan.validFrom)} — {fmt(plan.validTill)}
                    </span>
                    {!exp && plan.isActive && left !== null && (
                      <span
                        className={`font-semibold ${left <= 3 ? 'text-red-400' : left <= 7 ? 'text-amber-400' : 'text-slate-400'}`}
                      >
                        {left === 0 ? 'Ends today' : `${left}d left`}
                      </span>
                    )}
                    {exp && <span className="text-slate-600">Ended</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {modal !== null && (
        <PlanModal
          plan={modal === 'create' ? null : (modal as IPlan)}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
//  Subscriber Drawer
// ─────────────────────────────────────────────

function SubscriberDrawer({ worker, onClose }: { worker: ISubscriber; onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-[#0d0f14] border-l border-white/10 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl ${avatarColor(worker.name)} flex items-center justify-center text-white text-sm font-bold`}
            >
              {worker.avatar}
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{worker.name}</p>
              <p className="text-slate-500 text-xs">{worker.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Current subscription */}
        <div className="px-5 py-4 border-b border-white/10">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">
            Current Subscription
          </p>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Plan</span>
              <span className="text-white text-sm font-medium">{worker.currentPlan}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Billing</span>
              <span className="text-white text-sm">{CYCLE_LABELS[worker.billingCycle]}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Status</span>
              <StatusBadge status={worker.status} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Expires</span>
              <span className="text-white text-sm">{fmt(worker.expiryDate)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Auto Renew</span>
              <span
                className={`text-sm font-medium ${worker.autoRenew ? 'text-emerald-400' : 'text-slate-500'}`}
              >
                {worker.autoRenew ? 'On' : 'Off'}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/8">
              <span className="text-slate-400 text-sm">Amount Paid</span>
              <span className="text-white text-sm font-bold">
                ₹{worker.amountPaid.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* History */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">
            Subscription History
          </p>
          <div className="space-y-3">
            {worker.history.map((h, i) => (
              <div key={h.id} className="relative pl-6">
                {i < worker.history.length - 1 && (
                  <div className="absolute left-2 top-5 bottom-0 w-px bg-white/8" />
                )}
                <div className="absolute left-0 top-2 w-4 h-4 rounded-full border-2 border-white/20 bg-[#0d0f14] flex items-center justify-center">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${h.status === 'active' ? 'bg-emerald-400' : h.status === 'cancelled' ? 'bg-red-400' : 'bg-slate-500'}`}
                  />
                </div>
                <div className="bg-white/[0.03] border border-white/8 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white text-sm font-medium">{h.planName}</p>
                    <StatusBadge status={h.status} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{CYCLE_LABELS[h.billingCycle]}</span>
                    <span className="font-semibold text-slate-400">
                      ₹{h.amountPaid.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1.5">
                    {fmt(h.startDate)} → {fmt(h.expiryDate)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Admin Actions</p>
          <div className="grid grid-cols-2 gap-2">
            <button className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-medium rounded-xl transition-colors">
              Extend Expiry
            </button>
            <button className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-400 text-xs font-medium rounded-xl transition-colors">
              Cancel Sub
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
//  Subscribers Tab
// ─────────────────────────────────────────────

function SubscribersTab() {
  const [selected, setSelected] = useState<ISubscriber | null>(null);
  const [filter, setFilter] = useState<SubFilter>('all');
  const [search, setSearch] = useState('');

  const filtered = MOCK_SUBSCRIBERS.filter(w => {
    const matchStatus = filter === 'all' || w.status === filter;
    const matchSearch =
      !search ||
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.email.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const stats = {
    active: MOCK_SUBSCRIBERS.filter(w => w.status === 'active').length,
    expired: MOCK_SUBSCRIBERS.filter(w => w.status === 'expired').length,
    cancelled: MOCK_SUBSCRIBERS.filter(w => w.status === 'cancelled').length,
    revenue: MOCK_SUBSCRIBERS.filter(w => w.status === 'active').reduce(
      (a, w) => a + w.amountPaid,
      0
    ),
  };

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {(
          [
            { l: 'Active', v: stats.active, c: 'text-emerald-400' },
            { l: 'Expired', v: stats.expired, c: 'text-slate-400' },
            { l: 'Cancelled', v: stats.cancelled, c: 'text-red-400' },
            {
              l: 'Monthly Revenue',
              v: `₹${stats.revenue.toLocaleString('en-IN')}`,
              c: 'text-violet-400',
            },
          ] as { l: string; v: string | number; c: string }[]
        ).map(s => (
          <div key={s.l} className="bg-white/[0.03] border border-white/8 rounded-xl p-4">
            <p className="text-slate-500 text-xs mb-1">{s.l}</p>
            <p className={`text-xl font-bold ${s.c}`}>{s.v}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
          {(['all', 'active', 'expired', 'cancelled'] as SubFilter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${filter === f ? 'bg-white/15 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search workers..."
            className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-white placeholder-slate-600 text-sm outline-none focus:border-violet-500 transition-colors w-56"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/[0.02] border border-white/8 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/8">
              <th className="text-left text-xs text-slate-500 font-medium px-5 py-3">Worker</th>
              <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">Plan</th>
              <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">Billing</th>
              <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">Status</th>
              <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">Expires</th>
              <th className="text-left text-xs text-slate-500 font-medium px-4 py-3">Paid</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-600 text-sm">
                  No subscribers found
                </td>
              </tr>
            ) : (
              filtered.map((w, i) => {
                const exp = isExpired(w.expiryDate);
                const left = daysLeft(w.expiryDate);
                return (
                  <tr
                    key={w.id}
                    className={`border-b border-white/5 hover:bg-white/[0.03] cursor-pointer transition-colors ${i === filtered.length - 1 ? 'border-transparent' : ''}`}
                    onClick={() => setSelected(w)}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg ${avatarColor(w.name)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                        >
                          {w.avatar}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium leading-tight">{w.name}</p>
                          <p className="text-slate-500 text-xs">{w.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-white text-sm">{w.currentPlan}</p>
                      {w.autoRenew && <p className="text-emerald-500 text-xs">Auto-renew on</p>}
                    </td>
                    <td className="px-4 py-3.5 text-slate-400 text-sm">
                      {CYCLE_LABELS[w.billingCycle]}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={w.status} />
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-slate-400 text-sm">{fmt(w.expiryDate)}</p>
                      {w.status === 'active' && !exp && left !== null && left <= 7 && (
                        <p className={`text-xs ${left <= 3 ? 'text-red-400' : 'text-amber-400'}`}>
                          {left === 0 ? 'Today' : `${left}d left`}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-white text-sm font-medium">
                      ₹{w.amountPaid.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3.5">
                      <svg
                        className="w-4 h-4 text-slate-600 group-hover:text-slate-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {selected && <SubscriberDrawer worker={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

// ─────────────────────────────────────────────
//  Main: SubscriptionPage
// ─────────────────────────────────────────────

export default function SubscriptionPage() {
  const [tab, setTab] = useState<Tab>('plans');

  const tabs: { key: Tab; label: string; icon: ReactNode }[] = [
    {
      key: 'plans',
      label: 'Plans',
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      key: 'subscribers',
      label: 'Subscribers',
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#080a0e] text-white p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Page header */}
        <div className="mb-7">
          <div className="flex items-center gap-2 text-slate-600 text-xs mb-3">
            <span>Admin</span>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-slate-400">Subscription</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Subscription Management
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">
                Manage plans, special offers and subscriber overview
              </p>
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-1 border-b border-white/10 mb-6">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${tab === t.key ? 'border-violet-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'plans' && <PlansTab />}
        {tab === 'subscribers' && <SubscribersTab />}
      </div>
    </div>
  );
}
