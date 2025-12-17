import Button from '@/components/atoms/Button';
import { ImageUpload } from '@/components/atoms/ImageUpload';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import Select from '@/components/atoms/Select';
import { Textarea } from '@/components/atoms/Textarea';
import PageHeader from '@/components/molecules/PageHeader';
import { useProfile } from '@/features/profile/hooks/useProfile';
import {
  JoinWorkerSchema,
  type JoinWorkerSchemaType,
} from '@/features/user/JoinUs/JoinWorkerFormSchema';
import Header from '@/layouts/user/Header';
import WorkerProfileService from '@/services/worker/workerProfile.service';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateUser } from '@/store/slices/authSlice';
import { handleApiError } from '@/utils/handleApiError';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Briefcase, CheckCircle2, DollarSign, Mail, User2 } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function JoinUsPage() {
  const { user } = useAppSelector(s => s.auth);
  const navigate = useNavigate();
  const { getUserProfilePage } = useProfile();
  const dispatch = useAppDispatch();

  const hasLocation = !!user?.profile?.location?.coordinates;

  if (!user) {
    return null;
  }
  const userId = user._id;
  if (!userId) {
    return null;
  }

  const defaultValues: JoinWorkerSchemaType = {
    displayName: '',
    about: '',
    tagline: '',
    age: 0,
    phone: '',
    defaultRate: {
      type: 'fixed',
      amount: 0,
    },
    document: '',
  };

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<JoinWorkerSchemaType>({
    resolver: zodResolver(JoinWorkerSchema),
    defaultValues: defaultValues,
    reValidateMode: 'onChange',
  });
  useEffect(() => {
    async function loadProfile() {
      const [userInfo] = await Promise.all([getUserProfilePage()]);
      if (userInfo) {
        dispatch(updateUser(userInfo));
      }
    }
    loadProfile();
  }, []);

  async function onSubmit(data: JoinWorkerSchemaType) {
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

    console.log('form data', data);
    try {
      await WorkerProfileService.addWorkerProfile(userId, formData);
      toast.success('successfully uploaded worker profile');
      reset();
    } catch (error) {
      toast.error(handleApiError(error));
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Become a Service Provider"
          description="Join our network of trusted professionals and grow your business"
        />
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-card rounded-2xl shadow-sm p-6 border border-border ">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <User2 className="w-5 h-5 text-indigo-600" />
              Your Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <Input leftIcon={<User2 size={15} />} value={user.name} disabled readOnly />
              </div>
              <div>
                <Label>Email Address</Label>
                <Input leftIcon={<Mail size={15} />} value={user.email} disabled readOnly />
              </div>
            </div>
          </div>
          {/* Address & Location Warning */}
          {!hasLocation && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-yellow-900 mb-1">Complete Your Profile First</h4>
                <p className="text-sm text-yellow-800">
                  {!hasLocation && 'Please add your address '}
                  {!hasLocation && !hasLocation && 'and '}
                  {!hasLocation && 'set your GPS location '}
                  in your profile settings before becoming a service provider.
                </p>
                <button
                  type="button"
                  className="mt-2 text-sm font-medium text-yellow-900 hover:text-yellow-700 underline"
                  onClick={() => navigate('/profile')}
                >
                  Go to Profile Settings →
                </button>
              </div>
            </div>
          )}

          {/* Professional Details */}
          <div className="bg-card  rounded-2xl shadow-sm p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              Professional Details
            </h3>
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Display Name *</Label>
                  <Input
                    placeholder="e.g., John's Plumbing Services"
                    className="px-3"
                    error={errors.displayName?.message}
                    {...register('displayName')}
                  />
                </div>
                <div>
                  <Label>Age *</Label>
                  <Input
                    type="number"
                    placeholder="Enter your age"
                    className="px-3"
                    error={errors.age?.message}
                    {...register('age', { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Professional Tagline *</Label>
                  <Input
                    placeholder="e.g., Expert Plumber with 10+ Years Experience"
                    className="px-3"
                    error={errors.tagline?.message}
                    {...register('tagline')}
                  />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input
                    placeholder="Enter phone number"
                    className="px-3"
                    error={errors.phone?.message}
                    {...register('phone')}
                  />
                </div>
              </div>

              <div>
                <Label>About You *</Label>
                <Textarea
                  placeholder="Tell us about your experience, expertise, and what makes you stand out..."
                  className="min-h-32"
                  error={errors.about?.message}
                  {...register('about')}
                />
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="bg-card rounded-2xl shadow-sm p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-indigo-600" />
              Service Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Id Profe *</Label>
                <Controller
                  name="document"
                  control={control}
                  render={({ field, fieldState }) => (
                    <ImageUpload
                      value={field.value}
                      onChange={file => field.onChange(file)}
                      error={fieldState.error?.message}
                      className="w-full mt-2"
                      isEditable
                    />
                  )}
                />
              </div>
              <div>
                <Label>Service Rate Amount *</Label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  className="px-3"
                  error={errors.defaultRate?.amount?.message}
                  {...register('defaultRate.amount', { valueAsNumber: true })}
                />
                <Label>Rate Type *</Label>
                <Select
                  placeholder="Select Type"
                  value={watch('defaultRate.type')}
                  onChange={v => setValue('defaultRate.type', v as 'hourly' | 'fixed')}
                  error={errors.defaultRate?.type?.message}
                  options={[
                    { label: 'Per Hour', value: 'hourly' },
                    { label: 'Fixed Rate', value: 'fixed' },
                  ]}
                />
              </div>
            </div>
          </div>
          {/* Submit */}
          <div className="bg-card rounded-2xl p-6 border border-indigo-200">
            <div className="flex items-start gap-4 mb-4">
              <CheckCircle2 className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-primary mb-2">Review & Submit</h4>
                <p className="text-sm text-foreground-muted">
                  Once you submit, our team will review your application within 24-48 hours. You'll
                  receive an email notification once your account is verified.
                </p>
              </div>
            </div>

            <Button
              type="submit"
              variant="blue"
              className="w-full"
              loading={isSubmitting}
              disabled={!hasLocation}
            >
              Submit Application
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}

// import BecomeWorkerForm from "@/features/user/JoinUs/components/JoinUs";
// import { useAppSelector } from "@/store/hooks";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import { Textarea } from '@/components/atoms/Textarea';

// //       {/* Main Content */}

// export default function BecomeWorkerPage() {
//   const { user } = useAppSelector(s => s.auth);
//   const navigate = useNavigate();

//   const handleSubmit = async (data: any) => {
//     try {
//       // Call your API to submit the worker application
//       const response = await fetch('/api/worker/apply', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           ...data,
//           userId: user?._id,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to submit application');
//       }

//       toast.success('Application submitted successfully! We will review it within 24-48 hours.');

//       // Redirect to profile or home page
//       navigate('/profile');
//     } catch (error) {
//       console.error('Error submitting application:', error);
//       toast.error('Failed to submit application. Please try again.');
//     }
//   };

//   if (!user) {
//     return null;
//   }

//   return (
//     <BecomeWorkerForm
//       user={{
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         profile: user.profile,
//       }}
//       onSubmit={handleSubmit}
//     />
//   );
// }
