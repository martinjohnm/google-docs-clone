
import { LoginSignupLayout } from "../utils/LoginSIgnupLayout"
import { useState } from "react"
import { UserCreationInput } from "@repo/types/zod-types"
import { useUserSignUp } from "../hooks/user/useUserSignUp"
import { Link } from "react-router-dom"



export const SignupPage = () => {

    const [inputs, setInputs] = useState<UserCreationInput>({
        name : "",
        email : "",
        password : "",
        confirmPassword : ""
    })

    const {signupUser} = useUserSignUp()

    function handleChange (e : React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setInputs(perv => ({
            ...perv,
            [name] : value
        }))
    }

    const handleSignUp = () => {
        signupUser(inputs)
    }

    return <LoginSignupLayout>
            <div className="flex flex-col justify-center items-center h-screen" >
    
                
                <div className="min-w-[300px] bg-slate-500 justify-center items-center">
                    <div className="p-4">
                        <div className="py-1 flex flex-col w-full">
        
                            <label className="w-ful items-start justify-start" htmlFor="">
                                <p>Name</p>
                            </label>
                            <input
                                className="text-white p-1 outline-none border rounded-sm"
                                name="name"
                                value={inputs.name}
                                onChange={handleChange}
                            />
        
                            
                        </div>
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
                        <div className="py-1 flex flex-col justify-center">
        
                            <label className="" htmlFor="">
                                Confirm Password
                            </label>
                            <input
                                className="text-white p-1 outline-none border rounded-sm"
                                name="confirmPassword"
                                type="password"
                                value={inputs.confirmPassword}
                                onChange={handleChange}
                            />
                            
                        </div>
        
                        <div className="py-1 flex flex-col justify-center items-center">
                            <button onClick={handleSignUp} className="bg-green-400 p-2 rounded-md hover:bg-green-600 cursor-pointer">Signup</button>
                        </div>
                        <div className="py-1 items-center flex flex-col justify-center">
                            <p>Already have an account ? <span><Link className="underline" to={"/login"}>Login</Link></span></p>
                        </div>
                    </div>
                </div>
            </div>
        </LoginSignupLayout>
}