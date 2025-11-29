'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminOrdersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/');
        } else if (status === 'authenticated') {
            fetchOrders();
        }
    }, [status, router]);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/admin/orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            } else {
                // Handle forbidden or error
                if (res.status === 403) {
                    alert('Access Denied: You are not an admin.');
                    router.push('/');
                }
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId: number, newStatus: string) => {
        try {
            const res = await fetch('/api/admin/orders', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, status: newStatus })
            });

            if (res.ok) {
                // Refresh orders
                fetchOrders();
            } else {
                alert('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

    return (
        <div className="container" style={{ padding: '40px 20px', minHeight: '80vh' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '30px', borderBottom: '2px solid #800000', paddingBottom: '10px', display: 'inline-block' }}>
                Admin Dashboard - Orders
            </h1>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Order ID</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Customer</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Product</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Amount</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order: any) => (
                            <tr key={order.OrderID} style={{ borderBottom: '1px solid #dee2e6' }}>
                                <td style={{ padding: '12px' }}>#{order.OrderID}</td>
                                <td style={{ padding: '12px' }}>{new Date(order.OrderDate).toLocaleDateString()}</td>
                                <td style={{ padding: '12px' }}>
                                    <div style={{ fontWeight: 'bold' }}>{order.UserName || 'Unknown User'}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#666' }}>{order.UserEmail || 'No Email'}</div>
                                </td>
                                <td style={{ padding: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={order.ImageURL ? order.ImageURL.split(',')[0] : '/placeholder.jpg'}
                                            alt={order.SareeName || 'Unknown Saree'}
                                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                                        />
                                        <span>{order.SareeName || 'Unknown Saree'}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '12px' }}>₹{order.Amount}</td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.85rem',
                                        backgroundColor:
                                            order.Status === 'Delivered' ? '#d4edda' :
                                                order.Status === 'Shipped' ? '#cce5ff' :
                                                    '#fff3cd',
                                        color:
                                            order.Status === 'Delivered' ? '#155724' :
                                                order.Status === 'Shipped' ? '#004085' :
                                                    '#856404'
                                    }}>
                                        {order.Status}
                                    </span>
                                </td>
                                <td style={{ padding: '12px' }}>
                                    <select
                                        value={order.Status}
                                        onChange={(e) => updateStatus(order.OrderID, e.target.value)}
                                        style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ced4da' }}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
