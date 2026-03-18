import { CheckCircle2, AlertCircle, Loader2, ExternalLink } from 'lucide-react';

import PageHeader from '@/components/molecules/PageHeader';

import { useStripeConnect } from '../hooks/useStripConnect';

export default function AccountPage() {
  const { stripeAccountId, isConnected, isPending, isConnecting, connectStripe } = useStripeConnect();
  return (
    <main className="max-w-lg flex flex-col gap-6 py-6">
      <PageHeader title="Payout Settings" description="Manage how you receive earnings" />
      <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm">Stripe Account</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Required to receive booking payments
            </p>
          </div>
          {isConnected ? (
            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3 h-3" /> Active
            </span>
          ) : isPending && stripeAccountId ? (
            <span className="flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
              <Loader2 className="w-3 h-3 animate-spin" /> Pending
            </span>
          ) : (
            <span className="text-xs font-medium text-muted-foreground bg-muted border border-border px-2.5 py-1 rounded-full">
              Not connected
            </span>
          )}
        </div>

        {isConnected && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 bg-muted/40 rounded-xl p-3">
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium">Connected</p>
                <p className="text-[11px] text-muted-foreground font-mono truncate">
                  {stripeAccountId}
                </p>
              </div>
            </div>

            <div className="border border-border rounded-xl divide-y divide-border">
              {[
                { label: 'Payouts', value: 'Enabled', green: true },
                { label: 'Account type', value: 'Express' },
                { label: 'Payout schedule', value: 'After job completion' },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-xs text-muted-foreground">{r.label}</span>
                  <span className={`text-xs font-medium ${r.green ? 'text-emerald-600' : ''}`}>
                    {r.value}
                  </span>
                </div>
              ))}
            </div>

            <a
              href="https://dashboard.stripe.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-border text-xs font-medium hover:bg-muted transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Update bank details on Stripe
            </a>
          </div>
        )}

        {isPending && !isConnected && (
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3.5">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-700 leading-relaxed">
                Your Stripe account is under review. This usually takes a few minutes. If
                verification is incomplete, click below to continue.
              </p>
            </div>
            <button
              onClick={() => connectStripe()}
              disabled={isConnecting}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-50 transition-opacity"
              style={{ background: '#635BFF' }}
            >
              {isConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <StripeLogo />}
              Continue Stripe setup
            </button>
          </div>
        )}

        {!isConnected && !isPending && (
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3.5">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-700 leading-relaxed">
                Connect Stripe to start accepting bookings and receiving payments.
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              {[
                { n: 1, label: 'Create or link Stripe account' },
                { n: 2, label: 'Complete identity verification' },
                { n: 3, label: 'Add your bank account' },
              ].map(s => (
                <div key={s.n} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border border-border flex items-center justify-center text-[10px] font-medium text-muted-foreground flex-shrink-0">
                    {s.n}
                  </div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => connectStripe()}
              disabled={isConnecting}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-50 transition-opacity"
              style={{ background: '#635BFF' }}
            >
              {isConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <StripeLogo />}
              {isConnecting ? 'Redirecting...' : 'Connect with Stripe'}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

function StripeLogo() {
  return (
    <svg width="13" height="13" viewBox="0 0 32 32" fill="none">
      <path
        d="M13.6 12.8c0-.9.7-1.2 1.9-1.2 1.7 0 3.8.5 5.5 1.4V8.5c-1.8-.7-3.7-1-5.5-1C12 7.5 9 9 9 12.9c0 6 8.3 5 8.3 7.6 0 1-.9 1.4-2.2 1.4-1.9 0-4.3-.8-6.1-1.9v4.6c2 .9 4.1 1.4 6.1 1.4 4.6 0 7.8-2.3 7.8-6.3C23 13.4 13.6 14.6 13.6 12.8z"
        fill="white"
      />
    </svg>
  );
}
