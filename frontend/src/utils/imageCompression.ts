import imageCompression from 'browser-image-compression';

export async function compressAndConvertToWebP(
  file: File,
  maxSizeMB: number = 1,
  maxWidthOrHeight: number = 1920
) {
  const options = {
    maxSizeMB,
    maxWidthOrHeight,
    useWebWorker: true,
    fileType: 'image/webp',
    initialQuality: 0.7,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return renameToWebP(compressedFile);
  } catch (error) {
    console.error('Compression failed, using original:', error);
    return file;
  }
}
function renameToWebP (file :File ) :File {
  if(file.name.endsWith(".webp")) {return file;}

  const baseName = file.name.replace(/\.[^/.]+$/, "");
  return new File([file] ,`${baseName}.webp`,{
    type:"image/webp",
    lastModified:Date.now()
  });
}


export function validateImage(file: File, maxSizeMB: number = 5): string | null {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    return 'Only JPG, PNG, and WebP images are allowed';
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    return `Image must be smaller than ${maxSizeMB}MB`;
  }

  return null;
}
