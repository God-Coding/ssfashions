'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const [orderId, setOrderId] = useState<string | null>(null);
    const [txnId, setTxnId] = useState<string | null>(null);

    useEffect(() => {
        setOrderId(searchParams.get('orderId'));
        setTxnId(searchParams.get('txnid'));
    }, [searchParams]);

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
                {/* Success Icon */}
                <div style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: '#4CAF50',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    fontSize: '40px',
                    color: 'white'
                }}>
                    ✓
                </div>

                <h1 style={{
                    color: '#4CAF50',
                    marginBottom: '10px',
                    fontSize: '2rem'
                }}>
                    Payment Successful!
                </h1>

                <p style={{
                    color: '#666',
                    marginBottom: '30px',
                    fontSize: '1.1rem'
                }}>
                    Thank you for your order. Your payment has been processed successfully.
                </p>

                {orderId && (
                    <div style={{
                        backgroundColor: '#f9f9f9',
                        padding: '20px',
                        borderRadius: '8px',
                        marginBottom: '20px'
                    }}>
                        <p style={{ margin: '5px 0', color: '#333' }}>
                            <strong>Order ID:</strong> {orderId}
                        </p>
                        {txnId && (
                            <p style={{ margin: '5px 0', color: '#666', fontSize: '0.9rem' }}>
                                Transaction ID: {txnId}
                            </p>
                        )}
                    </div>
                )}

                <div style={{
                    backgroundColor: '#fff3cd',
                    border: '1px solid #ffc107',
                    borderRadius: '8px',
                    padding: '15px',
                    marginBottom: '20px',
                    textAlign: 'left'
                }}>
                    <p style={{ margin: '5px 0', fontSize: '0.95rem', color: '#856404' }}>
                        📦 Your order will be processed and shipped within 2-3 business days.
                    </p>
                    <p style={{ margin: '5px 0', fontSize: '0.95rem', color: '#856404' }}>
                        📧 You will receive a confirmation email shortly.
                    </p>
                </div>

                <div style={{
                    backgroundColor: '#e3f2fd',
                    border: '1px solid #2196F3',
                    borderRadius: '8px',
                    padding: '15px',
                    marginBottom: '30px',
                    textAlign: 'left'
                }}>
                    <p style={{ margin: '5px 0', fontSize: '0.95rem', color: '#1565c0' }}>
                        ℹ️ <strong>Note:</strong> If you were signed out during payment, please sign in again to view your order in "My Orders" section.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <Link
                        href="/orders"
                        style={{
                            flex: 1,
                            padding: '12px 24px',
                            backgroundColor: '#800000',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            minWidth: '150px',
                            display: 'inline-block'
                        }}
                    >
                        View Orders
                    </Link>
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
                            display: 'inline-block'
                        }}
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function PaymentSuccess() {
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
            <PaymentSuccessContent />
        </Suspense>
    );
}
