import { useState } from "react";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL ?? 'pooi';

export const LandingPage = () => {

    const [email, setEmail] = useState<string | null>(null)
    const [password, setPassword] = useState<string | null>(null)

    async function Login() {
        console.log('hai');
        
        const res = await fetch(`${BACKEND_URL}/auth/signup-local`, {
            method: "POST",
            credentials: "include", // IMPORTANT for sessions
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        
        if (!res.ok) {
            const error = await res.json().catch(() => null);
            throw new Error(error?.message || "Login failed");
        }

        const data = await res.json()

        console.log(data);
        
    } 

    async function Hi() {
        const res = await fetch(`${BACKEND_URL}/auth/get-user`, {
            method: "GET",
            credentials: "include", // IMPORTANT for sessions
            headers: {
            "Content-Type": "application/json",
            }
        });
        const data = await res.json()
        console.log(data);
        
    }

    return <div className="mx-auto container h-screen max-w-5xl p-1 flex flex-col justify-center items-center">

        <div className="max-w-2xl h-[300px] p-4 rounded-md bg-slate-400 flex flex-col justify-center items-center">
            <div className="flex flex-col">
                <label htmlFor="">Email</label>
                <input onChange={(e) => setEmail(e.target.value)} className="outline-none p-1 bg-slate-300 rounded-md text-black" placeholder="johndoe@example.com" type="text" />
            </div>
            <div className="mt-2 flex flex-col">
                <label htmlFor="">Password</label>
                <input onChange={(e) => setPassword(e.target.value)} className="outline-none p-1 bg-slate-300 rounded-md text-black" type="password" placeholder="***************"/>
            </div>
            <div className="rounded-md text-white mt-4">
                <button onClick={Login} className="bg-green-400 cursor-pointer hover:bg-green-600 rounded-md text-black px-2 py-1">Login</button>
            </div>
            <div className="rounded-md text-white mt-4">
                <button onClick={Hi} className="bg-green-400 cursor-pointer hover:bg-green-600 rounded-md text-black px-2 py-1">Login</button>
            </div>
        </div>
    </div>
}