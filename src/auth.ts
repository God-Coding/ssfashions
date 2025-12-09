import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import sql from "mssql"

const sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    server: process.env.DB_SERVER || '',
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            try {
                const pool = await sql.connect(sqlConfig);

                // Check if user exists
                const result = await pool.request()
                    .input('email', sql.NVarChar, user.email)
                    .query('SELECT UserID FROM Users WHERE Email = @email');

                if (result.recordset.length === 0) {
                    // Create new user
                    await pool.request()
                        .input('email', sql.NVarChar, user.email)
                        .input('name', sql.NVarChar, user.name)
                        .input('image', sql.NVarChar, user.image)
                        .query('INSERT INTO Users (Email, Name, Image) VALUES (@email, @name, @image)');

                    console.log('New user created:', user.email);
                } else {
                    // Update existing user info
                    await pool.request()
                        .input('email', sql.NVarChar, user.email)
                        .input('name', sql.NVarChar, user.name)
                        .input('image', sql.NVarChar, user.image)
                        .query('UPDATE Users SET Name = @name, Image = @image WHERE Email = @email');
                }

                return true;
            } catch (error) {
                console.error('Error in signIn callback:', error);
                return false;
            }
        },
        async session({ session, token }) {
            if (session.user) {
                try {
                    const pool = await sql.connect(sqlConfig);
                    const result = await pool.request()
                        .input('email', sql.NVarChar, session.user.email)
                        .query('SELECT UserID FROM Users WHERE Email = @email');

                    if (result.recordset.length > 0) {
                        (session.user as any).id = result.recordset[0].UserID;
                    }
                } catch (error) {
                    console.error('Error in session callback:', error);
                }
            }
            return session;
        }
    },
    pages: {
        signIn: '/auth/signin',
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production'
            }
        }
    }
})
