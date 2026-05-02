import { motion } from 'framer-motion';
import {
  ArrowUpDown,
  CalendarDays,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  Hourglass,
  Plus,
  Search,
  Sparkles,
  Timer,
  TrendingUp,
  Wallet,
  XCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import Input from '@/components/atoms/Input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export type QuoteStatus = 'pending' | 'accepted' | 'rejected' | 'expired';

export interface AvailableDateMap {
  [dateISO: string]: boolean; // true => bookable
}

export interface QuoteDraftSlot {
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

export interface QuoteBookingContext {
  bookingId: string;
  bookingCode: string;
  user: {
    id: string;
    name: string;
    profileImage?: string;
    phone?: string;
  };
  service: {
    id: string;
    name: string;
    categoryName: string;
    serviceType: 'consultation' | 'inspection' | 'fixed' | 'hourly';
  };
  address: {
    label: string;
    lat: number;
    lng: number;
  };
  initialNote?: string;
  estimatedRange?: { min: number; max: number };
  createdAt: string;
}

export interface DraftQuote {
  selectedDates: string[];
  totalPrice: number;
  message: string;
  reservedUntil?: string;
  status?: QuoteStatus;
}

/** Summarized quote item shown in worker's quote list. */
export interface WorkerQuoteListItem {
  id: string;
  bookingId: string;
  bookingCode: string;
  customer: {
    id: string;
    name: string;
    profileImage?: string;
  };
  service: {
    name: string;
    categoryName: string;
    serviceType: 'consultation' | 'inspection' | 'fixed' | 'hourly';
  };
  totalPrice: number;
  selectedDates: string[];
  message?: string;
  status: QuoteStatus;
  createdAt: string;
  reservedUntil?: string; // for pending quotes
  respondedAt?: string; // when accepted/rejected
}

type StatusFilter = QuoteStatus | 'all';
type SortKey = 'newest' | 'oldest' | 'price_high' | 'price_low';

function formatINR(n: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);
}

const now = Date.now();
const hours = (h: number) => 1000 * 60 * 60 * h;
const days = (d: number) => hours(24 * d);

function futureDates(start: number, count: number): string[] {
  const out: string[] = [];
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  for (let i = 0; i < count; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + start + i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

export const dummyWorkerQuotes: WorkerQuoteListItem[] = [
  {
    id: 'q_1001',
    bookingId: 'bk_8821',
    bookingCode: 'BK-8821',
    customer: {
      id: 'u_1',
      name: 'Aarav Mehta',
      profileImage: 'https://i.pravatar.cc/120?img=12',
    },
    service: {
      name: 'AC Deep Inspection',
      categoryName: 'Appliance Inspection',
      serviceType: 'inspection',
    },
    totalPrice: 3200,
    selectedDates: futureDates(2, 2),
    message: 'Includes gas refill if pressure is below threshold.',
    status: 'pending',
    createdAt: new Date(now - hours(2)).toISOString(),
    reservedUntil: new Date(now + hours(22)).toISOString(),
  },
  {
    id: 'q_1002',
    bookingId: 'bk_8810',
    bookingCode: 'BK-8810',
    customer: {
      id: 'u_2',
      name: 'Priya Nair',
      profileImage: 'https://i.pravatar.cc/120?img=47',
    },
    service: {
      name: 'Bathroom Plumbing Repair',
      categoryName: 'Plumbing',
      serviceType: 'fixed',
    },
    totalPrice: 1800,
    selectedDates: futureDates(1, 1),
    status: 'accepted',
    createdAt: new Date(now - days(1)).toISOString(),
    respondedAt: new Date(now - hours(20)).toISOString(),
  },
  {
    id: 'q_1003',
    bookingId: 'bk_8799',
    bookingCode: 'BK-8799',
    customer: {
      id: 'u_3',
      name: 'Rahul Verma',
      profileImage: 'https://i.pravatar.cc/120?img=15',
    },
    service: {
      name: 'Sofa Deep Cleaning',
      categoryName: 'Home Cleaning',
      serviceType: 'fixed',
    },
    totalPrice: 2400,
    selectedDates: futureDates(4, 1),
    message: '3-seater + 2 single seaters.',
    status: 'rejected',
    createdAt: new Date(now - days(2)).toISOString(),
    respondedAt: new Date(now - days(1) - hours(6)).toISOString(),
  },
  {
    id: 'q_1004',
    bookingId: 'bk_8780',
    bookingCode: 'BK-8780',
    customer: {
      id: 'u_4',
      name: 'Sneha Iyer',
      profileImage: 'https://i.pravatar.cc/120?img=32',
    },
    service: {
      name: 'Electrical Wiring Audit',
      categoryName: 'Electrical',
      serviceType: 'consultation',
    },
    totalPrice: 1200,
    selectedDates: futureDates(0, 1),
    status: 'expired',
    createdAt: new Date(now - days(3)).toISOString(),
  },
  {
    id: 'q_1005',
    bookingId: 'bk_8775',
    bookingCode: 'BK-8775',
    customer: {
      id: 'u_5',
      name: 'Vikram Joshi',
      profileImage: 'https://i.pravatar.cc/120?img=68',
    },
    service: {
      name: 'Full Home Painting',
      categoryName: 'Painting',
      serviceType: 'fixed',
    },
    totalPrice: 28500,
    selectedDates: futureDates(7, 5),
    message: '2 BHK, premium emulsion finish.',
    status: 'pending',
    createdAt: new Date(now - hours(8)).toISOString(),
    reservedUntil: new Date(now + hours(16)).toISOString(),
  },
  {
    id: 'q_1006',
    bookingId: 'bk_8760',
    bookingCode: 'BK-8760',
    customer: {
      id: 'u_6',
      name: 'Megha Pillai',
      profileImage: 'https://i.pravatar.cc/120?img=22',
    },
    service: {
      name: 'Refrigerator Repair',
      categoryName: 'Appliance Repair',
      serviceType: 'fixed',
    },
    totalPrice: 1600,
    selectedDates: futureDates(1, 1),
    status: 'accepted',
    createdAt: new Date(now - days(4)).toISOString(),
    respondedAt: new Date(now - days(3) - hours(12)).toISOString(),
  },
];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) {return 'just now';}
  if (m < 60) {return `${m}m ago`;}
  const h = Math.floor(m / 60);
  if (h < 24) {return `${h}h ago`;}
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function timeUntil(iso: string) {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) {return 'expired';}
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h > 0) {return `${h}h ${m}m left`;}
  return `${m}m left`;
}

