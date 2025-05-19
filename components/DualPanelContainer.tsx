'use client';

import React, {
    useState,
    ReactNode,
    useRef,
    useEffect,
    forwardRef,
    useImperativeHandle,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import useMeasure from 'react-use-measure';

interface TabContent {
    label: string;
    content: ReactNode;
}

interface DualPanelContainerProps {
    tabs: TabContent[];
    label?: string;
    onTabChange?: (label: string, index: number) => void;
    leftTitle?: ReactNode;
    rightTitle?: ReactNode;
    startIndex?: number;
    parentManageTab?: boolean;
    primaryColor?: string | undefined;
}

export interface DualPanelContainerRef {
    setActiveTabFromParent: (index: number) => void;
}

const DualPanelContainer = forwardRef<DualPanelContainerRef, DualPanelContainerProps>(
    (
        {
            tabs,
            label,
            onTabChange,
            leftTitle,
            rightTitle,
            startIndex,
            primaryColor,
            parentManageTab,
        },
        ref,
    ) => {
        const [activeTab, setActiveTab] = useState(0);
        const [pillWidth, setPillWidth] = useState(0);
        const [pillLeft, setPillLeft] = useState(0);
        const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
        const [contentRef, { height: contentHeight }] = useMeasure();

        useEffect(() => {
            if (startIndex !== undefined) {
                setActiveTab(startIndex);
            }
        }, [setActiveTab, startIndex]);
        const slideVariants = {
            enter: (direction: number) => ({
                x: direction > 0 ? '100%' : '-100%',
                opacity: 0,
            }),
            center: {
                x: 0,
                opacity: 1,
            },
            exit: (direction: number) => ({
                x: direction < 0 ? '100%' : '-100%',
                opacity: 0,
            }),
        };

        const [direction, setDirection] = useState(0);

        useImperativeHandle(ref, () => ({
            setActiveTabFromParent: (index: number) => {
                setDirection(index < activeTab ? -1 : 1);
                setActiveTab(index);
            },
        }));

        const handleTabChange = (index: number) => {
            if (!parentManageTab) {
                setDirection(index < activeTab ? -1 : 1);
                setActiveTab(index);
            }
            onTabChange && onTabChange(tabs[index].label, index);
        };

        useEffect(() => {
            const activeTabElement = tabRefs.current[activeTab];
            if (activeTabElement) {
                setPillWidth(activeTabElement.offsetWidth);
                setPillLeft(activeTabElement.offsetLeft);
            }
        }, [activeTab]);

        return (
            <div className="h-fit w-full max-w-4xl overflow-hidden rounded-lg bg-white">
                <div
                    className={cn(
                        'flex items-center justify-center p-4 max-md:flex-col max-md:gap-3 md:justify-between',
                    )}
                >
                    {leftTitle && <div className="flex items-center">{leftTitle}</div>}
                    {label && (
                        <h1 className="hidden text-lg font-bold leading-snug text-black md:flex">
                            {label}
                        </h1>
                    )}
                    <div className="relative flex rounded-full bg-gray-100 p-1">
                        <motion.div
                            className="absolute w-fit rounded-full bg-white shadow-sm"
                            initial={false}
                            animate={{
                                width: pillWidth,
                                left: pillLeft,
                                transition: { type: 'spring', stiffness: 300, damping: 30 },
                            }}
                            style={{ height: 'calc(100% - 8px)', top: '4px' }}
                        />
                        {tabs.map((tab, index) => (
                            <button
                                key={index}
                                ref={(el: HTMLButtonElement | null) => {
                                    tabRefs.current[index] = el;
                                }}
                                type="button"
                                onClick={() => handleTabChange(index)}
                                className={cn(
                                    'relative z-10 px-4 py-2 text-xs font-medium transition-colors duration-200',
                                    'rounded-full',
                                    activeTab === index
                                        ? 'text-gray-900'
                                        : 'text-gray-500 hover:text-gray-900',
                                    tab.label === 'Envíos automáticos' &&
                                        activeTab === index &&
                                        'inline-block bg-gradient-to-r from-[#34C85A] to-[#9850E2] bg-clip-text text-transparent',
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    {rightTitle && <div className="flex items-center">{rightTitle}</div>}
                </div>
                <div className="flex w-full items-center justify-center">
                    <motion.div
                        className="relative w-full overflow-hidden"
                        animate={{ height: contentHeight }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                        <AnimatePresence initial={false} custom={direction} mode="popLayout">
                            <motion.div
                                key={activeTab}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: 'easeInOut' },
                                    opacity: { duration: 0.2 },
                                }}
                                className="w-full p-4"
                            >
                                <div ref={contentRef} className="pb-10">
                                    {React.isValidElement(tabs[activeTab].content)
                                        ? React.cloneElement(
                                              tabs[activeTab].content as React.ReactElement,
                                              { primaryColor },
                                          )
                                        : tabs[activeTab].content}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        );
    },
);

DualPanelContainer.displayName = 'DualPanelContainer';
export default DualPanelContainer;
