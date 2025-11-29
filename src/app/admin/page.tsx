import AdminUploadForm from '@/components/AdminUploadForm';

export const metadata = {
    title: 'Admin Panel - SS Fashions',
};

export default function AdminPage() {
    return (
        <div className="container" style={{ padding: '40px 0' }}>
            <AdminUploadForm />
        </div>
    );
}
