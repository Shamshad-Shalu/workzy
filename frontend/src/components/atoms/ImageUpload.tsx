import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ImageUploadProps {
  value?: string | null | File;
  onChange?: (file: File | null | undefined) => void;
  error?: string;
  className?: string;
  maxSizeMB?: number;
  isEditable?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  error,
  className,
  maxSizeMB = 5,
  isEditable = true,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(
    typeof value === 'string' && value ? value : null
  );
  const fileRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    let objectUrl: string | null = null;

    if (typeof value === 'string' && value) {
      setPreview(value);
    } else if (value instanceof File) {
      objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);
    } else {
      setPreview(null);
    }
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [value]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      onChange?.(null);
      toast.error(`File too large! Max size is ${maxSizeMB}MB.`);
      return;
    }
    onChange?.(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange?.(null);
    if (fileRef.current) {
      fileRef.current.value = '';
    }
  };

  return (
    <div className={cn('flex flex-col gap-2 w-full')}>
      <div
        className={cn(
          'relative h-[250px] rounded-md border overflow-hidden bg-muted',
          error && 'border-destructive',
          className
        )}
      >
        {preview ? (
          <img src={preview} alt="preview" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full text-muted-foreground">
            <Camera className="w-8 h-8 mb-2" />
            <p className="text-sm">Upload Image</p>
          </div>
        )}

        {preview && isEditable && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-destructive text-white p-1 rounded-full"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileRef}
        onChange={handleFileSelect}
      />
      {isEditable && (
        <Button type="button" onClick={() => fileRef.current?.click()} variant="secondary">
          {preview ? 'Change Image' : 'Upload Image'}
        </Button>
      )}

      <div className="min-h-[1.2rem] flex items-center">
        {error ? (
          <p className="text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {error}
          </p>
        ) : (
          <span className="text-sm invisible">placeholder</span>
        )}
      </div>
    </div>
  );
}
