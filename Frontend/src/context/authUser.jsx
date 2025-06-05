import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import { fetchAuthUser, loginApi, logoutApi, setKeys, signupApi } from "../apis/user";
import toast from 'react-hot-toast';
import { clearStoredPrivateKey, getStoredPrivateKey } from "../utils/indexDb";
import { generateRSAKeys } from "../Encryption/rsa";

const UserContext = createContext()

export const UserContexProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null)
    const [privateKey, setPrivateKey] = useState(null)
    const queryClient = useQueryClient()

    useEffect(() => {
        const loadKey = async () => {
            const key = await getStoredPrivateKey();
            if (key) setPrivateKey(key)
        };
        loadKey();
    }, []);

    const { data: user ,error, isError} = useQuery({
        queryKey: ['authUser'],
        queryFn: () => fetchAuthUser(token),
        enabled: !!token,
        retry: false,
    })
   
    const handleUnauthorized = async ()=>{
        if (isError) {
            if (error?.response?.status === 401) {
                toast.error("Session expired. Redirecting to login...");
                localStorage.removeItem('token');
                setToken(null);
                await clearStoredPrivateKey();
                queryClient.removeQueries(['authUser']);
                navigate("/login");
            }
          }
    }
  useEffect(() => {
    handleUnauthorized();
  }, [isError, error]); 

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
            if (error.response?.data?.message) {
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
            if (error.response?.data?.message) {
                toast.error(error.response?.data?.message)
            }
            if (Array.isArray(error.response.data.errors)) {
                error.response.data.errors.map(error => {
                    toast.error(error.message)
                })
            }
        }
    })

    const logoutMutation = useMutation({
        mutationKey: ['logoutUser'],
        mutationFn: logoutApi,
        onMutate: () => {
            const toastId = toast.loading("Logging out....")
            return { toastId }
        },
        onSuccess: async (data, variable, context) => {
            toast.dismiss(context.toastId);
            toast.success(data.message);
            await clearStoredPrivateKey();
            localStorage.removeItem('token')
            queryClient.invalidateQueries(['authUser'])
        },
    })

    return <UserContext.Provider value={{ user, loginMutation, signupMutation, logoutMutation, privateKey, setPrivateKey }}>
        {children}
    </UserContext.Provider>
}

export const authUser = () => useContext(UserContext)