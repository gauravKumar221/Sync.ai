"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { API } from "@/lib/api";

type Lead = {
  id: number;
  name: string;
  phone: string;
  problem: string;
  date: string;
  time: string;
  status: string;
  created_at: string;
};

type LeadContextType = {
  leads: Lead[];
  loading: boolean;
  refetchLeads: () => Promise<void>;
};

const LeadContext = createContext<LeadContextType | null>(null);

export function LeadProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem("Auth");
      const res = await fetch(API.showallbookings, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      // 🛡 Safety guard — prevents map crash forever
      if (Array.isArray(data)) {
        setLeads(data);
        console.log("Leads fetched successfully:", data);
      } else {
        console.error("Invalid leads response:", data);
        setLeads([]);
      }
    } catch (err) {
      console.error("Failed to fetch leads:", err);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <LeadContext.Provider value={{ leads, loading, refetchLeads: fetchLeads }}>
      {children}
    </LeadContext.Provider>
  );
}

export function useLeads() {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error("useLeads must be used inside LeadProvider");
  }
  return context;
}