const STATUS_META: Record<QuoteStatus, { label: string; icon: React.ElementType; cls: string }> = {
  pending: {
    label: 'Pending',
    icon: Hourglass,
    cls: 'bg-amber-500/10 text-amber-600 border-amber-500/30 dark:text-amber-400',
  },
  accepted: {
    label: 'Accepted',
    icon: CheckCircle2,
    cls: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400',
  },
  rejected: {
    label: 'Rejected',
    icon: XCircle,
    cls: 'bg-rose-500/10 text-rose-600 border-rose-500/30 dark:text-rose-400',
  },
  expired: {
    label: 'Expired',
    icon: Timer,
    cls: 'bg-muted text-muted-foreground border-border',
  },
};

export default function WorkerQuotesListPage() {
  const [status, setStatus] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('newest');
  const [serviceType, _setServiceType] = useState<string>('all');

  const quotes = dummyWorkerQuotes;

  const counts = useMemo(() => {
    const c = { all: quotes.length, pending: 0, accepted: 0, rejected: 0, expired: 0 };
    for (const q of quotes) {c[q.status]++;}
    return c;
  }, [quotes]);

  const stats = useMemo(() => {
    const accepted = quotes.filter(q => q.status === 'accepted');
    const totalEarned = accepted.reduce((s, q) => s + q.totalPrice, 0);
    const responded = quotes.filter(q => q.status !== 'pending').length;
    const acceptRate = responded ? Math.round((accepted.length / responded) * 100) : 0;
    return { totalEarned, acceptRate, sent: quotes.length };
  }, [quotes]);

  const filtered = useMemo(() => {
    let list = quotes.slice();
    if (status !== 'all') {list = list.filter(q => q.status === status);}
    if (serviceType !== 'all') {list = list.filter(q => q.service.serviceType === serviceType);}
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        it =>
          it.bookingCode.toLowerCase().includes(q) ||
          it.customer.name.toLowerCase().includes(q) ||
          it.service.name.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      switch (sort) {
        case 'newest':
          return +new Date(b.createdAt) - +new Date(a.createdAt);
        case 'oldest':
          return +new Date(a.createdAt) - +new Date(b.createdAt);
        case 'price_high':
          return b.totalPrice - a.totalPrice;
        case 'price_low':
          return a.totalPrice - b.totalPrice;
      }
    });
    return list;
  }, [quotes, status, serviceType, search, sort]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Quotes</h1>
          <p className="text-sm text-muted-foreground">Track quotes you've sent to customers.</p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          New Quote
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          icon={<FileText className="h-4 w-4" />}
          label="Quotes sent"
          value={String(stats.sent)}
        />
        <StatCard
          icon={<TrendingUp className="h-4 w-4" />}
          label="Acceptance rate"
          value={`${stats.acceptRate}%`}
          tone="emerald"
        />
        <StatCard
          icon={<Wallet className="h-4 w-4" />}
          label="Earned (accepted)"
          value={formatINR(stats.totalEarned)}
          tone="primary"
        />
      </div>

      {/* Status tabs */}
      <Tabs value={status} onValueChange={v => setStatus(v as StatusFilter)} className="mb-4">
        <TabsList className="h-auto flex-wrap">
          <TabsTrigger value="all" className="gap-1.5">
            All <Pill>{counts.all}</Pill>
          </TabsTrigger>
          <TabsTrigger value="pending" className="gap-1.5">
            Pending <Pill>{counts.pending}</Pill>
          </TabsTrigger>
          <TabsTrigger value="accepted" className="gap-1.5">
            Accepted <Pill>{counts.accepted}</Pill>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="gap-1.5">
            Rejected <Pill>{counts.rejected}</Pill>
          </TabsTrigger>
          <TabsTrigger value="expired" className="gap-1.5">
            Expired <Pill>{counts.expired}</Pill>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by booking, customer, service…"
            className="pl-9"
          />
        </div>
        {/* <Select value={serviceType} onValueChange={setServiceType}>
          <SelectTrigger className="w-[170px]">
            <Filter className="mr-1 h-3.5 w-3.5" />
            <SelectValue placeholder="Service type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="consultation">Consultation</SelectItem>
            <SelectItem value="inspection">Inspection</SelectItem>
            <SelectItem value="fixed">Fixed</SelectItem>
            <SelectItem value="hourly">Hourly</SelectItem>
          </SelectContent>
        </Select> */}
        <Select value={sort} onValueChange={v => setSort(v as SortKey)}>
          <SelectTrigger className="w-[170px]">
            <ArrowUpDown className="mr-1 h-3.5 w-3.5" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
            <SelectItem value="price_high">Price: high → low</SelectItem>
            <SelectItem value="price_low">Price: low → high</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {filtered.map((q, i) => (
            <QuoteRow key={q.id} quote={q} delay={i * 0.03} />
          ))}
        </div>
      )}
    </div>
  );
}

