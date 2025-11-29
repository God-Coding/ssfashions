import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import sql from 'mssql';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { sareeId, amount, paymentMethod, shippingAddress, userEmail } = body;

        if (!sareeId || !amount || !paymentMethod || !shippingAddress) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const pool = await getPool();

        let userId = null;
        if (userEmail) {
            const userResult = await pool.request()
                .input('email', sql.NVarChar, userEmail)
                .query("SELECT UserID FROM Users WHERE Email = @email");
            if (userResult.recordset.length > 0) {
                userId = userResult.recordset[0].UserID;
            }
        }

        // Insert order
        const result = await pool.request()
            .input('userId', sql.Int, userId) // Use resolved userId
            .input('sareeId', sql.Int, sareeId)
            .input('amount', sql.Decimal(10, 2), amount)
            .input('paymentMethod', sql.NVarChar, paymentMethod)
            .input('paymentStatus', sql.NVarChar, paymentMethod === 'COD' ? 'Pending' : 'Paid')
            .input('shippingAddress', sql.NVarChar, shippingAddress)
            .query(`
                INSERT INTO Orders (UserID, SareeID, Amount, PaymentMethod, PaymentStatus, ShippingAddress)
                OUTPUT INSERTED.OrderID
                VALUES (@userId, @sareeId, @amount, @paymentMethod, @paymentStatus, @shippingAddress)
            `);

        const orderId = result.recordset[0].OrderID;

        return NextResponse.json({
            success: true,
            orderId,
            message: 'Order placed successfully'
        });

    } catch (error) {
        console.error('Error placing order:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
