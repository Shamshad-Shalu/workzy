import { AlertCircle, ArrowRight, PawPrint, Settings, Smartphone } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import Button from '@/components/atoms/Button';
import { ImageUpload } from '@/components/molecules/ImageUpload';
import { FAQ_ITEMS, FEATURE_CARDS, PROCESS_STEPS, STATS_CARDS } from '@/constants/landingItems';
import { UploadPurposes } from '@/constants/upload';
import CTASection from '@/features/user/home/components/CTASection';
import BecomeWorkerForm from '@/features/user/JoinUs/components/BecomeWorkerForm';
import {
  AnimatedCounter,
  FAQItem,
  FeatureCard,
  MetricCard,
  ProcessStep,
} from '@/features/user/JoinUs/components/Sections';
import { useWorkerJoin } from '@/features/user/JoinUs/hooks/useWorkerJoin';
import type { JoinWorkerSchemaType } from '@/features/user/JoinUs/validation/JoinWorkerFormSchema';
import { cn } from '@/lib/utils';
import { useAppDispatch } from '@/store/hooks';
import { updateUser } from '@/store/slices/authSlice';
import type { IDocument, WorkerStatus } from '@/types/worker';
import { handleApiError } from '@/utils/handleApiError';

import userImg from '../assets/auth/signup.jpg';
import teamImg from '../assets/auth/signup.jpg';

