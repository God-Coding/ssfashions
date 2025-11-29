'use client'

import { signIn } from "next-auth/react"
import { FcGoogle } from "react-icons/fc"

export default function SignIn() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50">
            <div className="max-w-md w-full mx-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-pink-100">
                    {/* Logo/Brand */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            SS Fashions
                        </h1>
                        <p className="text-gray-600">Sign in to continue</p>
                    </div>

                    {/* Benefits */}
                    <div className="mb-8 space-y-3">
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-pink-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-gray-700">Save your favorite sarees to wishlist</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-pink-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-gray-700">Track your orders and preferences</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-pink-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-gray-700">Get personalized recommendations</p>
                        </div>
                    </div>

                    {/* Google Sign In Button */}
                    <button
                        onClick={() => signIn('google', { callbackUrl: '/' })}
                        className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 rounded-lg px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                        <FcGoogle className="text-2xl" />
                        <span>Continue with Google</span>
                    </button>

                    {/* Privacy Notice */}
                    <p className="text-xs text-gray-500 text-center mt-6">
                        By signing in, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>

                {/* Additional Info */}
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                        New to SS Fashions?{' '}
                        <span className="text-pink-600 font-medium">Create an account automatically on first sign-in</span>
                    </p>
                </div>
            </div>
        </div>
    )
}
