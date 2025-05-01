"use client";
import React from "react";
import { Outlet } from "react-router-dom";
import { ComponentConfig, SiteConfig, TextFormat } from "../types/components";
import * as Registry from "../lib/registry";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  layoutSections: Partial<{
    header: { componentes: ComponentConfig[] };
    leftSidebar: { componentes: ComponentConfig[] };
    rightSidebar: { componentes: ComponentConfig[] };
    footer: { componentes: ComponentConfig[] };
  }>[];
  colors: SiteConfig["colores"];
  children?: React.ReactNode;
}

export function Layout({ layoutSections, colors, children }: LayoutProps) {
  // Fallback if any section is missing
  const safeLayout = {
    header: layoutSections?.header || { componentes: [] },
    leftSidebar: layoutSections?.leftSidebar || { componentes: [] },
    rightSidebar: layoutSections?.rightSidebar || { componentes: [] },
    footer: layoutSections?.footer || { componentes: [] },
  };

  // Helper to ensure links are of type Link[]
  const mapLinks = (links: any[] = []) =>
    links.map((l) => ({
      ...l,
      name: typeof l.name === "string" ? { text: l.name } : l.name,
    }));

  // Helper to convert string or undefined to TextFormat
  const toTextFormat = (val: string | undefined): TextFormat =>
    typeof val === "string" ? { text: val } : { text: "" };

  const toTextFormatOpt = (val: string | undefined): TextFormat | undefined =>
    typeof val === "string" ? { text: val } : undefined;

  const toTextFormatArray = (arr: any[] | undefined): TextFormat[] =>
    Array.isArray(arr) ? arr.map((v) => (typeof v === "string" ? { text: v } : v)) : [];

  const renderComponent = (component: ComponentConfig) => {
    const Comp = (Registry as any)[component.componente];
    if (!Comp) {
      console.error(`Component ${component.componente} not found in registry.`);
      return null;
    }
    return (
      <Comp
        {...component}
        primaryColor={colors.primary}
        secondaryColor={colors.secondary}
        textColor={colors.text}
      />
    );
  };

  return (
    <div>
      {/* Header region */}
      <header>
        {safeLayout.header.componentes.map((comp, index) => (
          <div key={index}>{renderComponent(comp)}</div>
        ))}
      </header>
      {/* Main container with conditional sidebars and no gaps */}
      <div className="m-0 flex p-0" style={{ gap: 0 }}>
        {safeLayout.leftSidebar.componentes.length > 0 && (
          <aside className="m-0 flex-none p-0" style={{ width: "20%" }}>
            {safeLayout.leftSidebar.componentes.map((comp, index) => (
              <div key={index}>{renderComponent(comp)}</div>
            ))}
          </aside>
        )}
        <main className="m-0 flex-grow p-0">
          <Outlet />
          {children}
        </main>
        {safeLayout.rightSidebar.componentes.length > 0 && (
          <aside className="m-0 flex-none p-0" style={{ width: "20%" }}>
            {safeLayout.rightSidebar.componentes.map((comp, index) => (
              <div key={index}>{renderComponent(comp)}</div>
            ))}
          </aside>
        )}
      </div>
      {/* Footer region */}
      <footer>
        {safeLayout.footer.componentes.map((comp, index) => (
          <div key={index}>{renderComponent(comp)}</div>
        ))}
      </footer>
    </div>
  );
}
