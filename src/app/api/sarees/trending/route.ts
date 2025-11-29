import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export async function GET() {
    try {
        const pool = await getPool();
        const result = await pool.request().query("SELECT TOP 10 * FROM Sarees ORDER BY PurchaseCount DESC");
        return NextResponse.json(result.recordset);
    } catch (error) {
        console.error('Error fetching trending sarees:', error);
        return NextResponse.json({ error: 'Failed to fetch trending sarees' }, { status: 500 });
    }
}
