import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { loginSchema, type LoginSchemaType } from '../validation/loginSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import PasswordInput from '@/components/atoms/PasswordInput';
import Label from '@/components/atoms/Label';
import Input from '@/components/atoms/Input';
import { Mail } from 'lucide-react';
import { AUTH_MESSAGES } from '@/constants';
import { handleApiError } from '@/utils/handleApiError';

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      const user = await login(data.email, data.password);
      toast.success(AUTH_MESSAGES.LOGIN_SUCCESS);

      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'worker') {
        navigate('/worker');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      toast.error(handleApiError(error));
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-3xl font-bold text-gray-900">Welcome Back to Workzy!</h1>
      <p className="text-gray-600">Your workspace is just a click away</p>

      {/* Email */}
      <div>
        <Label>Email Address</Label>
        <Input
          placeholder="Enter your email"
          leftIcon={<Mail />}
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      {/* Password */}
      <div>
        <Label>Password</Label>
        <PasswordInput
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex justify-between items-center mt-2">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" className="rounded" />
            Remember me
          </label>
          <Link className="text-sm hover:underline text-black" to="/forgot-password">
            Forgot password?
          </Link>
        </div>
      </div>

      {/* Login Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-all"
      >
        {isSubmitting ? 'Signing in...' : 'Sign In →'}
      </button>

      {/* Signup Link */}
      <p className="text-center text-gray-600">
        Don’t have an account?{' '}
        <Link className="text-black font-medium hover:underline" to="/signup">
          Sign up
        </Link>
      </p>

      {/* Divider */}
      <div className="relative mt-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      {/* Google Login */}
      <button
        type="button"
        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
      >
        <img src="/google-logo.png" className="h-5 mr-2" />
        Sign in with Google
      </button>
    </form>
  );
}

// import { useState } from "react";
// import { Mail } from "lucide-react";
// import Input from "@/components/atoms/Input";
// import PasswordInput from "@/components/atoms/PasswordInput";
// import Label from "@/components/atoms/Label";
// import { useAuth } from "../hooks/useAuth";
// import { toast } from "sonner";
// import { Link } from "react-router-dom";
// export default function LoginForm() {
//   const { login } = useAuth();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errors, setErrors] = useState<any>({});
//   const [loading, setLoading] = useState(false);

//   const submit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const err: any = {};
//     if (!email) err.email = "Email is required";
//     if (!password) err.password = "Password is required";

//     if (Object.keys(err).length) {
//       setErrors(err);
//       toast.error("Please fix the form errors");
//       return;
//     }

//     setLoading(true);

//     try {
//       await login(email, password);
//       toast.success("Logged in successfully");
//     } catch (err: any) {
//       toast.error(err?.response?.data?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form className="space-y-6" onSubmit={submit}>
//       <h1 className="text-3xl font-bold text-gray-900 mb-2">
//         Welcome Back to Workzy!
//       </h1>
//       <p className="text-gray-600 mb-6">Your workspace is just a click away</p>

//       {/* Email */}
//       <div>
//         <Label>Email Address</Label>
//         <Input
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           leftIcon={<Mail />}
//           placeholder="Enter your email"
//           error={errors.email}
//         />
//       </div>

//       {/* Password */}
//       <div>
//         <Label>Password</Label>
//         <PasswordInput
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Enter your password"
//           error={errors.password}
//         />

//         <div className="flex items-center justify-between mt-2">
//           <label className="flex items-center gap-2 text-sm text-gray-600">
//             <input type="checkbox" className="rounded" />
//             Remember me
//           </label>

//           <Link className="text-sm text-black hover:underline" to="/forgot-password">
//             Forgot password?
//           </Link>
//         </div>
//       </div>

//       {/* Sign in button */}
//       <button
//         type="submit"
//         disabled={loading}
//         className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 flex justify-center items-center gap-2 transition-all"
//       >
//         {loading ? "Signing In..." : "Sign In →"}
//       </button>

//       {/* Signup link */}
//       <div className="text-center text-gray-600">
//         Don’t have an account?{" "}
//         <Link className="text-black font-medium hover:underline" to="/signup">
//           Sign up
//         </Link>
//       </div>

//       {/* Divider */}
//       <div className="relative mt-6">
//         <div className="absolute inset-0 flex items-center">
//           <div className="w-full border-t border-gray-300"></div>
//         </div>
//         <div className="relative flex justify-center text-sm">
//           <span className="px-2 bg-white text-gray-500">Or continue with</span>
//         </div>
//       </div>

//       {/* Google login placeholder */}
//       <button
//         type="button"
//         className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//       >
//         <img src="/google-logo.png" className="h-5 mr-2" />
//         Sign in with Google
//       </button>
//     </form>
//   );
// }

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { loginSchema, type LoginSchemaType } from "../validation/loginSchema";

// import Label from "@/components/atoms/Label";
// import Input from "@/components/atoms/Input";
// import PasswordInput from "@/components/atoms/PasswordInput";
// import { Mail } from "lucide-react";
// import { toast } from "sonner";
// import { useAuth } from "../hooks/useAuth";

// export default function LoginForm() {
//   const { login } = useAuth();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting }
//   } = useForm<LoginSchemaType>({
//     resolver: zodResolver(loginSchema),
//     mode: "onChange", // LIVE VALIDATION
//   });

//   const onSubmit = async (data: LoginSchemaType) => {
//     try {
//       await login(data.email, data.password);
//       toast.success("Logged in successfully");
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
//       <h1 className="text-3xl font-bold">Welcome Back to Workzy!</h1>
//       <p className="text-gray-600">Your workspace is just a click away</p>

//       {/* Email */}
//       <div>
//         <Label>Email Address</Label>
//         <Input
//           placeholder="Enter your email"
//           leftIcon={<Mail />}
//           error={errors.email?.message}
//           {...register("email")}
//         />
//       </div>

//       {/* Password */}
//       <div>
//         <Label>Password</Label>
//         <PasswordInput
//           placeholder="Enter your password"
//           error={errors.password?.message}
//           {...register("password")}
//         />
//       </div>

//       <button
//         disabled={isSubmitting}
//         className="w-full bg-black text-white py-3 rounded-lg"
//       >
//         {isSubmitting ? "Signing in..." : "Sign In →"}
//       </button>
//     </form>
//   );
// }
