import { getPool } from '@/lib/db';
import sql from 'mssql';
import ProductDetails from '@/components/ProductDetails';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getSaree(id: string) {
    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query("SELECT * FROM Sarees WHERE SareeID = @id");

        return result.recordset[0];
    } catch (error) {
        console.error('Error fetching saree:', error);
        return null;
    }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const saree = await getSaree(id);
    const session = await auth();

    if (!saree) {
        notFound();
    }

    return <ProductDetails saree={saree} userEmail={session?.user?.email} />;
}
