"use client";

import { createContext, useContext } from "react";
import type { BusinessContextType } from "@/src/types";

const BusinessContext = createContext<BusinessContextType | null>(null);

export function BusinessProvider({
  business,
  children,
}: {
  business: BusinessContextType;
  children: React.ReactNode;
}) {
  return (
    <BusinessContext.Provider value={business}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error("useBusiness must be used inside BusinessProvider");
  }
  return context;
}
