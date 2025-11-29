import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import sql from 'mssql';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const pool = await getPool();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query("SELECT * FROM Sarees WHERE SareeID = @id");

        if (result.recordset.length === 0) {
            return NextResponse.json({ error: 'Saree not found' }, { status: 404 });
        }

        return NextResponse.json(result.recordset[0]);
    } catch (error) {
        console.error('Error fetching saree details:', error);
        return NextResponse.json({ error: 'Failed to fetch saree details' }, { status: 500 });
    }
}
