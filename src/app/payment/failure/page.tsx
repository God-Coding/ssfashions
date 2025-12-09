'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

function PaymentFailureContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [txnId, setTxnId] = useState<string | null>(null);
    const [status, setStatus] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setTxnId(searchParams.get('txnid'));
        setStatus(searchParams.get('status'));
        setError(searchParams.get('error'));
    }, [searchParams]);

    const getErrorMessage = () => {
        if (error === 'hash') return 'Security verification failed. Please try again.';
        if (error === 'config') return 'Payment gateway configuration error. Please contact support.';
        if (error === 'server') return 'Server error occurred. Please try again.';
        if (status === 'failure') return 'Payment was declined. Please check your payment details and try again.';
        if (status === 'cancel') return 'Payment was cancelled.';
        return 'Payment could not be processed. Please try again.';
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                maxWidth: '500px',
                width: '100%',
                textAlign: 'center'
            }}>
                {/* Failure Icon */}
                <div style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: '#f44336',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    fontSize: '40px',
                    color: 'white'
                }}>
                    ✕
                </div>

                <h1 style={{
                    color: '#f44336',
                    marginBottom: '10px',
                    fontSize: '2rem'
                }}>
                    Payment Failed
                </h1>

                <p style={{
                    color: '#666',
                    marginBottom: '30px',
                    fontSize: '1.1rem'
                }}>
                    {getErrorMessage()}
                </p>

                {txnId && (
                    <div style={{
                        backgroundColor: '#f9f9f9',
                        padding: '15px',
                        borderRadius: '8px',
                        marginBottom: '20px'
                    }}>
                        <p style={{ margin: '5px 0', color: '#666', fontSize: '0.9rem' }}>
                            Transaction ID: {txnId}
                        </p>
                    </div>
                )}

                <div style={{
                    backgroundColor: '#e3f2fd',
                    border: '1px solid #2196F3',
                    borderRadius: '8px',
                    padding: '15px',
                    marginBottom: '30px',
                    textAlign: 'left'
                }}>
                    <p style={{ margin: '5px 0', fontSize: '0.95rem', color: '#1565c0' }}>
                        💡 <strong>Tips:</strong>
                    </p>
                    <ul style={{ margin: '10px 0', paddingLeft: '20px', color: '#1565c0', fontSize: '0.9rem' }}>
                        <li>Check if you have sufficient balance</li>
                        <li>Verify your card/UPI details</li>
                        <li>Try a different payment method</li>
                        <li>Contact your bank if issue persists</li>
                    </ul>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => router.back()}
                        style={{
                            flex: 1,
                            padding: '12px 24px',
                            backgroundColor: '#800000',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            minWidth: '150px'
                        }}
                    >
                        Try Again
                    </button>
                    <Link
                        href="/"
                        style={{
                            flex: 1,
                            padding: '12px 24px',
                            backgroundColor: 'white',
                            color: '#800000',
                            textDecoration: 'none',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            border: '2px solid #800000',
                            minWidth: '150px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        Go Home
                    </Link>
                </div>

                <p style={{
                    marginTop: '20px',
                    fontSize: '0.9rem',
                    color: '#999'
                }}>
                    Need help? Contact us on WhatsApp:
                    <a
                        href="https://wa.me/918179572442"
                        target="_blank"
                        style={{ color: '#800000', marginLeft: '5px' }}
                    >
                        8179572442
                    </a>
                </p>
            </div>
        </div>
    );
}

export default function PaymentFailure() {
    return (
        <Suspense fallback={
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f5f5f5'
            }}>
                <div>Loading...</div>
            </div>
        }>
            <PaymentFailureContent />
        </Suspense>
    );
}
