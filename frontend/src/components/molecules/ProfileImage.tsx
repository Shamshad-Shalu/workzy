import { Camera } from 'lucide-react';
import { useRef, useState } from 'react';

interface Props {
  src: string | undefined;
  size?: number;
  editable?: boolean;
  onChange?: (file: File) => Promise<void>;
  onClickImage?: () => void;
}

export default function ProfileImage({
  src,
  size = 120,
  editable = false,
  onChange,
  onClickImage,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (!editable || !onChange) {
      return;
    }

    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    await onChange(file);
    setUploading(false);
  }
  return (
    <div className="relative cursor-pointer group inline-block">
      <img
        src={src}
        onClick={onClickImage}
        style={{ width: size, height: size }}
        className="rounded-full object-cover border-2 border-bg-accent/30"
      />
      {uploading && (
        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
          <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {editable && (
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
