import type React from 'react';

interface LoginFormProps {
  email: string;
  password: string;
  loading: boolean;
  showPassword: boolean;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setShowPassword: (value: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function LoginForm({
  email,
  password,
  loading,
  showPassword,
  setEmail,
  setPassword,
  setShowPassword,
  onSubmit,
}: LoginFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 w-full max-w-sm mx-auto">
      <div>
        <label>Email</label>
        <input
          className="border w-full p-2 rounded"
          type="email"
          value={email}
          placeholder="email@example.com"
          onChange={e => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label>Password</label>
        <div className="relative">
          <input
            className="border w-full p-2 rounded"
            type={showPassword ? 'text' : 'password'}
            value={password}
            placeholder="Enter password"
            onChange={e => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-2 text-sm"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
