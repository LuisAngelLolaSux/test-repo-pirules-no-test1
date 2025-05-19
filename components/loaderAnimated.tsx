'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, useAnimation, Easing } from 'framer-motion';
import { Logo3D } from './3DModel';
import { Canvas } from '@react-three/fiber';
import Image from 'next/image';

export interface AnimatedLoaderProps {
    duration?: number;
    width?: number;
    height?: number;
}

export function AnimatedLoader({ duration = 4000, width = 200, height = 4 }: AnimatedLoaderProps) {
    const controls = useAnimation();

    useEffect(() => {
        controls.start({
            x: [0, width - width * 0.3, 0],
            transition: {
                x: {
                    repeat: Infinity,
                    repeatType: 'reverse',
                    duration: duration / 2500,
                    ease: 'easeInOut',
                },
            },
        });
    }, [controls, duration, width]);

    return (
        <div className="flex flex-col items-center space-y-3" role="status" aria-label="Loading">
            <Suspense fallback={<Image alt="Loading" src="/LolaSux.svg" width={50} height={50} />}>
                <Image alt="Loading" src="/LolaMotion.gif" width={100} height={100} />
            </Suspense>

            <p className="mb-2 text-lg font-semibold" aria-live="polite">
                Lola Sux
            </p>
            <div
                className="overflow-hidden rounded-full bg-gray-200"
                style={{ width: `${width}px`, height: `${height}px` }}
            >
                <motion.div
                    className="h-full bg-[#34C75A]"
                    style={{ width: `${width * 0.3}px` }}
                    animate={controls}
                />
            </div>
        </div>
    );
}
