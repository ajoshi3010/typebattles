"use client"
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';

type Props = {
    callbackUrl?: string,
    error?: string
}

const Login = (props: Props) => {
    const { data: session, status } = useSession();
    const email = useRef("");
    const pass = useRef("");
    const name = useRef("");


    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const res = await signIn("credentials", {
            email: email.current,
            name: name.current,
            image:'/images/UserImage.png',
            password: pass.current,
            redirect: true,
            callbackUrl: props.callbackUrl ?? "http:localhost:3000"
        })
        if (!res?.error) {
            <Link href={(props.callbackUrl ?? "http://localhost:3000")}></Link>
        }
    };

    const onGoogleLogin = async () => {
        await signIn("google", {
            redirect: true,
            callbackUrl: props.callbackUrl ?? '/'
        });
    };

    if (status === "loading") {
        return <div>Loading...</div>;
    }
    return (
        <>
            <div style={{ height: "70vh" }} className="flex items-center justify-center">
                <form onSubmit={onSubmit} className="max-w-sm w-full p-6 bg-gray-800 shadow-md rounded-lg">
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-slate-300 text-xl mb-2">
                            Full Name
                        </label>
                        <input
                            type="name"
                            onChange={(e) => (name.current = e.target.value)}
                            name="name"
                            id="name"
                            className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-slate-300 text-xl mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            onChange={(e) => (email.current = e.target.value)}
                            name="email"
                            id="email"
                            className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-slate-300 text-xl mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            onChange={(e) => (pass.current = e.target.value)}
                            name="password"
                            id="password"
                            className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-slate-700 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                            Sign In
                        </button>
                        <Link href={props.callbackUrl ?? "/"} className="text-gray-400 hover:text-white hover:underline">
                            Cancel
                        </Link>
                    </div>

                    {/* Separator */}
                    <div className="my-4 border-t border-gray-600"></div>

                    <div className="mt-4 flex items-center justify-center">
                        <button
                            type="button"
                            onClick={onGoogleLogin}
                            className="flex items-center px-4 py-2 bg-gray-700 text-white font-semibold rounded-full shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 48 48"
                                className="w-5 h-5 mr-2">
                                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                            </svg>
                            Sign in with Google
                        </button>
                    </div>

                </form >
            </div >

        </>
    )
}

export default Login
