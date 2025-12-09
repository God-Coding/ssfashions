import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { sareeId, sareeName, amount, userEmail, shippingAddress } = body;

        if (!sareeId || !amount || !shippingAddress) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // PayU credentials from environment
        const merchantKey = process.env.PAYU_MERCHANT_KEY;
        const merchantSalt = process.env.PAYU_MERCHANT_SALT;
        const payuBaseUrl = process.env.PAYU_BASE_URL;
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        if (!merchantKey || !merchantSalt || !payuBaseUrl) {
            return NextResponse.json(
                { error: 'PayU configuration missing' },
                { status: 500 }
            );
        }

        // Generate unique transaction ID
        const txnid = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;

        // Customer details
        const firstname = userEmail ? userEmail.split('@')[0] : 'Guest';
        const email = userEmail || 'guest@ssfashions.com';
        const phone = '0000000000'; // You might want to collect this in the form
        const productinfo = sareeName || `Saree #${sareeId}`;

        // Success and failure URLs
        const surl = `${appUrl}/payment/success`;
        const furl = `${appUrl}/payment/failure`;

        // Store order details in UDF fields for callback
        const udf1 = sareeId.toString();
        const udf2 = shippingAddress;
        const udf3 = userEmail || '';
        const udf4 = '';
        const udf5 = '';

        // Generate hash
        // Hash format: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt
        const hashString = `${merchantKey}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${merchantSalt}`;
        const hash = crypto.createHash('sha512').update(hashString).digest('hex');

        // Return payment form data
        return NextResponse.json({
            success: true,
            paymentData: {
                key: merchantKey,
                txnid,
                amount: amount.toString(),
                productinfo,
                firstname,
                email,
                phone,
                surl,
                furl,
                hash,
                udf1, // sareeId
                udf2, // shippingAddress
                udf3, // userEmail
                udf4: '',
                udf5: '',
                service_provider: 'payu_paisa',
            },
            payuUrl: payuBaseUrl
        });

    } catch (error) {
        console.error('Error initiating PayU payment:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
