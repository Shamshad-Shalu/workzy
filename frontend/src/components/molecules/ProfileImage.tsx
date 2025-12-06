import { Camera } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { Skeleton } from '../ui/skeleton';

interface Props {
  src: string | undefined;
  size?: number;
  editable?: boolean;
  onChange?: (file: File) => Promise<void>;
  onClickImage?: () => void;
  loading?: boolean;
}
export default function ProfileImage({
  src,
  size = 120,
  editable = false,
  onChange,
  onClickImage,
  loading = false,
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
        onError={() => setImgLoaded(true)}
        style={{ width: size, height: size, display: imgLoaded && !loading ? 'block' : 'none' }}
        className="rounded-full object-cover border-2 border-bg-accent/30"
        alt="User Profile Avatar"
      />
      {loading && (
        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
          <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
