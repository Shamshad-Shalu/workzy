import { useEffect, useState } from 'react';
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

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(inputValue);
    }, debounce);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, debounce, onChange]);

  return (
    <Input
      {...props}
      value={inputValue}
      onChange={e => setInputValue(e.target.value)}
      leftIcon={<Search />}
    />
  );
}
