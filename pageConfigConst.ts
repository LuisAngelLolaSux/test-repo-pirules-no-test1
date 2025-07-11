export const PAGE_CONFIG = {
    globalValues: {
        colores: {
            primary: "#2563eb",
            secondary: "#1e40af",
            text: "#1f2937",
        },
        companyName: "Default Company",
    },
    layout: {
        header: { componentes: [] },
        leftSidebar: { componentes: [] },
        rightSidebar: { componentes: [] },
        footer: { componentes: [] },
    },
    paginas: [
        {
            ruta: "/",
            componentes: [
                {
                    componente: "ProductGridProps",
                    image: "/media/images.jpeg",
                    title: "Bienvenidos a Papayacorp",
                    text: "Descubre las mejores papayas frescas en un entorno de calidad. Cultivadas con amor y dedicación, nuestras papayas son insuperables. ¡Ven y prueba la diferencia!",
                    ctaText: "Compra ahora",
                    ctaText2: "Contáctanos",
                },
                {
                    componente: "InfoGridProps",
                    items: [
                        {
                            image: "/media/pexels-pixabay-104827.jpg",
                            title: "Calidad Superior",
                            text: "Nuestras papayas son seleccionadas cuidadosamente para ofrecer la mejor calidad y sabor en cada bocado.",
                            buttonText: "Ver Productos",
                        },
                        {
                            image: "/media/photo-1529778873920-4da4926a72c2.jpeg",
                            title: "Frescura Garantizada",
                            text: "Ofrecemos papayas frescas, recolectadas diariamente para asegurar su máxima frescura.",
                            buttonText: "Compra Ahora",
                        },
                        {
                            image: "/media/premium_photo-1673967831980-1d377baaded2.jpeg",
                            title: "Sostenibilidad",
                            text: "Trabajamos con prácticas sostenibles para cuidar nuestro planeta y ofrecerte productos responsables.",
                            buttonText: "Conoce Más",
                        },
                        {
                            image: "/media/two-different-breeds-of-cats-side-by-side-outdoors-in-the-garden.webp",
                            title: "Entregas Rápidas",
                            text: "Realizamos envíos eficientes para que disfrutes de tus papayas en la comodidad de tu hogar.",
                            buttonText: "Ordena Ya",
                        },
                    ],
                },
                {
                    componente: "TestimonialProps",
                    testimonies: [
                        {
                            name: "Carlos Méndez",
                            rating: 5,
                            comment: "La mejor papaya que he probado, fresca y dulce.",
                        },
                        {
                            name: "Lucía Gómez",
                            rating: 4,
                            comment: "Muy ricas, aunque me gustaría más variedad.",
                        },
                        {
                            name: "Javier Ruiz",
                            rating: 5,
                            comment: "Excelente calidad, volveré a comprar.",
                        },
                        {
                            name: "María Fernández",
                            rating: 4.5,
                            comment: "Papayas jugosas y siempre frescas.",
                        },
                        {
                            name: "Andrés León",
                            rating: 5,
                            comment: "Las papayas son enormes y deliciosas.",
                        },
                    ],
                },
                {
                    componente: "GalleryProps",
                    title: "Bienvenido a Papayacorp",
                    images: [
                        "/media/images.jpeg",
                        "/media/pexels-pixabay-104827.jpg",
                        "/media/photo-1529778873920-4da4926a72c2.jpeg",
                    ],
                },
                {
                    componente: "FormProps",
                    image: "/media/premium_photo-1673967831980-1d377baaded2.jpeg",
                    title: "Papayacorp - Las Mejores Papayas",
                    text: "Descubre la frescura y calidad de nuestras papayas. Cultivadas con amor en un área de 40 metros cuadrados, te ofrecemos la mejor fruta del mercado.",
                    ctaText: "Compra Ahora",
                    ctaText2: "Contáctanos",
                },
                {
                    componente: "CategoryGrid",
                    image: "/media/two-different-breeds-of-cats-side-by-side-outdoors-in-the-garden.webp",
                    title: "PapayaCorp - Las Mejores Papayas",
                    text: "En PapayaCorp, ofrecemos las papayas más frescas y sabrosas en un área de 40 metros cuadrados. Calidad y frescura garantizadas para deleitar tu paladar.",
                    ctaText: "Compra Ahora",
                    ctaText2: "Descubre Nuestras Ofertas",
                },
            ],
        },
        {
            ruta: "/productos",
            componentes: [
                {
                    componente: "HeroProps",
                    image: "/media/images.jpeg",
                    title: "PapayaCorp: La Mejor Papaya",
                    text: "Descubre las papayas más frescas y deliciosas a solo 40 metros cuadrados a la redonda. Calidad y sabor en cada bocado.",
                    ctaText: "Compra Ahora",
                    ctaText2: "Conócenos",
                },
                {
                    componente: "InfoGridProps",
                    items: [
                        {
                            image: "/media/pexels-pixabay-104827.jpg",
                            title: "Papaya Fresca",
                            text: "Disfruta de la frescura de nuestras papayas, cultivadas con pasión y dedicación.",
                            buttonText: "Comprar Ahora",
                        },
                        {
                            image: "/media/photo-1529778873920-4da4926a72c2.jpeg",
                            title: "Papaya Orgánica",
                            text: "Nuestras papayas son 100% orgánicas, perfectas para una alimentación saludable.",
                            buttonText: "Ver Más",
                        },
                        {
                            image: "/media/premium_photo-1673967831980-1d377baaded2.jpeg",
                            title: "Recetas con Papaya",
                            text: "Descubre deliciosas recetas que incluyen nuestra dulce papaya.",
                            buttonText: "Explorar Recetas",
                        },
                        {
                            image: "/media/two-different-breeds-of-cats-side-by-side-outdoors-in-the-garden.webp",
                            title: "Beneficios de la Papaya",
                            text: "La papaya es rica en nutrientes y antioxidantes. Conócelos aquí.",
                            buttonText: "Leer Más",
                        },
                    ],
                },
                {
                    componente: "TestimonialProps",
                    testimonies: [
                        {
                            name: "Carlos Pérez",
                            rating: 5,
                            comment: "Las papayas son deliciosas y frescas, ¡definitivamente las mejores de la zona!",
                        },
                        {
                            name: "María López",
                            rating: 4,
                            comment: "Me encanta la calidad de las papayas, siempre jugosas y dulces.",
                        },
                        {
                            name: "Juan Martínez",
                            rating: 5,
                            comment: "Excelente atención y un producto insuperable. ¡Volveré a comprar!",
                        },
                        {
                            name: "Ana Rodríguez",
                            rating: 4,
                            comment: "Las papayas son muy buenas, aunque a veces me gustaría más variedad.",
                        },
                        {
                            name: "Luis Fernández",
                            rating: 5,
                            comment: "Sin duda, aquí encuentro las mejores papayas, frescura garantizada.",
                        },
                    ],
                },
                {
                    componente: "PromotionHeaderProps",
                    text: "En Papayacorp, ofrecemos las mejores papayas de la región. Con calidad y frescura garantizadas, nuestras papayas son cultivadas localmente y disponibles para ti. ¡Descubre el sabor único de nuestras frutas!",
                    link: "/productos/papayas",
                },
                {
                    componente: "TeamProps",
                    title: "Productos de Papayacorp",
                    text: "Descubre nuestras deliciosas papayas, cultivadas con amor y dedicación. Las mejores del área, perfectas para cada ocasión.",
                    members: [
                        {
                            photo: "/media/premium_photo-1673967831980-1d377baaded2.jpeg",
                            name: "Papaya Dulce",
                            role: "Variedad Premium",
                        },
                        {
                            photo: "/media/two-different-breeds-of-cats-side-by-side-outdoors-in-the-garden.webp",
                            name: "Papaya Orgánica",
                            role: "Sin pesticidas",
                        },
                        {
                            photo: "/media/images.jpeg",
                            name: "Papaya Mixta",
                            role: "Sabor excepcional",
                        },
                        {
                            photo: "/media/pexels-pixabay-104827.jpg",
                            name: "Papaya por Mayor",
                            role: "Precios especiales",
                        },
                    ],
                },
                {
                    componente: "FAQProps",
                    categories: [
                        {
                            category: "Papayas",
                            questions: [
                                {
                                    question: "¿Por qué elegir Papayacorp?",
                                    answer: "Ofrecemos las papayas más frescas y deliciosas de la zona.",
                                },
                                {
                                    question: "¿Cuáles son nuestros productos?",
                                    answer: "Solo vendemos papayas de alta calidad, cultivadas con cuidado.",
                                },
                                {
                                    question: "¿Dónde nos encontramos?",
                                    answer: "Estamos ubicados en un área de 40 metros cuadrados, listos para atenderte.",
                                },
                                {
                                    question: "¿Qué hace diferentes a nuestras papayas?",
                                    answer: "Nuestras papayas son seleccionadas a mano y provienen de cultivos locales.",
                                },
                                {
                                    question: "¿Habrá promociones?",
                                    answer: "Sí, regularmente ofrecemos descuentos y promociones especiales.",
                                },
                            ],
                        },
                    ],
                },
                {
                    componente: "GalleryProps",
                    title: "PapayaCorp - Las Mejores Papayas",
                    images: [
                        "/media/images.jpeg",
                        "/media/pexels-pixabay-104827.jpg",
                        "/media/photo-1529778873920-4da4926a72c2.jpeg",
                    ],
                },
                {
                    componente: "ContactProps",
                    image: "/media/images.jpeg",
                    title: "Papayacorp - Las Mejores Papayas",
                    text: "Descubre nuestra selección de frescas y deliciosas papayas, cultivadas con amor y en el mejor clima. Calidad superior a solo 40 metros a la redonda.",
                    ctaText: "Compra Ahora",
                    ctaText2: "Conoce Más",
                },
            ],
        },
        {
            ruta: "/about-us",
            componentes: [
                {
                    componente: "HeroProps",
                    image: "/media/photo-1529778873920-4da4926a72c2.jpeg",
                    title: "Sobre PapayaCorp",
                    text: "En PapayaCorp, somos apasionados por ofrecer las papayas más frescas y deliciosas. Con un espacio de 40 metros cuadrados, garantizamos calidad y sabor incomparables. Ven y prueba la diferencia.",
                    ctaText: "Descubre nuestras papayas",
                    ctaText2: "Contáctanos para más info",
                },
                {
                    componente: "InfoGridProps",
                    items: [
                        {
                            image: "/media/premium_photo-1673967831980-1d377baaded2.jpeg",
                            title: "Nuestra Misión",
                            text: "Ofrecer las papayas más frescas y deliciosas en un ambiente amigable e innovador.",
                            buttonText: "Conócenos",
                        },
                        {
                            image: "/media/two-different-breeds-of-cats-side-by-side-outdoors-in-the-garden.webp",
                            title: "Calidad Superior",
                            text: "Seleccionamos cuidadosamente cada papaya para garantizar frescura y sabor excepcionales.",
                            buttonText: "Ver Productos",
                        },
                        {
                            image: "/media/images.jpeg",
                            title: "Compromiso Local",
                            text: "Fomentamos el comercio local, apoyando a los agricultores de la región.",
                            buttonText: "Farmers Partners",
                        },
                        {
                            image: "/media/pexels-pixabay-104827.jpg",
                            title: "Testimonios",
                            text: "Nuestros clientes aman nuestras papayas. ¡Descubre por qué!",
                            buttonText: "Leer Opiniones",
                        },
                    ],
                },
                {
                    componente: "TestimonialsProps",
                    image: "/media/photo-1529778873920-4da4926a72c2.jpeg",
                    title: "Bienvenidos a Papayacorp",
                    text: "En Papayacorp nos especializamos en ofrecer las mejores papayas frescas y de alta calidad en un radio de 40 metros cuadrados. Nuestra dedicación a la frescura y el sabor nos distingue.",
                    ctaText: "Descubre nuestras papayas",
                    ctaText2: "Contáctanos para más información",
                },
                {
                    componente: "ProductGridProps",
                    image: "/media/premium_photo-1673967831980-1d377baaded2.jpeg",
                    title: "Sobre Papayacorp",
                    text: "En Papayacorp, nos dedicamos a ofrecer las mejores papayas frescas y deliciosas, cultivadas con amor y cuidado. Ubicados en un área de 40 metros cuadrados, garantizamos la calidad y frescura de cada fruta.",
                    ctaText: "Descubre Nuestras Papayas",
                    ctaText2: "Contáctanos",
                },
                {
                    componente: "FormProps",
                    image: "/media/two-different-breeds-of-cats-side-by-side-outdoors-in-the-garden.webp",
                    title: "Sobre Papayacorp",
                    text: "En Papayacorp, ofrecemos las mejores papayas frescas en un área de 40 metros cuadrados. Nuestra pasión por la calidad y el sabor nos destaca en el mercado. Venga y disfrute de la frescura y dulzura de nuestra fruta.",
                    ctaText: "Descubre nuestras papayas",
                    ctaText2: "Contáctanos para más información",
                },
                {
                    componente: "FAQProps",
                    categories: [
                        {
                            category: "Sobre Nosotros",
                            questions: [
                                {
                                    question: "¿Qué es Papayacorp?",
                                    answer: "Papayacorp es una empresa dedicada a ofrecer las mejores papayas en un área de 40 metros cuadrados.",
                                },
                                {
                                    question: "¿Cuál es nuestra misión?",
                                    answer: "Nuestra misión es proporcionar papayas frescas y de alta calidad a nuestros clientes.",
                                },
                                {
                                    question: "¿Dónde nos encontramos?",
                                    answer: "Estamos ubicados en un lugar privilegiado, desde donde abastecemos a nuestra comunidad.",
                                },
                            ],
                        },
                    ],
                },
                {
                    componente: "GalleryProps",
                    title: "Sobre Papayacorp",
                    images: [
                        "/media/images.jpeg",
                        "/media/pexels-pixabay-104827.jpg",
                        "/media/photo-1529778873920-4da4926a72c2.jpeg",
                    ],
                },
                {
                    componente: "TeamProps",
                    title: "Sobre Papayacorp",
                    text: "En Papayacorp, nos dedicamos a ofrecer las mejores papayas en un radio de 40 metros cuadrados. Nos apasiona brindar productos frescos y de alta calidad a nuestros clientes.",
                    members: [
                        {
                            photo: "/media/premium_photo-1673967831980-1d377baaded2.jpeg",
                            name: "Juan Pérez",
                            role: "Fundador",
                        },
                        {
                            photo: "/media/two-different-breeds-of-cats-side-by-side-outdoors-in-the-garden.webp",
                            name: "Maria López",
                            role: "Gerente de Ventas",
                        },
                        {
                            photo: "/media/images.jpeg",
                            name: "Carlos González",
                            role: "Jefe de Producción",
                        },
                    ],
                },
            ],
        },
        {
            ruta: "/faqs",
            componentes: [
                {
                    componente: "HeroProps",
                    image: "/media/pexels-pixabay-104827.jpg",
                    title: "Preguntas Frecuentes",
                    text: "Aquí puedes encontrar respuestas a las dudas más comunes sobre nuestra deliciosa papaya y el servicio que ofrecemos.",
                    ctaText: "Contáctanos para más información",
                    ctaText2: "Explora nuestras variedades de papaya",
                },
                {
                    componente: "InfoGridProps",
                    items: [
                        {
                            image: "/media/photo-1529778873920-4da4926a72c2.jpeg",
                            title: "Sobre nosotros",
                            text: "En Papayacorp, ofrecemos las mejores papayas frescas, cultivadas con amor y cuidado. Nuestra pasión por la calidad nos distingue en el mercado.",
                            buttonText: "Conoce más",
                        },
                        {
                            image: "/media/premium_photo-1673967831980-1d377baaded2.jpeg",
                            title: "Nuestra historia",
                            text: "Fundada con el objetivo de llevar la mejor papaya a tu mesa, Papayacorp ha crecido gracias a la confianza de nuestros clientes. Somos tu fuente de fruta fresca.",
                            buttonText: "Descubre nuestra historia",
                        },
                        {
                            image: "/media/two-different-breeds-of-cats-side-by-side-outdoors-in-the-garden.webp",
                            title: "Nuestros productos",
                            text: "Explora nuestra variedad de papayas. Cada fruta está seleccionada para garantizar frescura y sabor, perfecta para cualquier ocasión.",
                            buttonText: "Ver productos",
                        },
                        {
                            image: "/media/images.jpeg",
                            title: "Contáctanos",
                            text: "¿Tienes preguntas o comentarios? Estamos aquí para ayudarte. No dudes en contactarnos y resolveremos tus dudas.",
                            buttonText: "Contáctanos",
                        },
                    ],
                },
                {
                    componente: "TestimonialsProps",
                    image: "/media/pexels-pixabay-104827.jpg",
                    title: "Preguntas Frecuentes sobre Papayacorp",
                    text: "Aquí encontrarás respuestas a las preguntas más comunes sobre nuestras deliciosas papayas y nuestros servicios.",
                    ctaText: "¿Tienes más preguntas? Contáctanos.",
                    ctaText2: "Visita nuestra tienda y disfruta de la mejor papaya.",
                },
                {
                    componente: "ProductGridProps",
                    image: "/media/photo-1529778873920-4da4926a72c2.jpeg",
                    title: "Preguntas Frecuentes",
                    text: "Aquí encontrarás respuestas a las dudas más comunes sobre nuestras papayas y servicios.",
                    ctaText: "¿Tienes más preguntas? Contáctanos.",
                    ctaText2: "Descubre nuestros productos.",
                },
                {
                    componente: "FAQProps",
                    categories: [
                        {
                            category: "General",
                            questions: [
                                {
                                    question: "¿Qué ofrece Papayacorp?",
                                    answer: "Las mejores papayas frescas del mercado.",
                                },
                                {
                                    question: "¿Dónde está ubicada Papayacorp?",
                                    answer: "En un área de 40 metros cuadrados.",
                                },
                            ],
                        },
                        {
                            category: "Servicio al Cliente",
                            questions: [
                                {
                                    question: "¿Puedo hacer un pedido por teléfono?",
                                    answer: "Sí, aceptamos pedidos telefónicos.",
                                },
                                {
                                    question: "¿Ofrecen entrega a domicilio?",
                                    answer: "Sí, ofrecemos entrega en la zona.",
                                },
                            ],
                        },
                        {
                            category: "Productos",
                            questions: [
                                {
                                    question: "¿Qué tipos de papayas venden?",
                                    answer: "Varias variedades de papayas frescas.",
                                },
                                {
                                    question: "¿Son sus papayas orgánicas?",
                                    answer: "Sí, promovemos el cultivo orgánico.",
                                },
                            ],
                        },
                    ],
                },
                {
                    componente: "FormProps",
                    image: "/media/premium_photo-1673967831980-1d377baaded2.jpeg",
                    title: "Preguntas Frecuentes - Papayacorp",
                    text: "Encuentra respuestas a tus dudas sobre nuestras papayas. Conoce más sobre la calidad, el proceso de compra, y el envío.",
                    ctaText: "Consulta nuestras FAQ",
                    ctaText2: "Contáctanos para más información.",
                },
            ],
        },
        {
            ruta: "/contacto",
            componentes: [
                {
                    componente: "HeroProps",
                    image: "/media/two-different-breeds-of-cats-side-by-side-outdoors-in-the-garden.webp",
                    title: "Contacto - Papayacorp",
                    text: "¿Tienes preguntas o comentarios? Estamos aquí para ayudarte. Contáctanos y descubre más sobre nuestras deliciosas papayas.",
                    ctaText: "Escríbenos",
                    ctaText2: "Visítanos",
                },
                {
                    componente: "InfoGridProps",
                    items: [
                        {
                            image: "/media/images.jpeg",
                            title: "Calidad y Sabor",
                            text: "Disfruta de las papayas más frescas y sabrosas de la región, seleccionadas con cuidado cada día.",
                            buttonText: "Ver Productos",
                        },
                        {
                            image: "/media/pexels-pixabay-104827.jpg",
                            title: "Cosechas Frescas",
                            text: "Recolección diaria para asegurar la máxima frescura y calidad en cada bocado.",
                            buttonText: "Conocer Más",
                        },
                        {
                            image: "/media/photo-1529778873920-4da4926a72c2.jpeg",
                            title: "Cultivo Sustentable",
                            text: "Nos comprometemos con prácticas agrícolas responsables que cuidan del medio ambiente.",
                            buttonText: "Descubre Nuestra Misión",
                        },
                        {
                            image: "/media/premium_photo-1673967831980-1d377baaded2.jpeg",
                            title: "Contáctanos",
                            text: "¿Tienes preguntas? Estamos aquí para ayudarte. ¡Escríbenos o visítanos!",
                            buttonText: "Enviar Mensaje",
                        },
                    ],
                },
                {
                    componente: "TestimonialProps",
                    testimonies: [
                        {
                            name: "Juan Pérez",
                            rating: 5,
                            comment: "Las mejores papayas que he probado!",
                        },
                        {
                            name: "María López",
                            rating: 4,
                            comment: "Excelente calidad, muy frescas.",
                        },
                        {
                            name: "Carlos García",
                            rating: 5,
                            comment: "El sabor es inigualable, totalmente recomendable.",
                        },
                    ],
                },
                {
                    componente: "ProductGridProps",
                    image: "/media/two-different-breeds-of-cats-side-by-side-outdoors-in-the-garden.webp",
                    title: "Contáctanos",
                    text: "¿Tienes preguntas o comentarios? Estamos aquí para ayudarte. ¡Contáctanos hoy!",
                    ctaText: "Enviar un mensaje",
                    ctaText2: "Llamar ahora",
                },
                {
                    componente: "FAQProps",
                    categories: [
                        {
                            category: "Información General",
                            questions: [
                                {
                                    question: "¿Qué ofrece Papayacorp?",
                                    answer: "Las mejores papayas frescas y de calidad.",
                                },
                                {
                                    question: "¿Dónde se encuentra Papayacorp?",
                                    answer: "Dentro de un radio de 40 metros cuadrados.",
                                },
                            ],
                        },
                        {
                            category: "Contacto",
                            questions: [
                                {
                                    question: "¿Cómo puedo contactarlos?",
                                    answer: "Puedes enviarnos un email a contacto@papayacorp.com o llamarnos al 123-456-789.",
                                },
                                {
                                    question: "¿Tienen redes sociales?",
                                    answer: "Sí, síguenos en Facebook e Instagram como @papayacorp.",
                                },
                            ],
                        },
                        {
                            category: "Ubicación",
                            questions: [
                                {
                                    question: "¿Dónde está ubicada la tienda?",
                                    answer: "Encuéntranos en la dirección principal de nuestra ciudad.",
                                },
                                {
                                    question: "¿Hay estacionamiento disponible?",
                                    answer: "Sí, contamos con estacionamiento para nuestros clientes.",
                                },
                            ],
                        },
                    ],
                },
                {
                    componente: "ContactProps",
                    image: "/media/images.jpeg",
                    title: "Contáctanos",
                    text: "¿Tienes preguntas o consultas? Estamos aquí para ayudarte. Llena el formulario y nos pondremos en contacto contigo lo antes posible.",
                    ctaText: "Enviar mensaje",
                    ctaText2: "Llamar ahora",
                },
            ],
        },
        {
            ruta: "/productoIndividual",
            componentes: [
                {
                    componente: "ProductoIndividual",
                },
            ],
        },
    ],
};

export default PAGE_CONFIG;
