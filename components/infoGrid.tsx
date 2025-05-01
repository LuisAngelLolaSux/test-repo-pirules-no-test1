'use client';
import React from 'react';

interface InfoGridProps {
    title: string;
    link: string;
    text: string;
    mainColor: string;
    secondaryColor: string;
    textColor: string;
    companyName: string;
}

const infoGrid: React.FC<InfoGridProps> = ({
    title,
    link,
    text,
    mainColor,
    secondaryColor,
    textColor,
    companyName,
}) => {
    return (
        <div
            style={{
                background: '#fff',
                border: `1px solid ${secondaryColor}`,
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                color: textColor,
                margin: '1.5rem 0',
                transition: 'transform 0.3s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
            <h3 style={{ margin: '0 0 0.5rem' }}>{title}</h3>
            <p style={{ margin: '0 0 1rem', lineHeight: '1.5' }}>{text}</p>
            <a
                href={link}
                style={{
                    color: mainColor,
                    backgroundColor: 'rgba(0,0,0,0.05)',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    transition: 'background-color 0.3s ease',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.1)')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)')}
            >
                More info
            </a>
            <small
                style={{
                    display: 'block',
                    marginTop: '1rem',
                    fontStyle: 'italic',
                    opacity: 0.7,
                }}
            >
                {companyName}
            </small>
        </div>
    );
};

export default infoGrid;
