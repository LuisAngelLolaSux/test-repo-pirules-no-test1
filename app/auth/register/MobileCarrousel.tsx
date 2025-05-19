'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface ISlide {
    slides: React.ReactNode[];
}

const MobileCarrousel = ({ slides }: ISlide) => {
    const duplicatedSlides = [...slides, ...slides];

    return (
        <div className="relative h-full overflow-hidden" style={{ width: '100%' }}>
            <div className="before:blur-3 after:blur-3 absolute inset-0 z-20 before:absolute before:left-0 before:top-0 before:h-full before:bg-gradient-to-r before:to-transparent before:filter after:absolute after:right-0 after:top-0 after:h-full after:bg-gradient-to-l after:to-transparent after:filter"></div>

            <motion.div
                className="flex space-x-4"
                animate={{
                    x: ['0%', '-100%'],
                    transition: {
                        ease: 'linear',
                        duration: 15,
                        repeat: Infinity,
                    },
                }}
            >
                {duplicatedSlides.map((slide, index) => (
                    <div key={index} className="flex-shrink-0">
                        <div className="flex h-full items-center justify-center">{slide}</div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default MobileCarrousel;
