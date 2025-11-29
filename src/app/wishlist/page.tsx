'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface WishlistItem {
    SareeID: number;
    Name: string;
    Price: number;
    ImageURL: string;
}

export default function WishlistPage() {
    const { data: session, status } = useSession();
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'authenticated') {
            fetchWishlist();
        } else if (status === 'unauthenticated') {
            setLoading(false);
        }
    }, [status]);

    const fetchWishlist = async () => {
        try {
            const res = await fetch('/api/wishlist');
            if (res.ok) {
                const data = await res.json();
                setWishlist(data);
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (sareeId: number) => {
        try {
            const res = await fetch('/api/wishlist', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sareeId })
            });

            if (res.ok) {
                setWishlist(wishlist.filter(item => item.SareeID !== sareeId));
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>
                <p>Loading...</p>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>
                <h1 className="section-title">My Wishlist</h1>
                <p style={{ fontSize: '1.2rem', color: '#888', marginTop: '40px' }}>
                    Please sign in to view your wishlist
                </p>
                <Link href="/" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>
                    Go to Homepage
                </Link>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '40px 20px' }}>
            <h1 className="section-title">My Wishlist</h1>

            {wishlist.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <p style={{ fontSize: '1.2rem', color: '#888', marginBottom: '20px' }}>
                        Your wishlist is empty
                    </p>
                    <Link href="/" className="btn btn-primary">
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className="grid-container">
                    {wishlist.map((item) => (
                        <div key={item.SareeID} className="card">
                            <div style={{ position: 'relative', height: '300px' }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={item.ImageURL}
                                    alt={item.Name}
                                    className="card-image"
                                />
                                <button
                                    onClick={() => handleRemove(item.SareeID)}
                                    style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        background: 'white',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '40px',
                                        height: '40px',
                                        cursor: 'pointer',
                                        fontSize: '1.2rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                        zIndex: 2
                                    }}
                                    title="Remove from wishlist"
                                >
                                    ❌
                                </button>
                            </div>
                            <div className="card-content">
                                <h3 className="card-title">{item.Name}</h3>
                                <p className="card-price">₹{item.Price}</p>
                                <Link href={`/product/${item.SareeID}`} className="btn btn-primary" style={{ marginTop: '10px', display: 'inline-block' }}>
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
