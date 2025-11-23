import { Eye, EyeOff, Lock } from 'lucide-react';
import React, { useState } from 'react';
import Input from './Input';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export default function PasswordInput({ error, value, onChange, ...props }: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <Input
      type={show ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      error={error}
      leftIcon={<Lock className="w-5 h-5 text-muted-foreground" />}
      rightIcon={
        <button type="button" onClick={() => setShow(!show)}>
          {show ? (
            <EyeOff className="w-5 h-5 text-muted-foreground" />
          ) : (
            <Eye className="w-5 h-5 text-muted-foreground" />
          )}
        </button>
      }
      {...props}
    />
  );
}
