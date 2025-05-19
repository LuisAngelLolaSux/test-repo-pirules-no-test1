'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Countries } from './Countries';
import { Label } from '../ui/label';

interface PhoneCountryPickerProps {
    onPhoneChange: (fullNumber: string) => void;
    primaryColor?: string; // added
}

export default function PhoneCountryPicker({
    onPhoneChange,
    primaryColor,
}: PhoneCountryPickerProps) {
    const [selectedCountry, setSelectedCountry] = useState(Countries[138]);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCountries = useMemo(() => {
        return Countries.filter(
            (country) =>
                country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                country.dial_code.includes(searchQuery) ||
                country.code.toLowerCase().includes(searchQuery.toLowerCase()),
        );
    }, [searchQuery]);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newNumber = e.target.value;
        setPhoneNumber(newNumber);
        onPhoneChange(`${selectedCountry.dial_code}${newNumber}`);
    };

    const handleCountrySelect = (country: (typeof Countries)[0]) => {
        setSelectedCountry(country);
        setSearchQuery('');
        onPhoneChange(`${country.dial_code}${phoneNumber}`);
    };

    return (
        <div className="flex flex-col space-y-2">
            <Label>Número de teléfono</Label>
            <div className="intems-center flex w-full space-x-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <button className="flex items-center justify-center space-x-1 text-center font-normal">
                            <h1 className="text-4xl">{selectedCountry.flag}</h1>
                            <ChevronDown className="opacity-50" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                        <div className="flex items-center border-b px-3 py-2">
                            <Search className="mr-2 h-4 w-4 opacity-50" />
                            <Input
                                placeholder="Search countries"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="border-0 focus-visible:ring-0"
                            />
                        </div>
                        <ScrollArea className="h-[300px]">
                            {filteredCountries.map((country) => (
                                <Button
                                    key={country.code}
                                    variant="ghost"
                                    className="w-full justify-start font-normal"
                                    onClick={() => handleCountrySelect(country)}
                                >
                                    <h1 className="mr-2 h-4 w-6 object-cover">{country.flag}</h1>
                                    {country.name} ({country.dial_code})
                                </Button>
                            ))}
                        </ScrollArea>
                    </PopoverContent>
                </Popover>
                <Input
                    type="number"
                    placeholder="Ingresa tu número de teléfono"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    style={{ '--focus-color': primaryColor || '#34c85a' } as React.CSSProperties} // added
                    className="flex-grow focus:border-[var(--focus-color)] focus:ring-1 focus:ring-[var(--focus-color)]" // modified
                />
            </div>
        </div>
    );
}
