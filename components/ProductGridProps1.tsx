import React from 'react';

const ProductGridProps1: React.FC<any> = (props) => {
    return (
        <div style={{ border: '2px solid blue', padding: '1rem' }}>
            <h2>{props.title || 'Default ProductGridProps1 Title'}</h2>
        </div>
    );
};

export default ProductGridProps1;
