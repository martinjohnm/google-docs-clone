import { UserLoginInput } from "@repo/types/zod-types"
import React, { useState } from "react"
import { LoginSignupLayout } from "../utils/LoginSIgnupLayout"
import { useUserLogin } from "../hooks/user/useUserLogin"

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

            <div className="h-[500px] w-[300px] justify-center items-center">
                <div className="bg-slate-500 rounded-md p-2 flex flex-col w-full">

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
                <div className="bg-slate-500 rounded-md p-2 flex flex-col justify-center">

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

                <div className="bg-slate-500 rounded-md p-2 flex flex-col justify-center">
                    <button onClick={handleLogin} className="bg-green-400 p-2 cursor-pointer">Login</button>
                </div>
            </div>
        </div>
    </LoginSignupLayout>
            
        )
}