import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export async function GET() {
    try {
        const pool = await getPool();
        const result = await pool.request().query("SELECT TOP 20 * FROM Sarees ORDER BY UploadDate DESC");
        return NextResponse.json(result.recordset);
    } catch (error) {
        console.error('Error fetching latest sarees:', error);
        return NextResponse.json({ error: 'Failed to fetch latest sarees' }, { status: 500 });
    }
}
