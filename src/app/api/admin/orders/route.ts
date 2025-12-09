import { auth } from '@/auth';
import { getPool } from '@/lib/db';
import { NextResponse } from 'next/server';
import sql from 'mssql';

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const pool = await getPool();

        // Check if user is admin
        const userCheck = await pool.request()
            .input('email', sql.NVarChar, session.user.email)
            .query("SELECT IsAdmin FROM Users WHERE Email = @email");

        if (!userCheck.recordset[0]?.IsAdmin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Fetch all orders with user details
        const result = await pool.request().query(`
            SELECT 
                o.OrderID, o.OrderDate, o.Status, o.Amount, o.PaymentMethod, o.PaymentStatus,
                s.Name as SareeName, s.ImageURL,
                u.Name as UserName, u.Email as UserEmail,
                o.ShippingAddress as Address
            FROM Orders o
            LEFT JOIN Sarees s ON o.SareeID = s.SareeID
            LEFT JOIN Users u ON o.UserID = u.UserID
            ORDER BY o.OrderDate DESC
        `);

        return NextResponse.json(result.recordset);
    } catch (error) {
        console.error('Error fetching admin orders:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const pool = await getPool();

        // Check if user is admin
        const userCheck = await pool.request()
            .input('email', sql.NVarChar, session.user.email)
            .query("SELECT IsAdmin FROM Users WHERE Email = @email");

        if (!userCheck.recordset[0]?.IsAdmin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { orderId, status } = await req.json();

        await pool.request()
            .input('orderId', sql.Int, orderId)
            .input('status', sql.NVarChar, status)
            .query("UPDATE Orders SET Status = @status WHERE OrderID = @orderId");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
