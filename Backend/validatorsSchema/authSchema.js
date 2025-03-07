const z = require('zod')

const signupSchema = z.object({
    fullName: z.string().max(20, { message: "Name length Should not Be greater than 20" }),
    username: z.string()
        .min(3, { message: "Username must be at least 5 characters" })
        .max(10, { message: "Username length should not be greater than 10" }),
    password: z.string().min(3, { message: "Password must be at least 3 characters" })
})

const loginSchema = z.object({
    username: z.string()
        .min(3, { message: "Username must be at least 5 characters" })
        .max(10, { message: "Username length should not be greater than 10" }),
    password: z.string().min(3, { message: "Password must be at least 3 characters" })
})
module.exports = { signupSchema,loginSchema }