import React from 'react';

interface GoogleMapProps {
    address: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ address }) => {
    // Retrieve the API key from environment variables (ensure it's prefixed with REACT_APP_)
    const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_CLOUD_MAPS_API_KEY || '';
    console.log('Google Maps API Key:', googleMapsApiKey);
    // Construct the Google Maps embed URL with your API key and encoded address
    const mapSrc = `https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${encodeURIComponent(address)}`;

    return (
        <iframe
            src={mapSrc}
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
    );
};

export default GoogleMap;
