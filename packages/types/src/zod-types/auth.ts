

import { z } from "zod"


export const userCreationInput = z.object({
    name : z.string().optional(),
    email : z.string().min(1, {message : "email cannot be empty"}),
    password : z.string().min(1, {message : "password canoot be empty"}),
    confirmPassword : z.string().min(1, {message : "Confirm password cannot be zero"})
})


export const userLoginInput = z.object({
    email : z.string().min(1, {message : "email cannot be empty"}),
    password : z.string().min(1, {message : "password canoot be empty"}),
})


// User 
export type UserCreationInput = z.infer<typeof userCreationInput>
export type UserLoginInput = z.infer<typeof userLoginInput>