function QuoteRow({ quote, delay }: { quote: WorkerQuoteListItem; delay: number }) {
  const meta = STATUS_META[quote.status];
  const Icon = meta.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="group rounded-xl border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        {/* Left: customer + service */}
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <Avatar className="h-11 w-11">
            <AvatarImage src={quote.customer.profileImage} />
            <AvatarFallback>{quote.customer.name[0]}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium">{quote.customer.name}</p>
              <span className="font-mono text-[11px] text-muted-foreground">
                {quote.bookingCode}
              </span>
              <Badge variant="outline" className={cn('gap-1 text-[10px]', meta.cls)}>
                <Icon className="h-3 w-3" />
                {meta.label}
              </Badge>
            </div>
            <p className="mt-0.5 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Sparkles className="h-3 w-3" />
              {quote.service.name}
              <span className="text-muted-foreground/50">·</span>
              <span className="text-xs">{quote.service.categoryName}</span>
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                {quote.selectedDates.length} day
                {quote.selectedDates.length > 1 ? 's' : ''}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Sent {timeAgo(quote.createdAt)}
              </span>
              {quote.status === 'pending' && quote.reservedUntil && (
                <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                  <Timer className="h-3 w-3" />
                  {timeUntil(quote.reservedUntil)}
                </span>
              )}
            </div>

            {quote.message && (
              <p className="mt-2 line-clamp-1 text-xs text-muted-foreground">"{quote.message}"</p>
            )}
          </div>
        </div>

        {/* Right: price + action */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Quote</div>
            <div className="text-lg font-semibold">{formatINR(quote.totalPrice)}</div>
          </div>
          <Button variant="outline" size="sm">
            <Eye className="h-3.5 w-3.5" />
            View
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone = 'default',
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone?: 'default' | 'primary' | 'emerald';
}) {
  const toneCls =
    tone === 'primary'
      ? 'bg-primary/10 text-primary'
      : tone === 'emerald'
        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
        : 'bg-muted text-muted-foreground';
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center gap-3">
        <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', toneCls)}>
          {icon}
        </div>
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-lg font-semibold leading-tight">{value}</div>
        </div>
      </div>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-muted px-1 text-[10px] font-medium text-muted-foreground">
      {children}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed bg-card/50 p-10 text-center">
      <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
      <p className="mt-3 font-medium">No quotes match these filters</p>
      <p className="text-sm text-muted-foreground">Try adjusting status, search, or sort.</p>
    </div>
  );
}
