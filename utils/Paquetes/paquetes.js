function calcularDimensionesCaja(productos) {
    let largoMax = 0,
        anchoMax = 0,
        altoMax = 0;

    let largoTotal = 0,
        anchoTotal = 0,
        altoTotal = 0;

    let largoNewMax = 0,
        anchoNewMax = 0,
        altoNewMax = 0;

    let largoNewTotal = 0,
        anchoNewTotal = 0,
        altoNewTotal = 0;

    productos.forEach(({ largo, ancho, alto }) => {
        const dimensionesNew = ordenarDimensiones({ largo, ancho, alto });

        // Apilamiento en altura New method
        if (dimensionesNew[0] > largoNewMax) largoNewMax = dimensionesNew[0];
        if (dimensionesNew[1] > anchoNewMax) anchoNewMax = dimensionesNew[1];
        if (dimensionesNew[2] > altoNewMax) altoNewMax = dimensionesNew[2];

        largoNewTotal += dimensionesNew[0];
        anchoNewTotal += dimensionesNew[1];
        altoNewTotal += dimensionesNew[2];

        if (largo > largoMax) largoMax = largo;
        if (alto > altoMax) altoMax = alto;
        if (ancho > anchoMax) anchoMax = ancho;
        // Apilamiento en altura
        altoTotal += alto;
        // Apilamiento en ancho
        anchoTotal += ancho;
        // Apilamiento en largo
        largoTotal += largo;
    });

    // Opciones de caja
    let opciones = [
        { metodo: 'Apilado en altura', largo: largoMax, ancho: anchoMax, alto: altoTotal },
        { metodo: 'Apilado en ancho', largo: largoMax, ancho: anchoTotal, alto: altoMax },
        { metodo: 'Apilado en largo', largo: largoTotal, ancho: anchoMax, alto: altoMax },
        {
            metodo: 'Dimensiones ordenadas apilado en altura',
            largo: largoNewMax,
            ancho: anchoNewMax,
            alto: altoNewTotal,
        },
        {
            metodo: 'Dimensiones ordenadas apilado en ancho',
            largo: largoNewMax,
            ancho: anchoNewTotal,
            alto: altoNewMax,
        },
        {
            metodo: 'Dimensiones ordenadas apilado en largo',
            largo: largoNewTotal,
            ancho: anchoNewMax,
            alto: altoNewMax,
        },
    ];

    // Imprimir todas las opciones
    // opciones.forEach((opcion) => {
    //     console.log(`${opcion.metodo}:`);
    //     console.log(
    //         `  Medidas: ${opcion.largo}x${opcion.ancho}x${opcion.alto} cm, ${opcion.largo * opcion.ancho * opcion.alto} cm³`,
    //     );
    //     console.log('--------------------------');
    // });

    return opciones;
}

function ordenarDimensiones(dim) {
    // Ordenar las dimensiones de mayor a menor
    return [dim.largo, dim.ancho, dim.alto].sort((a, b) => b - a);
}

function calcularVolumenProductos(productos) {
    // Calcular el volumen total de los productos
    return productos.reduce((total, { largo, ancho, alto }) => total + largo * ancho * alto, 0);
}

function calcularPorcentajeAprovechado(volumenCaja, volumenProductos) {
    // Calcular el porcentaje aprovechado de la caja
    return (volumenProductos / volumenCaja) * 100;
}

function verificarCajaDisponible(cajas, dimensionesCaja, volumenProductos) {
    let mejorCaja = null;
    let mejorPorcentaje = 0;

    // Ordenar las dimensiones de la caja mínima
    const dimensionesOrdenadas = ordenarDimensiones(dimensionesCaja);

    for (let i = 0; i < cajas.length; i++) {
        // Ordenamos las dimensiones de la caja disponible
        const cajaOrdenada = ordenarDimensiones(cajas[i]);

        // Verificamos si la caja puede contener la caja mínima ordenando las dimensiones
        if (
            cajaOrdenada[0] >= dimensionesOrdenadas[0] &&
            cajaOrdenada[1] >= dimensionesOrdenadas[1] &&
            cajaOrdenada[2] >= dimensionesOrdenadas[2]
        ) {
            // Calculamos el volumen de la caja
            const volumenCaja = cajas[i].largo * cajas[i].ancho * cajas[i].alto;

            // Calculamos el porcentaje aprovechado de esta caja
            const porcentajeAprovechado = calcularPorcentajeAprovechado(
                volumenCaja,
                volumenProductos,
            );

            // Si es la mejor caja encontrada, la guardamos
            if (porcentajeAprovechado > mejorPorcentaje) {
                mejorPorcentaje = porcentajeAprovechado;
                mejorCaja = cajas[i];
            }
        }
    }
    return mejorCaja;
}

// Función para eliminar un producto aleatorio de la lista
function eliminarProductoAleatorio(productosRestantes, productosEnCaja) {
    if (productosRestantes.length > 0) {
        const indiceAleatorio = Math.floor(Math.random() * productosRestantes.length);
        productosEnCaja.push(productosRestantes.splice(indiceAleatorio, 1)[0]);
    }
}

