import { getPool } from '@/lib/db';
import SareeCard from '@/components/SareeCard';

// Force dynamic rendering since we are fetching data from DB that changes
export const dynamic = 'force-dynamic';

async function getTodaySarees() {
  try {
    const pool = await getPool();
    const result = await pool.request().query("SELECT * FROM Sarees WHERE CONVERT(date, UploadDate) = CONVERT(date, GETDATE())");
    return result.recordset;
  } catch (error) {
    console.error('Error fetching today sarees:', error);
    return [];
  }
}

async function getTrendingSarees() {
  try {
    const pool = await getPool();
    const result = await pool.request().query("SELECT TOP 10 * FROM Sarees ORDER BY PurchaseCount DESC");
    return result.recordset;
  } catch (error) {
    console.error('Error fetching trending sarees:', error);
    return [];
  }
}

async function getLatestSarees() {
  try {
    const pool = await getPool();
    const result = await pool.request().query("SELECT TOP 20 * FROM Sarees ORDER BY UploadDate DESC");
    return result.recordset;
  } catch (error) {
    console.error('Error fetching latest sarees:', error);
    return [];
  }
}

export default async function Home() {
  const todaySarees = await getTodaySarees();
  const trendingSarees = await getTrendingSarees();
  const latestSarees = await getLatestSarees();

  return (
    <div className="container">
      {/* Hero Section (Optional) */}
      <div style={{ textAlign: 'center', padding: '60px 0', backgroundColor: '#fdfbf7', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Welcome to SS Fashions</h1>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>Discover the elegance of premium ethnic wear</p>
      </div>

      {/* Today's Uploads */}
      <section>
        <h2 className="section-title">Today&apos;s Collection</h2>
        {todaySarees.length > 0 ? (
          <div className="grid-container">
            {todaySarees.map((saree: any) => (
              <SareeCard key={saree.SareeID} saree={saree} />
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#888' }}>No new uploads today.</p>
        )}
      </section>

      {/* Trending Sarees */}
      <section>
        <h2 className="section-title">Trending Now</h2>
        <div className="trending-scroll-container" style={{
          display: 'flex',
          overflowX: 'auto',
          gap: '20px',
          padding: '20px 0',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'thin'
        }}>
          {trendingSarees.map((saree: any) => (
            <div key={saree.SareeID} style={{
              flex: '0 0 300px', // Fixed width for cards
              scrollSnapAlign: 'start'
            }}>
              <SareeCard saree={saree} isTrending={true} />
            </div>
          ))}
        </div>
      </section>

      {/* Latest Sarees */}
      <section>
        <h2 className="section-title">Latest Arrivals</h2>
        <div className="grid-container">
          {latestSarees.map((saree: any) => (
            <SareeCard key={saree.SareeID} saree={saree} />
          ))}
        </div>
      </section>
    </div>
  );
}
