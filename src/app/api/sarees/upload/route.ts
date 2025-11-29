import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import sql from 'mssql';

export async function POST(request: Request) {
    try {
        const { name, price, imageUrl, description } = await request.json();

        if (!name || !price || !imageUrl) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const pool = await getPool();
        await pool.request()
            .input('name', sql.NVarChar, name)
            .input('price', sql.Decimal(10, 2), price)
            .input('imageUrl', sql.NVarChar, imageUrl)
            .input('description', sql.NVarChar, description || '')
            .query("INSERT INTO Sarees (Name, Price, ImageURL, Description) VALUES (@name, @price, @imageUrl, @description)");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error uploading saree:', error);
        return NextResponse.json({ error: 'Failed to upload saree' }, { status: 500 });
    }
}
