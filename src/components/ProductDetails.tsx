'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Saree {
    SareeID: number;
    Name: string;
    Price: number;
    ImageURL: string;
    Description: string;
}

export default function ProductDetails({ saree, userEmail }: { saree: Saree, userEmail?: string | null }) {
    const [showPayment, setShowPayment] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Split comma-separated URLs and filter empty strings
    const images = saree.ImageURL ? saree.ImageURL.split(',').map(url => url.trim()).filter(Boolean) : [];

    const handleOrder = async () => {
        if (!address) {
            alert('Please enter your shipping address.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sareeId: saree.SareeID,
                    amount: saree.Price,
                    paymentMethod,
                    shippingAddress: address,
                    userEmail: userEmail // Pass email to API
                }),
            });

            const data = await response.json();

            if (data.success) {
                alert(`Order placed successfully! Order ID: ${data.orderId}`);
                setShowPayment(false);
                setAddress('');
                // router.push('/orders'); // Redirect to orders page if it exists
            } else {
                alert('Failed to place order: ' + data.error);
            }
        } catch (error) {
            console.error('Order error:', error);
            alert('An error occurred while placing the order.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ padding: '40px 20px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
                {/* Image Section */}
                <div className="product-images" style={{ flex: '1 1 400px', maxWidth: '600px' }}>
                    <style jsx>{`
                        .image-container {
                            display: flex;
                            flex-direction: column;
                            gap: 20px;
                        }
                        .carousel-view {
                            display: none;
                        }
                        .desktop-view {
                            display: flex;
                            flex-direction: column;
                            gap: 20px;
                        }
                        
                        @media (max-width: 768px) {
                            .desktop-view {
                                display: none;
                            }
                            .carousel-view {
                                display: flex;
                                overflow-x: auto;
                                scroll-snap-type: x mandatory;
                                gap: 10px;
                                padding-bottom: 10px;
                                scrollbar-width: thin;
                            }
                            .carousel-item {
                                flex: 0 0 100%;
                                scroll-snap-align: start;
                            }
                        }
                    `}</style>

                    {/* Desktop View: Stacked */}
                    <div className="desktop-view">
                        {images.map((img, index) => (
                            <div key={`desktop-${index}`}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={img}
                                    alt={`${saree.Name} - View ${index + 1}`}
                                    style={{ width: '100%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Mobile View: Carousel */}
                    <div className="carousel-view">
                        {images.map((img, index) => (
                            <div key={`mobile-${index}`} className="carousel-item">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={img}
                                    alt={`${saree.Name} - View ${index + 1}`}
                                    style={{ width: '100%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                                />
                            </div>
                        ))}
                    </div>

                    {images.length > 1 && (
                        <p className="carousel-view" style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem', marginTop: '5px', width: '100%' }}>
                            Swipe to see more images
                        </p>
                    )}
                </div>

                {/* Details Section */}
                <div style={{ flex: '1 1 400px' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>{saree.Name}</h1>
                    <p style={{ fontSize: '1.5rem', color: '#800000', fontWeight: 'bold', marginBottom: '20px' }}>
                        ₹{saree.Price}
                    </p>
                    <p style={{ lineHeight: '1.6', marginBottom: '30px', color: '#555' }}>
                        {saree.Description || 'No description available.'}
                    </p>

                    {!showPayment ? (
                        <button
                            className="btn btn-primary"
                            style={{ fontSize: '1.2rem', padding: '15px 40px', backgroundColor: '#800000', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                            onClick={() => setShowPayment(true)}
                        >
                            Buy Now
                        </button>
                    ) : (
                        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', backgroundColor: '#fff' }}>
                            <h3 style={{ marginBottom: '15px' }}>Checkout</h3>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Shipping Address</label>
                                <textarea
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Enter your full address with pincode"
                                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '80px' }}
                                />
                            </div>

                            <h4 style={{ marginBottom: '10px' }}>Payment Method</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', border: '1px solid #eee', borderRadius: '4px', cursor: 'pointer', backgroundColor: paymentMethod === 'COD' ? '#f9f9f9' : 'white' }}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="COD"
                                        checked={paymentMethod === 'COD'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    Cash on Delivery (COD)
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', border: '1px solid #eee', borderRadius: '4px', cursor: 'pointer', backgroundColor: paymentMethod === 'Online' ? '#f9f9f9' : 'white' }}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="Online"
                                        checked={paymentMethod === 'Online'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    Online Payment (UPI, Cards, NetBanking)
                                </label>
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    className="btn"
                                    style={{ flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '5px', cursor: 'pointer', backgroundColor: 'white' }}
                                    onClick={() => setShowPayment(false)}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-primary"
                                    style={{ flex: 2, padding: '10px', backgroundColor: '#800000', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
                                    onClick={handleOrder}
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : (paymentMethod === 'COD' ? 'Place Order' : 'Proceed to Pay')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
