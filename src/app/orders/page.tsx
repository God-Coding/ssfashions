import { auth } from '@/auth';
import { getPool } from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getUserOrders(email: string) {
    try {
        const pool = await getPool();
        const userResult = await pool.request()
            .input('email', email)
            .query("SELECT UserID FROM Users WHERE Email = @email");

        if (userResult.recordset.length === 0) return [];

        const userId = userResult.recordset[0].UserID;

        const result = await pool.request()
            .input('userId', userId)
            .query(`
                SELECT o.*, s.Name as SareeName, s.ImageURL 
                FROM Orders o
                JOIN Sarees s ON o.SareeID = s.SareeID
                WHERE o.UserID = @userId
                ORDER BY o.OrderDate DESC
            `);

        return result.recordset;
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
}

export default async function OrdersPage() {
    const session = await auth();

    if (!session?.user?.email) {
        redirect('/');
    }

    const orders = await getUserOrders(session.user.email);

    return (
        <div className="container" style={{ padding: '40px 20px', minHeight: '60vh' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '30px', borderBottom: '2px solid #800000', paddingBottom: '10px', display: 'inline-block' }}>
                My Orders
            </h1>

            {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    <p style={{ fontSize: '1.2rem' }}>You haven&apos;t placed any orders yet.</p>
                    <Link href="/" style={{
                        display: 'inline-block',
                        marginTop: '20px',
                        padding: '10px 20px',
                        backgroundColor: '#800000',
                        color: '#fff',
                        textDecoration: 'none',
                        borderRadius: '5px',
                        fontSize: '1rem'
                    }}>
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {orders.map((order: any) => {
                        const imageUrl = order.ImageURL ? order.ImageURL.split(',')[0].trim() : '';
                        return (
                            <div key={order.OrderID} style={{
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                padding: '20px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                backgroundColor: '#fff'
                            }}>
                                {/* Link to product page or order details if available */}
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={imageUrl}
                                        alt={order.SareeName}
                                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', marginRight: '15px' }}
                                    />
                                    <div>
                                        <h2 style={{ fontSize: '1.3rem', margin: '0 0 5px 0', color: '#333' }}>{order.SareeName}</h2>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.9rem',
                                            backgroundColor: order.Status === 'Delivered' ? '#e6ffe6' : '#fff3cd',
                                            color: order.Status === 'Delivered' ? '#006600' : '#856404'
                                        }}>
                                            {order.Status}
                                        </span>
                                    </div>
                                </div>
                                <p style={{ margin: '5px 0', color: '#666' }}>Order ID: #{order.OrderID}</p>
                                <p style={{ margin: '5px 0', fontWeight: 'bold' }}>Amount: ₹{order.Amount}</p>
                                <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#555' }}>Placed on: {new Date(order.OrderDate).toLocaleDateString()}</p>
                                <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#555' }}>Payment: {order.PaymentMethod} ({order.PaymentStatus})</p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
