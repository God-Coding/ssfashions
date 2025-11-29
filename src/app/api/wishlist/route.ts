import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import sql from 'mssql';
import { auth } from '@/auth';

// Get user's wishlist
export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const pool = await getPool();
        const result = await pool.request()
            .input('userId', sql.Int, session.user.id)
            .query(`
        SELECT s.SareeID, s.Name, s.Price, s.ImageURL 
        FROM Wishlists w
        JOIN Sarees s ON w.SareeID = s.SareeID
        WHERE w.UserID = @userId
        ORDER BY w.AddedAt DESC
      `);

        return NextResponse.json(result.recordset);
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
    }
}

// Add to wishlist
export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { sareeId } = await request.json();

        const pool = await getPool();
        await pool.request()
            .input('userId', sql.Int, session.user.id)
            .input('sareeId', sql.Int, sareeId)
            .query('INSERT INTO Wishlists (UserID, SareeID) VALUES (@userId, @sareeId)');

        return NextResponse.json({ success: true });
    } catch (error: any) {
        if (error.number === 2627) { // Duplicate key error
            return NextResponse.json({ error: 'Already in wishlist' }, { status: 400 });
        }
        console.error('Error adding to wishlist:', error);
        return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 });
    }
}

// Remove from wishlist
export async function DELETE(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { sareeId } = await request.json();

        const pool = await getPool();
        await pool.request()
            .input('userId', sql.Int, session.user.id)
            .input('sareeId', sql.Int, sareeId)
            .query('DELETE FROM Wishlists WHERE UserID = @userId AND SareeID = @sareeId');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        return NextResponse.json({ error: 'Failed to remove from wishlist' }, { status: 500 });
    }
}
