import { UserLoginInput } from "@repo/types/zod-types"
import React, { useState } from "react"
import { LoginSignupLayout } from "../utils/LoginSIgnupLayout"
import { useUserLogin } from "../hooks/user/useUserLogin"
import { Link } from "react-router-dom"

export const LoginPage = () => {
    
    const [inputs, setInputs] = useState<UserLoginInput>({
        email : "",
        password : ""
    })

    function handleChange(e : React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target
        setInputs(prev => ({
            ...prev,
            [name] : value
        }))
    }

    const {loginUser} = useUserLogin()
    
    const handleLogin = () => {
        loginUser(inputs)
    }

    return (
    <LoginSignupLayout>
        <div className="flex flex-col justify-center items-center h-screen" >

            <div className="min-w-[300px] bg-slate-500 justify-center items-center">
                <div className="p-4">

                    <div className="py-1 flex flex-col w-full">

                        <label className="w-ful items-start justify-start" htmlFor="">
                            <p>Email</p>
                        </label>
                        <input
                            className="text-white p-1 outline-none border rounded-sm"
                            name="email"
                            value={inputs.email}
                            onChange={handleChange}
                        />

                        
                    </div>
                    <div className="py-1 flex flex-col justify-center">

                        <label className="" htmlFor="">
                            Password
                        </label>
                        <input
                            className="text-white p-1 outline-none border rounded-sm"
                            name="password"
                            type="password"
                            value={inputs.password}
                            onChange={handleChange}
                        />
                        
                    </div>

                    <div className="items-center py-1 flex flex-col justify-center">
                        <button onClick={handleLogin} className="bg-green-400 p-2 rounded-md hover:bg-green-600 cursor-pointer">Login</button>
                    </div>
                    <div className="items-center flex flex-col justify-center">
                        <p>Create an account ? <span><Link className="underline" to={"/signup"}>Signup</Link></span></p>
                    </div>
                </div>
            </div>
        </div>
    </LoginSignupLayout>
            
        )
}