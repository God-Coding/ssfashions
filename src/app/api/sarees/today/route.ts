import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export async function GET() {
    try {
        const pool = await getPool();
        const result = await pool.request().query("SELECT * FROM Sarees WHERE CONVERT(date, UploadDate) = CONVERT(date, GETDATE())");
        return NextResponse.json(result.recordset);
    } catch (error) {
        console.error('Error fetching today sarees:', error);
        return NextResponse.json({ error: 'Failed to fetch today\'s sarees' }, { status: 500 });
    }
}
