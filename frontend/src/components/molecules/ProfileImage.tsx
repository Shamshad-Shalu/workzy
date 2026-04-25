import { Camera } from 'lucide-react';
import React, { useRef, useState } from 'react';

import { Skeleton } from '../ui/skeleton';

interface Props {
  src?: string;
  name?: string;
  size?: number;
  editable?: boolean;
  onChange?: (file: File) => Promise<void>;
  onClickImage?: () => void;
  loading?: boolean;
  progress?: number;
}
export default function ProfileImage({
  src,
  name = '',
  size = 120,
  editable = false,
  onChange,
  onClickImage,
  loading = false,
  progress = 0,
}: Props) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

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
  function getInitials(name: string) {
    if (!name) {
      return '?';
    }
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0][0].toUpperCase();
    }

    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  function getGradient(name: string) {
    const gradients = [
      'from-pink-500 to-orange-400',
      'from-blue-500 to-cyan-400',
      'from-green-500 to-emerald-400',
      'from-purple-500 to-indigo-400',
      'from-yellow-400 to-orange-500',
      'from-rose-500 to-pink-400',
      'from-sky-500 to-blue-400',
    ];
    if (!name) {
      return gradients[0];
    }
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return gradients[Math.abs(hash) % gradients.length];
  }
  const showImage = src && !imgError && imgLoaded && !loading;

  return (
    <div
      className="relative cursor-pointer group inline-block"
      style={{ width: size, height: size }}
    >
      {((!imgLoaded && !imgError) || loading) && (
        <Skeleton style={{ width: size, height: size }} className="absolute inset-0 rounded-full" />
      )}

      {src && (
        <img
          src={src}
          onClick={onClickImage}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
          style={{ width: size, height: size, display: showImage ? 'block' : 'none' }}
          className="rounded-full object-cover border-2 border-bg-accent/30"
          alt="Profile"
        />
      )}
      {(!src || imgError) && !loading && (
        <div
          onClick={onClickImage}
          className={`
            flex items-center justify-center
            rounded-full text-white font-semibold
            bg-gradient-to-br ${getGradient(name)}
          `}
          style={{
            width: size,
            height: size,
            fontSize: size * 0.35,
          }}
        >
          {getInitials(name)}
        </div>
      )}

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

      {editable && !loading && (
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
