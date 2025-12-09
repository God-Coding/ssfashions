'use client';

interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
    color?: string;
}

export default function LoadingSpinner({ size = 'medium', color = '#800000' }: LoadingSpinnerProps) {
    const sizeMap = {
        small: '20px',
        medium: '40px',
        large: '60px'
    };

    return (
        <div style={{
            display: 'inline-block',
            width: sizeMap[size],
            height: sizeMap[size],
            border: `3px solid rgba(128, 0, 0, 0.1)`,
            borderTop: `3px solid ${color}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
        }}>
            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
