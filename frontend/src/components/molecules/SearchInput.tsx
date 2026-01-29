import { useEffect, useRef, useState } from 'react';
import type { InputProps } from '../atoms/Input';
import Input from '../atoms/Input';
import { Search } from 'lucide-react';

interface SearchInputProps extends Omit<InputProps, 'onChange' | 'onFocus' | 'value' | 'leftIcon'> {
  value?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  debounce?: number;
  variant?: 'default' | 'inline';
}

export default function SearchInput({
  value = '',
  onChange,
  onFocus,
  debounce = 500,
  className = '',
  variant = 'default',
  ...props
}: SearchInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isTyping, setIsTyping] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isTyping) {
      setInputValue(value);
    }
  }, [value, isTyping]);

  useEffect(() => {
    if (!onChange) {return;}
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      const trimmed = inputValue.trim();
      if (trimmed !== value.trim()) {
        onChange(trimmed);
      }
      setIsTyping(false);
    }, debounce);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [inputValue, debounce, value, onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsTyping(true);
  };
  const handleFocus = (_e?: React.FocusEvent<HTMLInputElement>) => {
    if (onFocus) {
      onFocus();
    }
  };

  if (variant === 'inline') {
    return (
      <input
        {...props}
        type="text"
        value={inputValue}
        onChange={handleChange}
        onFocus={handleFocus}
        className={className}
      />
    );
  }
  return (
    <Input
      {...props}
      value={inputValue}
      onChange={handleChange}
      leftIcon={<Search />}
      onFocus={handleFocus}
      className={className}
    />
  );
}
