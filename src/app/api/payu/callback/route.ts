import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import sql from 'mssql';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        // Extract PayU response parameters
        const status = formData.get('status')?.toString();
        const txnid = formData.get('txnid')?.toString();
        const amount = formData.get('amount')?.toString();
        const productinfo = formData.get('productinfo')?.toString();
        const firstname = formData.get('firstname')?.toString();
        const email = formData.get('email')?.toString();
        const mihpayid = formData.get('mihpayid')?.toString(); // PayU payment ID
        const hash = formData.get('hash')?.toString();

        // UDF fields containing order details
        const sareeId = formData.get('udf1')?.toString();
        const shippingAddress = formData.get('udf2')?.toString();
        const userEmail = formData.get('udf3')?.toString();
        const udf4 = formData.get('udf4')?.toString() || '';
        const udf5 = formData.get('udf5')?.toString() || '';

        const merchantSalt = process.env.PAYU_MERCHANT_SALT;
        const merchantKey = process.env.PAYU_MERCHANT_KEY;

        if (!merchantSalt || !merchantKey) {
            console.error('PayU configuration missing');
            return NextResponse.redirect(new URL('/payment/failure?error=config', request.url));
        }

        // Verify hash for security
        // Reverse hash format: salt|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
        const reverseHashString = `${merchantSalt}|${status}||||||${udf5}|${udf4}|${userEmail}|${shippingAddress}|${sareeId}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${merchantKey}`;
        const calculatedHash = crypto.createHash('sha512').update(reverseHashString).digest('hex');

        console.log('PayU Callback - Hash Verification:', {
            status,
            txnid,
            receivedHash: hash,
            calculatedHash,
            hashMatch: calculatedHash === hash
        });

        if (calculatedHash !== hash) {
            console.error('Hash mismatch - possible tampering');
            return NextResponse.redirect(new URL('/payment/failure?error=hash', request.url));
        }

        // If payment is successful, create order
        if (status === 'success') {
            console.log('Payment successful, creating order...');
            console.log('Order details:', { sareeId, amount, userEmail, shippingAddress, mihpayid });

            try {
                const pool = await getPool();
                console.log('Database connection successful');

                // Get user ID if email exists
                let userId = null;
                if (userEmail) {
                    const userResult = await pool.request()
                        .input('email', sql.NVarChar, userEmail)
                        .query("SELECT UserID FROM Users WHERE Email = @email");
                    if (userResult.recordset.length > 0) {
                        userId = userResult.recordset[0].UserID;
                        console.log('User found:', userId);
                    } else {
                        console.log('User not found for email:', userEmail);
                    }
                }

                // Insert order
                console.log('Inserting order into database...');
                const result = await pool.request()
                    .input('userId', sql.Int, userId)
                    .input('sareeId', sql.Int, parseInt(sareeId || '0'))
                    .input('amount', sql.Decimal(10, 2), parseFloat(amount || '0'))
                    .input('paymentMethod', sql.NVarChar, 'Online')
                    .input('paymentStatus', sql.NVarChar, 'Paid')
                    .input('shippingAddress', sql.NVarChar, shippingAddress)
                    .input('transactionId', sql.NVarChar, mihpayid) // Store PayU payment ID
                    .query(`
                        INSERT INTO Orders (UserID, SareeID, Amount, PaymentMethod, PaymentStatus, ShippingAddress, TransactionID)
                        OUTPUT INSERTED.OrderID
                        VALUES (@userId, @sareeId, @amount, @paymentMethod, @paymentStatus, @shippingAddress, @transactionId)
                    `);

                const orderId = result.recordset[0].OrderID;
                console.log('✅ Order created successfully! OrderID:', orderId);

                // Redirect to success page with order ID
                return NextResponse.redirect(new URL(`/payment/success?orderId=${orderId}&txnid=${txnid}`, request.url));
            } catch (dbError) {
                console.error('❌ DATABASE ERROR during order creation:', dbError);
                console.error('Error details:', {
                    message: (dbError as Error).message,
                    stack: (dbError as Error).stack
                });
                // Still redirect to success page but without order ID
                // This way user knows payment succeeded even if order creation failed
                return NextResponse.redirect(new URL(`/payment/success?txnid=${txnid}&error=db`, request.url));
            }
        } else {
            // Payment failed
            return NextResponse.redirect(new URL(`/payment/failure?txnid=${txnid}&status=${status}`, request.url));
        }

    } catch (error) {
        console.error('Error processing PayU callback:', error);
        return NextResponse.redirect(new URL('/payment/failure?error=server', request.url));
    }
}

// Handle GET requests (PayU might send GET in some cases)
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    // Convert query params to FormData and reuse POST logic
    const formData = new FormData();
    searchParams.forEach((value, key) => {
        formData.append(key, value);
    });

    // Create a new request with FormData
    const newRequest = new Request(request.url, {
        method: 'POST',
        body: formData,
    });

    return POST(newRequest);
}
