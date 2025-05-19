import { SelectItem } from '@/components/ui/select';

export type MexicanState =
    | 'Aguascalientes'
    | 'Baja California'
    | 'Baja California Sur'
    | 'Campeche'
    | 'Chiapas'
    | 'Chihuahua'
    | 'Coahuila'
    | 'Colima'
    | 'Ciudad de México'
    | 'Durango'
    | 'Guanajuato'
    | 'Guerrero'
    | 'Hidalgo'
    | 'Jalisco'
    | 'México'
    | 'Michoacán'
    | 'Morelos'
    | 'Nayarit'
    | 'Nuevo León'
    | 'Oaxaca'
    | 'Puebla'
    | 'Querétaro'
    | 'Quintana Roo'
    | 'San Luis Potosí'
    | 'Sinaloa'
    | 'Sonora'
    | 'Tabasco'
    | 'Tamaulipas'
    | 'Tlaxcala'
    | 'Veracruz'
    | 'Yucatán'
    | 'Zacatecas';

export const mexicanStatesArray = [
    'Aguascalientes',
    'Baja California',
    'Baja California Sur',
    'Campeche',
    'Chiapas',
    'Chihuahua',
    'Coahuila',
    'Colima',
    'Ciudad de México',
    'Durango',
    'Guanajuato',
    'Guerrero',
    'Hidalgo',
    'Jalisco',
    'México',
    'Michoacán',
    'Morelos',
    'Nayarit',
    'Nuevo León',
    'Oaxaca',
    'Puebla',
    'Querétaro',
    'Quintana Roo',
    'San Luis Potosí',
    'Sinaloa',
    'Sonora',
    'Tabasco',
    'Tamaulipas',
    'Tlaxcala',
    'Veracruz',
    'Yucatán',
    'Zacatecas',
];

export function getStateCode(state: MexicanState) {
    switch (state) {
        case 'Aguascalientes':
            return 'AGS';
        case 'Baja California':
            return 'BC';
        case 'Baja California Sur':
            return 'BCS';
        case 'Campeche':
            return 'CAM';
        case 'Chiapas':
            return 'CHIS';
        case 'Chihuahua':
            return 'CHIH';
        case 'Coahuila':
            return 'COAH';
        case 'Colima':
            return 'COL';
        case 'Ciudad de México':
            return 'CDMX';
        case 'Durango':
            return 'DGO';
        case 'Guanajuato':
            return 'GTO';
        case 'Guerrero':
            return 'GRO';
        case 'Hidalgo':
            return 'HGO';
        case 'Jalisco':
            return 'JAL';
        case 'México':
            return 'MEX';
        case 'Michoacán':
            return 'MICH';
        case 'Morelos':
            return 'MOR';
        case 'Nayarit':
            return 'NAY';
        case 'Nuevo León':
            return 'NL';
        case 'Oaxaca':
            return 'OAX';
        case 'Puebla':
            return 'PUE';
        case 'Querétaro':
            return 'QRO';
        case 'Quintana Roo':
            return 'QROO';
        case 'San Luis Potosí':
            return 'SLP';
        case 'Sinaloa':
            return 'SIN';
        case 'Sonora':
            return 'SON';
        case 'Tabasco':
            return 'TAB';
        case 'Tamaulipas':
            return 'TAMPS';
        case 'Tlaxcala':
            return 'TLAX';
        case 'Veracruz':
            return 'VER';
        case 'Yucatán':
            return 'YUC';
        case 'Zacatecas':
            return 'ZAC';
        default:
            return undefined; // Explicitly return undefined for exhaustive type checking
    }
}

export function mapMexicanStatesToSelectItems() {
    return mexicanStatesArray.map((state) => (
        <SelectItem
            key={getStateCode(state as MexicanState)}
            value={getStateCode(state as MexicanState) || ''}
        >
            <span className="flex items-center gap-2">{state}</span>
        </SelectItem>
    ));
}
