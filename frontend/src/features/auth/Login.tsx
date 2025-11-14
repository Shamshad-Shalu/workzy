import { AUTH_ROUTES } from "@/constants/apiRoutes";
import api from "@/lib/api/axios";
import  React, { useState } from "react";


const Login :React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    console.log(email,password)

    const handleSubmit = async (e: React.FormEvent) => {

        console.log("Form submitted");
        e.preventDefault();

        try {
        const res = await api.post(AUTH_ROUTES.LOGIN, {
            email,
            password,
        });

        setMessage("✔️ Login success: " + res.data.message);
        } catch (err: any) {
        setMessage("❌ Error: " + err.response?.data?.message || "Something went wrong");
        }
    };
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md space-y-4 w-80">
            <h2 className="text-xl font-bold">Login</h2>

            <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />

            <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />

            <button className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Login
            </button>

            {message && <p className="text-sm">{message}</p>}
        </form>
        </div>

    )
}

export default Login;