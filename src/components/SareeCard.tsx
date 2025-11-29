'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import styles from './SareeCard.module.css'; // Assuming CSS module exists or using inline styles if not found. I'll use inline styles to be safe as I saw inline styles in previous versions or standard class names. 
// Actually, I saw styles.card in previous code, so I'll stick to that but I'll also check if I need to define styles inline if module is missing. 
// The previous code used styles.card, so I will assume it exists.

interface Saree {
    SareeID: number;
    Name: string;
    Price: number;
    ImageURL: string;
    PurchaseCount?: number;
}

interface SareeCardProps {
    saree: Saree;
    isTrending?: boolean;
}

export default function SareeCard({ saree, isTrending }: SareeCardProps) {
    const { data: session } = useSession();
    const [inWishlist, setInWishlist] = useState(false);
    const [loading, setLoading] = useState(false);

    // Parse ImageURL to get the first image
    const imageUrl = saree.ImageURL ? saree.ImageURL.split(',')[0].trim() : '';

    useEffect(() => {
        if (session?.user) {
            checkWishlistStatus();
        }
    }, [session, saree.SareeID]);

    const checkWishlistStatus = async () => {
        try {
            const res = await fetch('/api/wishlist');
            if (res.ok) {
                const wishlist = await res.json();
                setInWishlist(wishlist.some((item: any) => item.SareeID === saree.SareeID));
            }
        } catch (error) {
            console.error('Error checking wishlist:', error);
        }
    };

    const toggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!session?.user) {
            alert('Please sign in to add items to your wishlist');
            return;
        }

        setLoading(true);

        try {
            if (inWishlist) {
                const res = await fetch('/api/wishlist', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sareeId: saree.SareeID })
                });

                if (res.ok) {
                    setInWishlist(false);
                }
            } else {
                const res = await fetch('/api/wishlist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sareeId: saree.SareeID })
                });

                if (res.ok) {
                    setInWishlist(true);
                }
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Link href={`/product/${saree.SareeID}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{
                border: '1px solid #eee',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#fff',
                transition: 'transform 0.2s',
                position: 'relative',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ position: 'relative', paddingTop: '133%' /* 3:4 Aspect Ratio */ }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={imageUrl}
                        alt={saree.Name}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                    {isTrending && (
                        <span style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            backgroundColor: '#800000',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            fontWeight: 'bold'
                        }}>
                            Trending
                        </span>
                    )}
                    <button
                        onClick={toggleWishlist}
                        disabled={loading}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            left: '10px',
                            background: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '36px',
                            height: '36px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '1.2rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            zIndex: 2,
                            opacity: loading ? 0.7 : 1
                        }}
                        title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        {inWishlist ? '❤️' : '🤍'}
                    </button>
                </div>
                <div style={{ padding: '15px', flexGrow: 1 }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', fontWeight: 600 }}>{saree.Name}</h3>
                    <p style={{ margin: 0, color: '#800000', fontWeight: 'bold', fontSize: '1.2rem' }}>₹{saree.Price}</p>
                </div>
            </div>
        </Link>
    );
}
