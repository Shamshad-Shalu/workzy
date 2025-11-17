import React, { useRef } from 'react';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}

export default function OtpInput({ value, onChange, length = 6 }: OtpInputProps) {
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) {
      return;
    }

    const newValue = value.split('');
    newValue[index] = val;
    const finalValue = newValue.join('');
    onChange(finalValue);

    if (val && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');

    if (!/^\d+$/.test(paste)) {
      return;
    }

    if (paste.length === length) {
      onChange(paste);
      inputs.current[length - 1]?.focus();
      return;
    }
  };

  return (
    <div className="flex gap-3" onPaste={handlePaste}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el: HTMLInputElement | null) => {
            inputs.current[i] = el;
          }}
          maxLength={1}
          value={value[i] || ''}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          className="w-12 h-12 text-center text-xl border rounded-lg focus:ring-2 focus:ring-black"
        />
      ))}
    </div>
  );
}
