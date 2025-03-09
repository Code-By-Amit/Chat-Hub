import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";
import { fetchAuthUser, loginApi, signupApi } from "../apis/user";
import toast from 'react-hot-toast';

const UserContext = createContext()

export const UserContexProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null)
    const queryClient = useQueryClient()

    const { data: user } = useQuery({
        queryKey: ['authUser'],
        queryFn: () => fetchAuthUser(token),
        enabled: !!token
    })

    const loginMutation = useMutation({
        mutationKey: ["loginUser"],
        mutationFn: (credentials) => loginApi(credentials),
        onMutate: () => {
            const toastId = toast.loading("Logging in....")
            return { toastId }
        },
        onSuccess: (data, variable, context) => {
            toast.dismiss(context.toastId);
            toast.success(data.message);
            localStorage.setItem('token', data.token)
            setToken(data.token)
            queryClient.invalidateQueries(['authUser'])
        },
        onError: (error, _, context) => {
            toast.dismiss(context.toastId)
            if(error.response?.data?.message){
                toast.error(error.response?.data?.message)
            }
            if (Array.isArray(error.response.data.errors)) {
                error.response.data.errors.map(error => {
                    toast.error(error.message)
                })
            }
        }
    })

    const signupMutation = useMutation({
        mutationKey: ["signupUser"],
        mutationFn: (formData) => signupApi(formData),
        onMutate: () => {
            const toastId = toast.loading("Signing up....")
            return { toastId }
        },
        onSuccess: (data, variable, context) => {
            toast.dismiss(context.toastId);
            toast.success(data.message);
            localStorage.setItem('token', data.token)
            setToken(data.token)
            queryClient.invalidateQueries(['authUser'])
        },
        onError: (error, _, context) => {
            toast.dismiss(context.toastId)
            if(error.response?.data?.message){
                toast.error(error.response?.data?.message)
            }
            if (Array.isArray(error.response.data.errors)) {
                error.response.data.errors.map(error => {
                    toast.error(error.message)
                })
            }
        }
    })

    return <UserContext.Provider value={{ user, loginMutation , signupMutation}}>
        {children}
    </UserContext.Provider>
}

export const authUser = () => useContext(UserContext)