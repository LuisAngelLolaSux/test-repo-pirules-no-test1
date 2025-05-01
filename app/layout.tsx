import "../app/globals.css";

export const metadata = { title: "Mi Site Modular", description: "Demo" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased bg-white">{children}</body>
    </html>
  );
}
