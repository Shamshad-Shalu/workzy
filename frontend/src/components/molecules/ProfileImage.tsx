import { Camera } from 'lucide-react';
import React, { useRef, useState } from 'react';

import userprofile from '@/assets/images/userprofile.avif';

import { Skeleton } from '../ui/skeleton';

interface Props {
  src: string | undefined;
  size?: number;
  editable?: boolean;
  onChange?: (file: File) => Promise<void>;
  onClickImage?: () => void;
  loading?: boolean;
  progress?: number;
  fallbackImage?: string;
}
export default function ProfileImage({
  src,
  size = 120,
  editable = false,
  onChange,
  onClickImage,
  loading = false,
  progress = 0,
  fallbackImage,
}: Props) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (!editable || !onChange) {
      return;
    }
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    await onChange(file);
  }
  return (
    <div
      className="relative cursor-pointer group inline-block"
      style={{ width: size, height: size }}
    >
      {(!imgLoaded || loading) && (
        <Skeleton style={{ width: size, height: size }} className="absolute inset-0 rounded-full" />
      )}

      <img
        src={src}
        onClick={onClickImage}
        onLoad={() => setImgLoaded(true)}
        onError={e => {
          e.currentTarget.src = fallbackImage ?? userprofile;
        }}
        style={{ width: size, height: size, display: imgLoaded && !loading ? 'block' : 'none' }}
        className="rounded-full object-cover border-2 border-bg-accent/30"
        alt="Profile"
      />
      {loading && (
        <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center gap-1.5 p-2">
          <div className="relative flex items-center justify-center h-8 w-8">
            <div className="absolute inset-0 border-2 border-white/20 rounded-full" />
            <div className="absolute inset-0 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span className="text-[8px] text-white font-bold">{progress}%</span>
          </div>
          <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {editable && imgLoaded && !loading && (
        <>
          <button
            onClick={() => fileRef.current?.click()}
            className="
              absolute bottom-1 right-1 z-30  
              bg-white border rounded-full p-2 shadow
              opacity-90 group-hover:opacity-100 transition
            "
          >
            <Camera size={18} className="text-gray-700" />
          </button>

          <input ref={fileRef} type="file" hidden accept="image/*" onChange={handleFileSelect} />
        </>
      )}
    </div>
  );
}
