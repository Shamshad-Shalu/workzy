import React from 'react';

interface Props {
  children: React.ReactNode;
  image: string;
  logo?: string;
}

export default function AuthLayout({ children, image, logo }: Props) {
  return (
    <div className="min-h-screen bg-background  flex items-center justify-center px-4">
      <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2">
        {/* Left-form side  */}
        <div className="p-10 flex items-center justify-center">
          <div className="w-full max-w-md">{children}</div>
        </div>

        {/* Right-image-side  */}
        <div className="relative hidden lg:block">
          <img src={image} alt="auth" className="object-cover w-full h-full" />

          {logo && <img src={logo} className="absolute top-5 left-5 h-10" alt="logo" />}
        </div>
      </div>
    </div>
  );
}