function encontrarCajasParaProductos(
    productos,
    cajas,
    resultado = { cajas: [], sueltos: [] },
    profundidad = 0,
    profundidadMaxima = 100,
) {
    let productosRestantes = [...productos];
    let productosEnCaja = [];

    if (profundidad > profundidadMaxima) {
        resultado.sueltos = productosRestantes.map((p) => p.nombre); // Guarda los productos restantes como sueltos
        return resultado;
    }

    while (productosRestantes.length > 0) {
        if (productosRestantes.length === 1) {
            productosEnCaja.push(productosRestantes.pop());
            break;
        }
        const peso = productosRestantes.reduce((suma, prod) => {
            return suma + prod.peso;
        }, 0);
        if (peso > 30) {
            eliminarProductoAleatorio(productosRestantes, productosEnCaja);
            continue;
        }
        // Calcular las dimensiones mínimas para la caja (todas las opciones de apilado)
        const opciones = calcularDimensionesCaja(productosRestantes);

        // Calcular el volumen total de los productos
        const volumenProductos = calcularVolumenProductos(productosRestantes);

        let mejorCaja = null;
        let mejorMetodo = '';
        let mejorPorcentaje = 0;

        for (let opcion of opciones) {
            const cajaValida = verificarCajaDisponible(cajas, opcion, volumenProductos);
            if (cajaValida) {
                // Calculamos el volumen de la caja
                const volumenCaja = cajaValida.largo * cajaValida.ancho * cajaValida.alto;

                // Calculamos el porcentaje aprovechado de esta caja
                const porcentajeAprovechado = calcularPorcentajeAprovechado(
                    volumenCaja,
                    volumenProductos,
                );
                // Verificar si esta opción tiene el mejor porcentaje aprovechado
                if (porcentajeAprovechado > mejorPorcentaje) {
                    mejorPorcentaje = porcentajeAprovechado;
                    mejorCaja = cajaValida;
                    mejorMetodo = opcion.metodo;
                }
            }
        }

        if (mejorCaja) {
            if (mejorPorcentaje.toFixed(2) < 60) {
                eliminarProductoAleatorio(productosRestantes, productosEnCaja);
            } else {
                resultado.cajas.push({
                    caja: mejorCaja,
                    porcentajeAprovechado: mejorPorcentaje.toFixed(2),
                    productos: productosRestantes,
                    metodoUtilizado: mejorMetodo,
                    volumenDesperdiciado:
                        mejorCaja.largo * mejorCaja.ancho * mejorCaja.alto - volumenProductos,
                });
                break;
            }
        } else {
            eliminarProductoAleatorio(productosRestantes, productosEnCaja);
        }
    }
    if (
        JSON.stringify([...productosEnCaja].sort()) !== JSON.stringify([...productos].sort()) &&
        productosEnCaja.length > 1
    ) {
        encontrarCajasParaProductos(
            productosEnCaja,
            cajas,
            resultado,
            profundidad + 1,
            profundidadMaxima,
        );
    } else {
        resultado.sueltos = productosEnCaja.map((p) => p.nombre);
    }
    return resultado;
}

const compararDiferentesOpciones = (productos, cajas, cantidad) => {
    let mejorOpcion;
    let mejorCalificacion = 0;

    for (let i = 0; i < cantidad; i++) {
        const res = encontrarCajasParaProductos(productos, cajas);
        // Ponderaciones para la calificacion
        const ponderacionAprovechado = 1;
        const ponderacionCajas = 2;
        const ponderacionSueltos = 4.5;

        const porcentajeAprovechadoPromedio =
            res.cajas && res.cajas.length > 0
                ? res.cajas.reduce((acumulador, caja) => {
                      return acumulador + Number(caja.porcentajeAprovechado);
                  }, 0) / res.cajas.length
                : null;

        let calificacion = porcentajeAprovechadoPromedio || 0 * ponderacionAprovechado;

        calificacion -= res.cajas.length * ponderacionCajas;
        calificacion -= res.sueltos.length * ponderacionSueltos;

        if (calificacion > mejorCalificacion) {
            mejorCalificacion = calificacion;
            mejorOpcion = { ...res, calificacion };
        }
    }

    return mejorOpcion;
};

// Lista de productos con largo, ancho y alto
const productos = [
    { nombre: 'A', largo: 14, ancho: 25, alto: 32, peso: 2 },
    { nombre: 'B', largo: 18, ancho: 12, alto: 20, peso: 5 },
    // { nombre: 'C', largo: 40, ancho: 15, alto: 10, peso: 29 },
    // { nombre: 'D', largo: 22, ancho: 18, alto: 25, peso: 1 },
    // { nombre: 'E', largo: 35, ancho: 20, alto: 15, peso: 28 },
    { nombre: 'F', largo: 12, ancho: 10, alto: 8, peso: 9 },
    { nombre: 'G', largo: 28, ancho: 22, alto: 18, peso: 3 },
    { nombre: 'H', largo: 30, ancho: 24, alto: 20, peso: 6 },
];

// Lista de cajas disponibles
const cajas = [
    { largo: 30, ancho: 15, alto: 20 },
    { largo: 50, ancho: 25, alto: 30 },
    { largo: 80, ancho: 30, alto: 40 },
    { largo: 40, ancho: 45, alto: 40 },
    { largo: 100, ancho: 40, alto: 45 },
];

const res = compararDiferentesOpciones(productos, cajas, 10);
if (res) {
    res.cajas.forEach((caja) => {
        console.log('Caja: ' + `${caja.caja.largo}x${caja.caja.ancho}x${caja.caja.alto} cm`);
        console.log('Porcentaje Aprovechado: ' + caja.porcentajeAprovechado);
        console.log('Productos: ' + caja.productos.map((p) => p.nombre));
        console.log('Metodo: ' + caja.metodoUtilizado);
        console.log('Volumen Desperdiciado: ' + caja.volumenDesperdiciado);
        console.log('-----------------------------');
    });

    console.log('Sueltos: ' + res.sueltos);
    console.log('calificacion:', res.calificacion);
}
