'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import React from 'react';

interface DeliveryStep {
    id: number;
    title: string;
    time?: string;
    isCompleted: boolean;
    isCurrent: boolean;
    icon: React.ReactNode;
}

interface DeliveryTrackerProps {
    steps: DeliveryStep[];
    className?: string;
}

export default function DeliveryTracker({ steps, className }: DeliveryTrackerProps) {
    const lastActiveIndex = steps.findIndex((step) => step.isCurrent);

    const getLineColor = (index: number) => {
        if (index < lastActiveIndex) return '#34C85A';
        return '#AAB9C5';
    };

    return (
        <div className={cn('w-full rounded-lg text-white', className)}>
            <h2 className="mb-8 text-2xl font-semibold">Ruta del Pedido:</h2>
            <div className="relative">
                {/* Steps */}
                <div className="space-y-10">
                    {steps.map((step, index) => {
                        const isActive = index <= lastActiveIndex;

                        return (
                            <div key={step.id} className="relative flex items-center gap-4">
                                {/* Line segment */}
                                {index < steps.length - 1 && (
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: 'calc(100% - 0.5rem)' }}
                                        transition={{
                                            delay: index * 0.4,
                                            duration: 0.5,
                                            ease: 'easeInOut',
                                        }}
                                        style={{
                                            position: 'absolute',
                                            left: '16px',
                                            top: '42px',
                                            width: '2px',
                                            background: `repeating-linear-gradient(
                                                to bottom,
                                                ${getLineColor(index)} 0,
                                                ${getLineColor(index)} 4px,
                                                transparent 4px,
                                                transparent 8px
                                            )`,
                                        }}
                                    />
                                )}

                                {/* Background circle */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                        delay: index * 0.2,
                                        type: 'spring',
                                        stiffness: 260,
                                        damping: 20,
                                    }}
                                    className={cn(
                                        'absolute h-8 w-8 flex-shrink-0 rounded-full bg-[#155024]',
                                    )}
                                    style={{ transform: 'translateX(-50%)' }}
                                />

                                {/* Foreground circle */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                        delay: index * 0.2,
                                        type: 'spring',
                                        stiffness: 260,
                                        damping: 20,
                                    }}
                                    className={cn(
                                        'relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2',
                                        isActive
                                            ? 'border-[#34C85A] bg-[#34C85A]/30'
                                            : 'border-gray-300 bg-[#323F49]',
                                    )}
                                >
                                    <div
                                        className={cn(
                                            'flex h-4 w-4 items-center justify-center',
                                            isActive ? 'text-[#34C85A]' : 'text-[#d3d3d3]',
                                        )}
                                    >
                                        {step.icon}
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        delay: index * 0.2,
                                        duration: 0.5,
                                    }}
                                    className="flex-1"
                                >
                                    <div
                                        className={cn(
                                            'flex items-center justify-between gap-4 text-sm',
                                            isActive ? 'text-white' : 'text-gray-400',
                                        )}
                                    >
                                        <span className="">{step.title}</span>
                                        <span className="">{step.time}</span>
                                    </div>
                                </motion.div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
