import { SelectItem } from '@/components/ui/select';

export type LatinAmericanCountry =
    | 'Argentina'
    | 'Bolivia'
    | 'Brazil'
    | 'Chile'
    | 'Colombia'
    | 'Costa Rica'
    | 'Cuba'
    | 'Dominican Republic'
    | 'Ecuador'
    | 'El Salvador'
    | 'Guatemala'
    | 'Haiti'
    | 'Honduras'
    | 'México'
    | 'Nicaragua'
    | 'Panama'
    | 'Paraguay'
    | 'Peru'
    | 'Puerto Rico'
    | 'Uruguay'
    | 'Venezuela';

export const latinAmericanCountriesArray = [
    'Argentina',
    'Bolivia',
    'Brazil',
    'Chile',
    'Colombia',
    'Costa Rica',
    'Cuba',
    'Dominican Republic',
    'Ecuador',
    'El Salvador',
    'Guatemala',
    'Haiti',
    'Honduras',
    'México',
    'Nicaragua',
    'Panama',
    'Paraguay',
    'Peru',
    'Puerto Rico',
    'Uruguay',
    'Venezuela',
];

// Existing helper functions
export function getCountryCode(country: LatinAmericanCountry) {
    switch (country) {
        case 'Argentina':
            return 'AR';
        case 'Bolivia':
            return 'BO';
        case 'Brazil':
            return 'BR';
        case 'Chile':
            return 'CL';
        case 'Colombia':
            return 'CO';
        case 'Costa Rica':
            return 'CR';
        case 'Cuba':
            return 'CU';
        case 'Dominican Republic':
            return 'DO';
        case 'Ecuador':
            return 'EC';
        case 'El Salvador':
            return 'SV';
        case 'Guatemala':
            return 'GT';
        case 'Haiti':
            return 'HT';
        case 'Honduras':
            return 'HN';
        case 'México':
            return 'MX';
        case 'Nicaragua':
            return 'NI';
        case 'Panama':
            return 'PA';
        case 'Paraguay':
            return 'PY';
        case 'Peru':
            return 'PE';
        case 'Puerto Rico':
            return 'PR';
        case 'Uruguay':
            return 'UY';
        case 'Venezuela':
            return 'VE';
        default:
            return undefined; // Explicitly return undefined for exhaustive type checking
    }
}
export function getCountryName(code: string): LatinAmericanCountry | undefined {
    switch (code) {
        case 'AR':
            return 'Argentina';
        case 'BO':
            return 'Bolivia';
        case 'BR':
            return 'Brazil';
        case 'CL':
            return 'Chile';
        case 'CO':
            return 'Colombia';
        case 'CR':
            return 'Costa Rica';
        case 'CU':
            return 'Cuba';
        case 'DO':
            return 'Dominican Republic';
        case 'EC':
            return 'Ecuador';
        case 'SV':
            return 'El Salvador';
        case 'GT':
            return 'Guatemala';
        case 'HT':
            return 'Haiti';
        case 'HN':
            return 'Honduras';
        case 'MX':
            return 'México';
        case 'NI':
            return 'Nicaragua';
        case 'PA':
            return 'Panama';
        case 'PY':
            return 'Paraguay';
        case 'PE':
            return 'Peru';
        case 'PR':
            return 'Puerto Rico';
        case 'UY':
            return 'Uruguay';
        case 'VE':
            return 'Venezuela';
        default:
            return undefined;
    }
}
export function getCountryFlag(country: LatinAmericanCountry | string) {
    const flagEmojis: { [key in LatinAmericanCountry]: string } = {
        Argentina: '🇦🇷',
        Bolivia: '🇧🇴',
        Brazil: '🇧🇷',
        Chile: '🇨🇱',
        Colombia: '🇨🇴',
        'Costa Rica': '🇨🇷',
        Cuba: '🇨🇺',
        'Dominican Republic': '🇩🇴',
        Ecuador: '🇪🇨',
        'El Salvador': '🇸🇻',
        Guatemala: '🇬🇹',
        Haiti: '🇭🇹',
        Honduras: '🇭🇳',
        México: '🇲🇽',
        Nicaragua: '🇳🇮',
        Panama: '🇵🇦',
        Paraguay: '🇵🇾',
        Peru: '🇵🇪',
        'Puerto Rico': '🇵🇷',
        Uruguay: '🇺🇾',
        Venezuela: '🇻🇪',
    };

    if (flagEmojis[country as LatinAmericanCountry]) {
        return flagEmojis[country as LatinAmericanCountry];
    }

    const codeFlags: { [key: string]: string } = {
        AR: '🇦🇷',
        BO: '🇧🇴',
        BR: '🇧🇷',
        CL: '🇨🇱',
        CO: '🇨🇴',
        CR: '🇨🇷',
        CU: '🇨🇺',
        DO: '🇩🇴',
        EC: '🇪🇨',
        SV: '🇸🇻',
        GT: '🇬🇹',
        HT: '🇭🇹',
        HN: '🇭🇳',
        MX: '🇲🇽',
        NI: '🇳🇮',
        PA: '🇵🇦',
        PY: '🇵🇾',
        PE: '🇵🇪',
        PR: '🇵🇷',
        UY: '🇺🇾',
        VE: '🇻🇪',
    };

    return codeFlags[country] || '🏳️';
}

export function mapLatinAmericanCountriesToSelectItems() {
    return latinAmericanCountriesArray.map((country) => (
        <SelectItem
            key={getCountryCode(country as LatinAmericanCountry)}
            value={getCountryCode(country as LatinAmericanCountry) || ''}
        >
            <span className="flex items-center gap-2">
                <span className="text-lg">{getCountryFlag(country as LatinAmericanCountry)}</span>
                {country}
            </span>
        </SelectItem>
    ));
}
