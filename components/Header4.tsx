'use client';

import React from 'react';

interface Header4Props {
    title: string;
    link: string;
    text: string;
    mainColor: string;
    secondaryColor: string;
    textColor: string;
    companyName: string;
}

const Header4: React.FC<Header4Props> = ({
    title,
    link,
    text,
    mainColor,
    secondaryColor,
    textColor,
    companyName,
}) => {
    return (
        <header
            style={{
                background: `linear-gradient(145deg, ${mainColor}, ${secondaryColor})`,
                color: textColor,
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                margin: '1.5rem 0',
                transition: 'transform 0.3s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
            <h4 style={{ margin: '0 0 0.5rem' }}>{title}</h4>
            <p style={{ margin: '0 0 1rem', lineHeight: '1.5' }}>{text}</p>
            <a
                href={link}
                style={{
                    color: textColor,
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    transition: 'background-color 0.3s ease',
                }}
                onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.5)')
                }
                onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)')
                }
            >
                Link
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
        </header>
    );
};

export default Header4;
