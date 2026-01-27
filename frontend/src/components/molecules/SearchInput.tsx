import { useEffect, useRef, useState } from 'react';
import type { InputProps } from '../atoms/Input';
import Input from '../atoms/Input';
import { Search } from 'lucide-react';

interface SearchInputProps extends Omit<InputProps, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  debounce?: number;
}

export default function SearchInput({
  value,
  onChange,
  debounce = 500,
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
  }, [inputValue, debounce, value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsTyping(true);
  };

  return <Input {...props} value={inputValue} onChange={handleChange} leftIcon={<Search />} />;
}
