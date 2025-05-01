import React from "react";

interface InfoItem {
  image?: string;
  title?: string;
  text?: string;
  buttonText?: string;
}

interface InfoGridProps {
  items?: InfoItem[];
  primaryColor?: string;
}

export function InfoGridProps({ items, primaryColor }: InfoGridProps) {
  return (
    <section className="bg-white py-10">
      <div className="container mx-auto px-4">
        <h2 className="mb-6 text-2xl font-semibold">InfoGridProps</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {items &&
            items.map((item, idx) => (
              <div key={idx} className="rounded border p-4 shadow-sm">
                <h4 className="mb-2 text-lg font-bold">{item.title}</h4>
                <p className="mb-4 text-sm">{item.text}</p>
                {item.image && <img src={item.image} alt={item.title} className="mb-4 w-full" />}
                <button
                  style={{ backgroundColor: primaryColor || "#2563eb" }}
                  className="rounded bg-blue-500 px-4 py-2 text-white">
                  {item.buttonText}
                </button>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

export default InfoGridProps;
