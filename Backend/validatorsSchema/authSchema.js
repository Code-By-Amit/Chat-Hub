const z = require('zod')

const signupSchema = z.object({
    firstName: z.string().max(10, { message: "First Name length Should not Be greater than 15" }),
    lastName: z.string().optional(),
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