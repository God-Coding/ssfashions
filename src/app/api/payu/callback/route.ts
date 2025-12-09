import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import sql from 'mssql';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        console.log('PayU callback received');

        // Get raw body text
        const bodyText = await request.text();
        console.log('Raw body received, length:', bodyText.length);

        let data: any = {};
        const contentType = request.headers.get('content-type') || '';
        console.log('Content-Type:', contentType);

        // Parse based on content type
        if (contentType.includes('application/json')) {
            data = JSON.parse(bodyText);
            console.log('Parsed as JSON');
        } else if (contentType.includes('application/x-www-form-urlencoded') || bodyText.includes('=')) {
            // Parse URL-encoded data manually
            const params = new URLSearchParams(bodyText);
            data = Object.fromEntries(params.entries());
            console.log('Parsed as URL-encoded');
        } else {
            // Try to parse as JSON anyway
            try {
                data = JSON.parse(bodyText);
                console.log('Parsed as JSON (fallback)');
            } catch {
                console.error('Could not parse body, treating as URL-encoded');
                const params = new URLSearchParams(bodyText);
                data = Object.fromEntries(params.entries());
            }
        }

        console.log('Callback data received:', {
            status: data.status,
            txnid: data.txnid,
            amount: data.amount
        });

        // Log ALL fields to see what PayU is actually sending
        console.log('All webhook fields:', Object.keys(data));

        // Extract PayU response parameters using CORRECT field names from webhook
        const status = data.status;
        const txnid = data.merchantTransactionId; // PayU uses merchantTransactionId, not txnid
        const amount = data.amount;
        const productinfo = data.productInfo; // PayU uses productInfo (capital I)
        const firstname = data.customerName; // PayU uses customerName
        const email = data.customerEmail; // PayU uses customerEmail
        const mihpayid = data.paymentId; // PayU uses paymentId
        const hash = data.hash;

        // UDF fields containing order details
        const sareeId = data.udf1;
        const shippingAddress = data.udf2;
        const userEmail = data.udf3;
        const udf4 = data.udf4 || '';
        const udf5 = data.udf5 || '';

        console.log('Extracted values:', {
            status,
            txnid,
            amount,
            mihpayid,
            sareeId,
            shippingAddress,
            userEmail
        });

        const merchantSalt = process.env.PAYU_MERCHANT_SALT;
        const merchantKey = process.env.PAYU_MERCHANT_KEY;

        if (!merchantSalt || !merchantKey) {
            console.error('PayU configuration missing');
            return NextResponse.redirect(new URL('/payment/failure?error=config', request.url));
        }

        // Verify hash for security
        // PayU Webhook hash format: salt|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
        // Note: status should be lowercase in hash calculation
        const statusLower = status?.toLowerCase() || 'success';
        const reverseHashString = `${merchantSalt}|${statusLower}||||||${udf5}|${udf4}|${userEmail}|${shippingAddress}|${sareeId}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${merchantKey}`;
        const calculatedHash = crypto.createHash('sha512').update(reverseHashString).digest('hex');

        console.log('PayU Callback - Hash Verification:', {
            status: statusLower,
            txnid,
            receivedHash: hash,
            calculatedHash,
            hashMatch: calculatedHash === hash
        });

        if (calculatedHash !== hash) {
            console.error('Hash mismatch - possible tampering');
            console.error('Hash string used:', reverseHashString);
            return NextResponse.redirect(new URL('/payment/failure?error=hash', request.url));
        }

        // If payment is successful, create order
        // Use case-insensitive comparison since PayU sends 'Success' but we use 'success' for hash
        if (status?.toLowerCase() === 'success') {
            console.log('Payment successful, creating order...');
            console.log('Order details:', { sareeId, amount, userEmail, shippingAddress, mihpayid });

            try {
                const pool = await getPool();
                console.log('Database connection successful');

                // Get user ID if email exists
                let userId = null;
                console.log('Looking up user by email:', userEmail);
                if (userEmail) {
                    const userResult = await pool.request()
                        .input('email', sql.NVarChar, userEmail)
                        .query("SELECT UserID, Name, Email FROM Users WHERE Email = @email");
                    console.log('User query result:', userResult.recordset);
                    if (userResult.recordset.length > 0) {
                        userId = userResult.recordset[0].UserID;
                        console.log('✅ User found! UserID:', userId, 'Name:', userResult.recordset[0].Name);
                    } else {
                        console.log('❌ User not found for email:', userEmail);
                        console.log('⚠️ Order will be created without UserID. User needs to sign in with this email to see the order.');
                    }
                } else {
                    console.log('❌ No userEmail provided in webhook data');
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
