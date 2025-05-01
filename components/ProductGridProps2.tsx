import React from 'react';

const ProductGridProps2: React.FC<any> = (props) => {
    return (
        <div style={{ border: '2px solid green', padding: '1rem' }}>
            <h2>{props.title || 'Default ProductGridProps2 Title'}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {props.products?.map((product: any, index: number) => (
                    <div key={index} className="rounded border p-4">
                        <img
                            src={
                                product.imagenes && product.imagenes.length > 0
                                    ? product.imagenes[0]
                                    : '/placeholder.png'
                            }
                            alt={product.nombre}
                            className="mb-2"
                        />
                        <h3 className="font-semibold">{product.nombre}</h3>
                        <p>{product.descripcion}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductGridProps2;