export default function JoinUsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const applyNowRef = useRef<HTMLElement | null>(null);
  const { worker, user, joinWorker, resubmitWorker } = useWorkerJoin();

  const [loading, setLoading] = useState<boolean>(false);
  const [resubmitted, setResubmitted] = useState<boolean>(false);
  const [existingDoc, setExistingDoc] = useState<IDocument | null>(null);
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [documentValue, setDocumentValue] = useState<string>(existingDoc?.url || '');

  const workerStatus: WorkerStatus | null = worker?.status ?? null;
  const workerId = worker?.id ?? null;
  const hasLocation = !!user?.profile?.location?.coordinates;
  const hasPhoneNumber = !!user?.phone;
  const isPending = workerStatus === 'pending';
  const needsRevision = workerStatus === 'needs_revision';
  const isVerified = workerStatus === 'verified';

  useEffect(() => {
    if (user) {
      dispatch(updateUser(user));
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (!needsRevision) {
      return;
    }

    const doc = worker?.documents?.[0];
    if (doc) {
      setExistingDoc(doc);
      setDocumentValue(doc.url);
    }
  }, [needsRevision, worker]);

  async function onSubmit(data: JoinWorkerSchemaType) {
    if (!user?.id) {
      return;
    }
    if (isPending) {
      toast.info('Your application is already pending review.');
      return;
    }
    try {
      const res = await joinWorker.mutateAsync({ userId: user.id, data });
      toast.success(res?.message);
      navigate('/');
    } catch (error) {
      toast.error(handleApiError(error));
    }
  }
  async function reSubmitForm() {
    if (!existingDoc || !documentValue || !workerId) {
      toast.error('Please upload the document');
      return;
    }
    setLoading(true);
    try {
      const { message } = await resubmitWorker.mutateAsync({
        workerId,
        data: { id: existingDoc.id, WorkerStatus: 'pending', url: documentValue },
      });
      toast.success(message);
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setLoading(false);
    }
  }

  const openFormAndScroll = () => {
    if (!user) {
      navigate('/login');
    }
    setFormOpen(true);

    requestAnimationFrame(() => {
      applyNowRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  return (
    <main>
      <section className="relative bg-gradient-to-br from-[oklch(89.1% 0.01315 266.734)] to-[oklch(89.1% 0.01315 266.734)] dark:bg-[oklch(21.48%_0.03444_254.607)] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-golden animate-pulse"></div>
          <div
            className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-golden/50 animate-pulse"
            style={{ animationDelay: '1s', animationDuration: '4s' }}
          ></div>
          <div
            className="absolute top-1/2 right-1/3 w-48 h-48 rounded-full bg-golden/30 animate-pulse"
            style={{ animationDelay: '2s', animationDuration: '5s' }}
          ></div>
        </div>

        <div className="section-container py-20 relative z-10 ">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col space-y-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-golden/20 text-golden text-sm font-medium mb-2 self-start">
                <PawPrint className="h-4 w-4 mr-2" />
                <span>Trusted by 2,000+ Service Professionals</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                Grow Your Service Business with <span className="text-golden">Workzy</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Join thousands of service providers expanding their reach and transforming their
                business with our all-in-one platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {!isVerified && (
                  <Button
                    size="lg"
                    onClick={openFormAndScroll}
                    className="bg-golden hover:bg-golden/90 text-section-dark px-8 py-6 text-lg rounded-full shadow-lg transform transition-transform duration-300 hover:translate-y-[-2px]"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>

            <div className="relative hidden md:block">
              <div className="absolute -top-6 -left-6 w-full h-full rounded-2xl border border-golden/30 animate-pulse"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl transform transition-transform duration-500 hover:scale-[1.02]">
                <img
                  src={teamImg}
                  alt="Service professional using Workzy"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-section-dark to-transparent opacity-20"></div>
              </div>
              <div className="absolute -bottom-8 -right-8">
                <MetricCard value="+65%" label="Average Revenue Growth" />
              </div>
              <div className="absolute top-[-30px] right-[30px]">
                <MetricCard value="2.3x" label="Client Base Expansion" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-card border-y border-border overflow-hidden">
        <div className="section-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-4 text-center">
            {STATS_CARDS.map((stat, i) => (
              <div key={i} className="flex flex-col items-center p-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                <p className="mt-2 text-base sm:text-lg font-medium text-muted-foreground">
                  {stat.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {formOpen && (
        <>
          {/* Application Form Section */}
          <section id="apply-now" ref={applyNowRef} className="py-20 px-4 bg-muted/30">
            <div className="container mx-auto max-w-6xl">
              {workerStatus === 'rejected' && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 text-center mb-8">
                  <h4 className="font-semibold text-primary text-lg mb-2">
                    Application Rejected By Admin
                  </h4>
                  <div className="text-primary/80">
                    Please contact <a className="text-underline">www.workzy.service.com</a>
                  </div>
                </div>
              )}

              {/* Status Alerts */}
              {needsRevision && existingDoc && (
                <div
                  className={cn(
                    'rounded-xl p-6 mb-8',
                    resubmitted
                      ? 'bg-blue/10 border border-blue/20'
                      : 'bg-destructive/10 border border-destructive/20'
                  )}
                >
                  <h4 className="font-semibold text-lg mb-2">Action Required</h4>
                  {existingDoc.rejectReason && (
                    <p className="text-sm mb-4 text-destructive">
                      Admin note: {existingDoc.rejectReason}
                    </p>
                  )}
                  <ImageUpload
                    value={documentValue}
                    purpose={UploadPurposes.WORKER_DOCUMENT}
                    className="w-full"
                    onChange={url => {
                      setDocumentValue(url);
                      setResubmitted(true);
                    }}
                  />
                  <Button
                    fullWidth
                    size="lg"
                    variant="blue"
                    onClick={reSubmitForm}
                    loading={loading}
                    disabled={!resubmitted}
                  >
                    Resubmit Document
                  </Button>
                </div>
              )}

              {isPending && (
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6 text-center mb-8">
                  <h4 className="font-semibold text-primary text-lg mb-2">
                    Application Under Review
                  </h4>
                  <p className="text-primary/80">
                    Your application is currently being reviewed by our team. You will be notified
                    once the status changes.
                  </p>
                </div>
              )}

              {/* Profile Completion Warning */}
              {(!hasLocation || !hasPhoneNumber) && (isPending || workerStatus === null) && (
                <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 mb-8">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                        Complete Your Profile First
                      </h4>
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        {!hasLocation && 'Please add your address and set your GPS location'}
                        {!hasLocation && !hasPhoneNumber && ' and '}
                        {!hasPhoneNumber && 'add your phone number'}
                        {' in your profile settings before becoming a service provider.'}
                      </p>
                      <button
                        type="button"
                        className="mt-3 text-sm font-medium text-yellow-900 dark:text-yellow-100 hover:text-yellow-700 dark:hover:text-yellow-300 underline cursor-pointer"
                        onClick={() => navigate('/profile')}
                      >
                        Go to Profile Settings →
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {/* Application Form */}
              {!['pending', 'needs_revision', 'rejected', 'verified'].includes(
                workerStatus ?? ''
              ) && (
                <BecomeWorkerForm onSubmit={onSubmit} disabled={!hasLocation || !hasPhoneNumber} />
              )}
            </div>
          </section>
        </>
      )}

      {/* Why Join Us Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-golden/10 text-[var(--golden-dark)] rounded-full text-sm font-medium mb-4">
              WHY CHOOSE US
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Service Professionals Choose Workzy
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Partner with Workzy and transform how you manage your service business with our
              comprehensive platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {FEATURE_CARDS &&
              FEATURE_CARDS.map((val, i) => (
                <FeatureCard
                  key={i}
                  icon={val.icon}
                  title={val.title}
                  description={val.description}
                />
              ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-golden/10 text-[var(--golden-dark)] rounded-full text-sm font-medium mb-4">
                HOW IT WORKS
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Simple Process to Start Growing Your Business
              </h2>
              <p className="text-muted-foreground mb-10">
                Getting started with Workzy is easy. Follow these simple steps to begin expanding
                your service business today.
              </p>

              <div className="space-y-2">
                {PROCESS_STEPS &&
                  PROCESS_STEPS.map((val, i) => (
                    <ProcessStep
                      key={i}
                      title={val.title}
                      description={val.description}
                      number={i + 1}
                      isLast={i === PROCESS_STEPS.length - 1}
                    />
                  ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <img src={userImg} alt="Workzy app demonstration" className="w-full h-auto" />
              </div>
              <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 bg-golden rounded-full p-6 shadow-xl">
                <Smartphone className="h-8 w-8 text-[var(--golden-dark)]" />
              </div>
              <div className="absolute bottom-1/4 right-0 transform translate-x-1/3 bg-card rounded-full p-5 shadow-xl border">
                <Settings className="h-7 w-7 text-golden" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-golden/10 text-[var(--golden-dark)] rounded-full text-sm font-medium mb-4">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about becoming a Workzy service provider
            </p>
          </div>

          <div className="space-y-1">
            {FAQ_ITEMS?.length > 0 &&
              FAQ_ITEMS.map((val, i) => (
                <FAQItem key={i} question={val.question} answer={val.answer} />
              ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <CTASection isVerified={workerStatus === 'verified'} onBecomeProvider={openFormAndScroll} />
    </main>
  );
}
