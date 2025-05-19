"use client";
import type React from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CompanyDetails } from "@/typings/types";
import { getCompanyDetails } from "@/utils/server";

interface CompanyDetailsStoreState {
  companyDetails: CompanyDetails | null;
  loadingCompanyInfo: boolean;
  updateCompanyDetails: (carritoId: string) => Promise<void>;
  setLoadingCompanyInfo: (value: boolean) => void;
}

export const useCompanyDetailsStore = create(
  persist<CompanyDetailsStoreState>(
    (set) => ({
      companyDetails: null,
      loadingCompanyInfo: true,
      updateCompanyDetails: async (carritoId) => {
        set({ loadingCompanyInfo: true });
        try {
          const detailsString = await getCompanyDetails(carritoId);
          const details = JSON.parse(detailsString);
          set({ companyDetails: details });
          if (typeof window !== "undefined") {
            localStorage.setItem("companyDetails", JSON.stringify(details));
          }
        } catch (error) {
          console.error("Error updating company details:", error);
        } finally {
          set({ loadingCompanyInfo: false });
        }
      },
      setLoadingCompanyInfo: (value) => set({ loadingCompanyInfo: value }),
    }),
    {
      name: "company-details-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export function useCompanyDetails() {
  return useCompanyDetailsStore();
}
