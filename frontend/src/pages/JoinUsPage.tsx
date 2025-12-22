import Button from '@/components/atoms/Button';
import { ImageUpload } from '@/components/atoms/ImageUpload';
import { useProfile } from '@/features/profile/hooks/useProfile';
import BecomeWorkerForm from '@/features/user/JoinUs/components/BecomeWorkerForm';
import { type JoinWorkerSchemaType } from '@/features/user/JoinUs/validation/JoinWorkerFormSchema';
import Header from '@/layouts/user/Header';
import WorkerProfileService from '@/services/worker/workerProfile.service';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateUser } from '@/store/slices/authSlice';
import { handleApiError } from '@/utils/handleApiError';
import userImg from '../assets/auth/signup.jpg';
import teamImg from '../assets/auth/signup.jpg';
import { AlertCircle, ArrowRight, PawPrint, Settings, Smartphone, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { FAQ_ITEMS, FEATURE_CARDS, PROCESS_STEPS } from '@/constants/landingItems';
import { type IDocument, type WorkerStatus } from '@/types/worker';
import {
  AnimatedCounter,
  FAQItem,
  FeatureCard,
  MetricCard,
  ProcessStep,
} from '@/features/user/JoinUs/components/Sections';

export default function JoinUsPage() {
  const { user } = useAppSelector((s: any) => s.auth);
  const navigate = useNavigate();
  const { getUserProfilePage } = useProfile();
  const dispatch = useAppDispatch();

  const hasLocation = !!user?.profile?.location?.coordinates;
  const hasPhoneNumber = !!user?.phone;

  if (!user) {
    return null;
  }
  const userId = user._id;
  if (!userId) {
    return null;
  }

  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [workerStatus, setWorkerStatus] = useState<WorkerStatus | null>(null);
  const [workerId, setWorkerId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [existingDoc, setExistingDoc] = useState<IDocument | null>(null);
  const [documentValue, setDocumentValue] = useState<string | File | null>(
    existingDoc?.url ?? null
  );

  useEffect(() => {
    async function loadData() {
      try {
        const [userInfo, workerInfo] = await Promise.all([
          getUserProfilePage(),
          WorkerProfileService.getMe(),
        ]);
        if (userInfo) {
          dispatch(updateUser(userInfo));
        }
        if (workerInfo) {
          setWorkerId(workerInfo._id);
          setWorkerStatus(workerInfo.status);
          if (workerInfo.status === 'needs_revision') {
            const doc = workerInfo.documents?.[0];
            if (doc) {
              setExistingDoc(doc);
              setDocumentValue(doc.url);
            }
          } else if (workerInfo.status === 'pending') {
            setWorkerStatus('pending');
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
    loadData();
  }, []);

  async function onSubmit(data: JoinWorkerSchemaType) {
    if (workerStatus === 'pending') {
      toast.info('Your application is already pending review.');
      return;
    }
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'document') {
        if (value instanceof File) {
          formData.append('document', value);
        }
        return;
      } else {
        formData.append(key, JSON.stringify(value));
      }
    });

    try {
      const res = await WorkerProfileService.addWorkerProfile(userId, formData);
      toast.success(res?.message);
      navigate('/');
    } catch (error) {
      toast.error(handleApiError(error));
    }
  }

  async function reSubmitForm() {
    const formData = new FormData();

    if (documentValue instanceof File) {
      formData.append('document', documentValue);
    } else {
      toast.error('Document image is required!.');
      return;
    }
    if (existingDoc) {
      formData.append('id', existingDoc._id);
    }
    formData.append('WorkerStatus', 'pending');
    if (!workerId) return;
    setLoading(true);
    try {
      const res = await WorkerProfileService.reSubmitWorkerInfo(workerId, formData);
      setWorkerStatus('pending');
      toast.success(res.message);
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="relative bg-gradient-to-br from-[var(--golden-dark)] to-[var(--golden-dark)]/80 text-white overflow-hidden">
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

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col space-y-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-golden/20 text-golden text-sm font-medium mb-2 self-start">
                <PawPrint className="h-4 w-4 mr-2" />
                <span>Trusted by 2,000+ Service Professionals</span>
              </div>
              <h1 className="text-primary text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                Grow Your Service Business with <span className="text-golden">Workzy</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Join thousands of service providers expanding their reach and transforming their
                business with our all-in-one platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  onClick={() => {
                    setShowApplicationForm(true);
                    document.getElementById('apply-now')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-golden hover:bg-golden/90 text-section-dark px-8 py-6 text-lg rounded-full shadow-lg transform transition-transform duration-300 hover:translate-y-[-2px]"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
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
      <section className="py-16 bg-card border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <AnimatedCounter value="2000" suffix="+" />
              <p className="mt-2 text-lg font-medium text-muted-foreground">Service Providers</p>
            </div>
            <div className="p-6">
              <AnimatedCounter value="50000" suffix="+" />
              <p className="mt-2 text-lg font-medium text-muted-foreground">Customers</p>
            </div>
            <div className="p-6">
              <AnimatedCounter value="98" suffix="%" />
              <p className="mt-2 text-lg font-medium text-muted-foreground">Satisfaction Rate</p>
            </div>
            <div className="p-6">
              <AnimatedCounter value="500000" prefix="$" suffix="+" />
              <p className="mt-2 text-lg font-medium text-muted-foreground">Revenue Generated</p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      {showApplicationForm && workerStatus !== 'verified' && (
        <section id="apply-now" className="py-20 px-4 bg-muted/30">
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

            {workerStatus !== 'rejected' && workerStatus !== 'pending' && (
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Start Your Application
                </h2>
                <p className="text-muted-foreground">
                  Join our platform and grow your business today
                </p>
              </div>
            )}
            {/* Status Alerts */}
            {workerStatus === 'needs_revision' && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 mb-8">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-destructive mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-destructive mb-2 text-lg">
                      Action Required: Revise Application
                    </h4>
                    <p className="text-sm text-destructive/80 mb-3">
                      Your previous application requires changes. Please address the note below and
                      re-upload your document.
                    </p>
                    {existingDoc?.rejectReason && (
                      <div className="mt-3 p-4 bg-card rounded-lg border border-destructive/10">
                        <span className="font-semibold text-xs uppercase tracking-wider text-destructive/70 block mb-2">
                          Admin Note:
                        </span>
                        <p className="text-sm text-destructive font-medium">
                          {existingDoc.rejectReason}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {existingDoc && (
                  <div className="mt-4 pl-9 grid grid-cols-2 ">
                    <div>
                      <ImageUpload
                        value={documentValue}
                        isEditable={true}
                        className="w-full"
                        onChange={file => {
                          setDocumentValue(file || '');
                        }}
                      />
                      <Button
                        fullWidth
                        size="lg"
                        variant="blue"
                        onClick={reSubmitForm}
                        loading={loading}
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {workerStatus === 'pending' && (
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
            {(!hasLocation || !hasPhoneNumber) && workerStatus !== 'pending' && (
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
            {!['pending', 'needs_revision', 'rejected'].includes(workerStatus ?? '') && (
              <BecomeWorkerForm onSubmit={onSubmit} disabled={!hasLocation || !hasPhoneNumber} />
            )}
          </div>
        </section>
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
      <section className="py-20 px-4 bg-section-dark text-white">
        <div className="container mx-auto max-w-5xl">
          <div className="relative text-center">
            <span className="inline-block px-4 py-1.5 bg-golden/20 text-golden rounded-full text-sm font-medium mb-4">
              GET STARTED TODAY
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Service Business?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Join our community of professional service providers and start expanding your client
              base today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                onClick={() => {
                  setShowApplicationForm(true);
                  document.getElementById('apply-now')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-golden hover:bg-golden/90 text-section-dark px-10 py-6 text-lg rounded-full"
              >
                Become a Service Provider
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300">4.9/5 provider satisfaction</p>
              </div>
            </div>
            <p className="mt-8 text-sm text-gray-400">
              No contracts. No setup fees. Start growing your business today.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
