'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface IDatePickerProps {
    daysAhead?: number;
    onDateSelect: (date: Date) => void;
}

export default function DatePicker({ daysAhead = 0, onDateSelect }: IDatePickerProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [minSelectableDate, setMinSelectableDate] = useState(new Date());
    const [view, setView] = useState<'month' | 'date'>('month');

    useEffect(() => {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + daysAhead);
        setMinSelectableDate(startDate);
        setCurrentDate(new Date(startDate.getFullYear(), startDate.getMonth(), 1));
    }, [daysAhead]);

    const months = [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
    ];

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const isDateSelectable = (date: Date) => {
        return date >= minSelectableDate;
    };

    const handlePrev = () => {
        if (view === 'month') {
            setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1));
        } else {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        }
    };

    const handleNext = () => {
        if (view === 'month') {
            setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1));
        } else {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
        }
    };

    const handleMonthSelect = (monthIndex: number) => {
        setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
        setView('date');
    };

    const handleDateSelect = (day: number) => {
        const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        if (isDateSelectable(selectedDate)) {
            setSelectedDate(selectedDate);
            onDateSelect(selectedDate);
        }
    };

    const toggleView = () => {
        setView(view === 'month' ? 'date' : 'month');
    };

    const isMinDate =
        view === 'month'
            ? currentDate.getFullYear() <= minSelectableDate.getFullYear()
            : currentDate.getTime() <=
              new Date(minSelectableDate.getFullYear(), minSelectableDate.getMonth(), 1).getTime();

    return (
        <Card className="mx-auto w-full max-w-sm shadow-none">
            <CardContent className="p-4">
                <div className="mb-4 flex items-center justify-between">
                    <Button
                        variant="outline"
                        className="border-none"
                        size="icon"
                        onClick={handlePrev}
                        disabled={isMinDate}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" onClick={toggleView} className="font-semibold">
                        {view === 'month'
                            ? currentDate.getFullYear()
                            : `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
                    </Button>
                    <Button
                        className="border-none"
                        variant="outline"
                        size="icon"
                        onClick={handleNext}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
                {view === 'month' ? (
                    <div className="grid grid-cols-3 gap-2">
                        {months.map((month, index) => {
                            const monthDate = new Date(currentDate.getFullYear(), index, 1);
                            const isSelectable =
                                monthDate >=
                                new Date(
                                    minSelectableDate.getFullYear(),
                                    minSelectableDate.getMonth(),
                                    1,
                                );
                            return (
                                <Button
                                    key={month}
                                    variant="outline"
                                    className={`none w-full border ${!isSelectable ? 'cursor-not-allowed opacity-50' : ''}`}
                                    onClick={() => isSelectable && handleMonthSelect(index)}
                                    disabled={!isSelectable}
                                >
                                    {month.slice(0, 3)}
                                </Button>
                            );
                        })}
                    </div>
                ) : (
                    <>
                        <div className="mb-2 grid grid-cols-7 gap-1">
                            {['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'].map((day) => (
                                <div
                                    key={day}
                                    className="text-center text-sm font-medium text-gray-500"
                                >
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {Array.from(
                                {
                                    length: getFirstDayOfMonth(
                                        currentDate.getFullYear(),
                                        currentDate.getMonth(),
                                    ),
                                },
                                (_, i) => (
                                    <div key={`empty-${i}`} className="h-10 w-full"></div>
                                ),
                            )}
                            {Array.from(
                                {
                                    length: getDaysInMonth(
                                        currentDate.getFullYear(),
                                        currentDate.getMonth(),
                                    ),
                                },
                                (_, i) => i + 1,
                            ).map((day) => {
                                const date = new Date(
                                    currentDate.getFullYear(),
                                    currentDate.getMonth(),
                                    day,
                                );
                                const isSelectable = isDateSelectable(date);
                                const isSelected =
                                    selectedDate && selectedDate.getTime() === date.getTime();
                                return (
                                    <Button
                                        key={day}
                                        variant={isSelected ? 'lola' : 'outline'}
                                        className={`h-10 w-10 rounded-full border-none ${!isSelectable ? 'cursor-not-allowed opacity-50' : ''}`}
                                        onClick={() => handleDateSelect(day)}
                                        disabled={!isSelectable}
                                    >
                                        {day}
                                    </Button>
                                );
                            })}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
