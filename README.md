This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Guía de Componentes

A continuación se muestran pautas para configurar componentes de React que funcionen con la carga de páginas dinámica en este proyecto:

1. Nombres y Exports  
   • Cada componente debe tener un export con el mismo nombre que su archivo.  
   • Los componentes con distintas variaciones deben seguir el fromato numerado {nombreComponente}{# de variacion}
   • Por ejemplo, Hero1.tsx exporta "Hero1" y debe importarse con ese nombre exacto al utilizarlo dinámicamente, y los variantes serian Hero2, Hero3, etc.
   

2. Convención de Props  
   • La mayoría de componentes aceptan props opcionales como "primaryColor," "secondaryColor" o "textColor."  
   • Además, muchos componentes aceptan props de tipo "TextFormat," que pueden ser un string o un objeto con "text" y "className." para poder dar formatos especiales 
   • Asegúrate de definir todas las props personalizadas como opcionales cuando sea necesario, para evitar errores si dichas props no se pasan.

3. Helpers de Renderizado  
   • Muchos componentes tienen una función "renderTextFormat" para manejar un string o un objeto "TextFormat." Seguir este patrón de manera consistente.

4. Registro y Uso Dinámico  
   • Los componentes se registran en "lib/registry" (importado como R en "page.tsx"). Deben ser exports nominales explicitos para ser reconocidos e instanciados dinámicamente.  
   • No cambies la firma del componente (props o nombre de export) si se usa en el registro; la carga dinámica podría fallar.

5. Obtención de Datos y “'use client'”  
   • Algunos componentes (por ejemplo, ProductGridProps) obtienen datos de una API. Si un componente obtiene datos directamente, márcalo con “'use client'” si se ejecuta en el cliente.  
   • De lo contrario, manténer la obtención de datos en componentes o rutas del servidor siempre que sea posible.

6. Layout y Componentes Wrapper  
   • El componente Layout administra el renderizado de diferentes secciones (header, barras laterales, footer). Evita modificar Layout a menos que sea necesario. queda pendiente de refactorizar
   • Mantén cada componente aislado con efectos mínimos para asegurar que pueda incluirse dinámicamente sin interferir con otras partes de la página.

7. Estilos y Uso de Tailwind  
   • El proyecto usa Tailwind. Emplea clases utilitarias e inline styles para cambios de color dinámicos.  
   • Define color, layout y espacios mediante props si se usan en varias secciones.

8. Pruebas y Mantenimiento  
   • Antes de confirmar cambios, verifica que los componentes se rendericen correctamente en la estructura de página dinámica registrándolos y usándolos en la configuración de la página, de ser posible  
   • Mantén las importaciones consistentes. Evita exports por defecto en componentes muy reutilizados, a menos que se requiera en el patrón actual.
