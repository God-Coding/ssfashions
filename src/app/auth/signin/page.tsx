'use client';

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function SignIn() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #fff5f5 0%, #ffffff 50%, #fff0f0 100%)',
            padding: '20px'
        }}>
            <div style={{
                maxWidth: '450px',
                width: '100%'
            }}>
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 10px 40px rgba(128, 0, 0, 0.1)',
                    padding: '40px',
                    border: '1px solid rgba(128, 0, 0, 0.1)'
                }}>
                    {/* Logo/Brand */}
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <h1 style={{
                            fontSize: '2.5rem',
                            fontWeight: 'bold',
                            background: 'linear-gradient(135deg, #800000 0%, #a00000 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            marginBottom: '8px'
                        }}>
                            SS Fashions
                        </h1>
                        <p style={{ color: '#666', fontSize: '1rem' }}>Sign in to continue</p>
                    </div>

                    {/* Benefits */}
                    <div style={{ marginBottom: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                            <svg style={{ width: '20px', height: '20px', color: '#800000', marginTop: '2px', flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <p style={{ fontSize: '0.95rem', color: '#555', margin: 0 }}>Save your favorite sarees to wishlist</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                            <svg style={{ width: '20px', height: '20px', color: '#800000', marginTop: '2px', flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <p style={{ fontSize: '0.95rem', color: '#555', margin: 0 }}>Track your orders and delivery status</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                            <svg style={{ width: '20px', height: '20px', color: '#800000', marginTop: '2px', flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <p style={{ fontSize: '0.95rem', color: '#555', margin: 0 }}>Faster checkout and order placement</p>
                        </div>
                    </div>

                    {/* Google Sign In Button */}
                    <button
                        onClick={() => signIn('google', { callbackUrl: '/' })}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            background: 'white',
                            border: '2px solid #ddd',
                            borderRadius: '8px',
                            padding: '14px 24px',
                            color: '#333',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#f9f9f9';
                            e.currentTarget.style.borderColor = '#800000';
                            e.currentTarget.style.boxShadow = '0 4px 8px rgba(128, 0, 0, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.borderColor = '#ddd';
                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                        }}
                    >
                        <FcGoogle style={{ fontSize: '24px' }} />
                        <span>Continue with Google</span>
                    </button>

                    {/* Privacy Notice */}
                    <p style={{
                        fontSize: '0.75rem',
                        color: '#999',
                        textAlign: 'center',
                        marginTop: '24px',
                        marginBottom: 0
                    }}>
                        By signing in, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>

                {/* Additional Info */}
                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                    <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>
                        New to SS Fashions?{' '}
                        <span style={{ color: '#800000', fontWeight: '600' }}>
                            Create an account automatically on first sign-in
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
