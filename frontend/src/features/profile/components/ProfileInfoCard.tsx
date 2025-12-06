import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import Select from '@/components/atoms/Select';
import { Separator } from '@/components/ui/separator';
import { INDIAN_STATES } from '@/constants';
import type { User } from '@/types/user';
import { Check, MapPin, Pencil, Phone, Save, User2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { type ProfileFormType, ProfileSchema } from '../validation/profileSchema';
import { zodResolver } from '@hookform/resolvers/zod';

interface Props {
  user: User;
  onSave: (payload: Partial<User>) => Promise<void>;
}

export default function ProfileInfoCard({ user, onSave }: Props) {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const defaultValues: ProfileFormType = {
    name: user.name,
    profile: {
      address: {
        house: user.profile?.address?.house || '',
        place: user.profile?.address?.place || '',
        city: user.profile?.address?.city || '',
        state: user.profile?.address?.state || '',
        pincode: user.profile?.address?.pincode || '',
      },
    },
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
    watch,
    setValue,
  } = useForm<ProfileFormType>({
    resolver: zodResolver(ProfileSchema),
    defaultValues,
    mode: 'onChange',
  });

  useEffect(() => {
    reset(defaultValues);
  }, [user, reset]);

  async function onSubmit(data: ProfileFormType) {
    await onSave({
      name: data.name,
      profile: data.profile,
    });
    setIsEditing(false);
  }

  const isTrue = true;

  return (
    <div className="bg-card border rounded-2xl rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground">Profile Information</h3>
        <div>
          {!isEditing ? (
            <Button
              iconRight={<Pencil size={18} />}
              variant="blue"
              onClick={() => {
                setIsEditing(true);
              }}
            >
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-3">
              <Button
                variant="secondary"
                iconRight={<X size={18} />}
                onClick={() => {
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="green"
                iconRight={<Save size={19} />}
                disabled={!isValid}
                loading={isSubmitting}
                onClick={handleSubmit(onSubmit)}
              >
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User2 className="w-4 h-4 text-indigo-600" />
            Basic Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Full Name</Label>
              <Input
                leftIcon={<User2 size={15} />}
                placeholder="Enter full Name"
                disabled={!isEditing}
                error={errors.name?.message}
                {...register('name')}
              />
            </div>
            <div>
              <Label>Phone Number</Label>
              <Input
                leftIcon={<Phone size={15} />}
                value={user.phone ? user.phone : 'Phone Number not provided'}
                disabled
                readOnly
              />
            </div>
          </div>
        </div>
        <Separator className="mb-3" />
        <div className="pt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-600" />
            Location Information
          </h4>

          <div className="space-y-4">
            <div>
              <Label>Address</Label>
              <Input
                disabled={!isEditing}
                placeholder="Street address, apartment, suite"
                className="px-3"
                {...register('profile.address.house')}
                error={errors.profile?.address?.house?.message}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Place</Label>
                <Input
                  disabled={!isEditing}
                  placeholder="Enter your place"
                  className="px-3"
                  {...register('profile.address.place')}
                  error={errors.profile?.address?.place?.message}
                />
              </div>

              <div>
                <Label>City</Label>
                <Input
                  disabled={!isEditing}
                  placeholder="Enter your city"
                  className="px-3"
                  {...register('profile.address.city')}
                  error={errors.profile?.address?.city?.message}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>State</Label>
                {isEditing ? (
                  <Select
                    placeholder="Select State"
                    leftIcon={<MapPin size={15} />}
                    options={INDIAN_STATES.map(s => ({ label: s, value: s }))}
                    value={watch('profile.address.state')}
                    onChange={v => setValue('profile.address.state', v)}
                    error={errors.profile?.address?.state?.message}
                  />
                ) : (
                  <Input
                    disabled
                    placeholder={user.profile?.address?.state || 'Not Provided'}
                    className="px-3"
                  />
                )}
              </div>
              <div>
                <Label>Pincode</Label>
                <Input
                  disabled={!isEditing}
                  placeholder="Enter Pincode"
                  className="px-3"
                  {...register('profile.address.pincode')}
                  error={errors.profile?.address?.pincode?.message}
                />
              </div>
            </div>

            {/* GPS Location Placeholder */}
            <div className="mt-4 p-4 bg-gradient-to-r from-accent/20 to-primay/20 rounded-lg border border">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-indigo-600 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="font-semibold text-foreground text-sm">GPS Coordinates</h5>
                    {isTrue && (
                      <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                        <Check className="w-3 h-3" />
                        Set
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isTrue
                      ? 'Your precise location has been saved for better service delivery.'
                      : 'Set your GPS coordinates for accurate location-based services.'}
                  </p>
                  {isEditing && (
                    <button className="mt-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                      {isTrue ? 'Update Location' : 'Set Location'} →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// src/features/profile/components/ProfileInfoCard.tsx

// import React, { useEffect, useState } from 'react';
// import type { User } from '@/types/user';
// import Input from '@/components/atoms/Input';
// import Button from '@/components/atoms/Button';
// import Label from '@/components/atoms/Label';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
// import {  phoneRule } from '@/lib/validation/rules';
// import { Save, Pencil, X, MapPin, Camera } from 'lucide-react';

// const profileSchema = z.object({
//   name: z.string().min(3, 'Name too short'),
//   phone: phoneRule.optional(),
//   profile: z.object({
//     bio: z.string().max(300).optional(),
//     address: z.object({
//       fullAddress: z.string().optional(),
//       city: z.string().optional(),
//       state: z.string().optional(),
//       pincode: z.string().optional(),
//       country: z.string().optional(),
//     }).optional(),
//   }).optional(),
// });

// type FormType = z.infer<typeof profileSchema>;

// interface Props {
//   user: User;
//   onSave: (payload: Partial<User>) => Promise<void>;
//   onUseMyLocation: () => void;
// }

// export default function ProfileInfoCard({ user, onSave, onUseMyLocation }: Props) {
//   const [editing, setEditing] = useState(false);
//   const { register, handleSubmit, reset, watch, formState } = useForm<FormType>({
//     resolver: zodResolver(profileSchema),
//     defaultValues: {
//       name: user.name,
//       phone: user.phone || '',
//       profile: {
//         bio: user.profile?.bio || '',
//         address: user.profile?.address || {},
//       },
//     },
//     mode: 'onChange',
//   });

//   useEffect(() => {
//     reset({
//       name: user.name,
//       phone: user.phone || '',
//       profile: { bio: user.profile?.bio || '', address: user.profile?.address || {} },
//     });
//   }, [user, reset]);

//   async function onSubmit(data: FormType) {
//     await onSave({
//       name: data.name,
//       phone: data.phone,
//       profile: {
//         bio: data.profile?.bio,
//         address: data.profile?.address,
//       },
//     });
//     setEditing(false);
//   }

//   return (
//     <div className="bg-card rounded-2xl p-6 border">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="font-semibold text-lg">Profile Information</h3>
//         {!editing ? (
//           <Button variant="blue" iconRight={<Pencil />} onClick={() => setEditing(true)}>Edit</Button>
//         ) : (
//           <div className="flex gap-2">
//             <Button variant="outline" onClick={() => { reset(); setEditing(false); }} iconRight={<X />}>Cancel</Button>
//             <Button variant="green" onClick={handleSubmit(onSubmit)} iconRight={<Save />}>Save</Button>
//           </div>
//         )}
//       </div>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//         <div>
//           <Label>Full name</Label>
//           <Input {...register('name')} disabled={!editing} />
//         </div>

//         <div>
//           <Label>Phone</Label>
//           <Input {...register('phone')} disabled={!editing} />
//         </div>

//         <div>
//           <Label>Bio</Label>
//           <textarea {...register('profile.bio')} disabled={!editing} className="w-full p-3 rounded-lg border" />
//         </div>

//         <div>
//           <Label>Address</Label>
//           <Input {...register('profile.address.fullAddress')} disabled={!editing} placeholder="Full address" />
//           <div className="flex gap-2 mt-2">
//             <Button onClick={onUseMyLocation} iconLeft={<MapPin />}>Use my location</Button>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }
