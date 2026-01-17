"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { API } from "@/lib/api";

type Lead = {
  id: string; // Changed from number to string
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
    setLoading(true);
    try {
      const token = localStorage.getItem("Auth");

      if (!token) {
        console.error("No authentication token found");
        setLeads([]);
        return;
      }

      const response = await fetch(API.showallbookings, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("API response not OK:", response.status);
        setLeads([]);
        return;
      }

      const data = await response.json();
      console.log("Leads data from API:", data);

      // Handle different response formats
      let fetchedLeads: Lead[] = [];

      if (data.bookings) {
        fetchedLeads = data.bookings;
      } else if (data.leads) {
        fetchedLeads = data.leads;
      } else if (Array.isArray(data)) {
        fetchedLeads = data;
      }

      // Ensure IDs are strings
      fetchedLeads = fetchedLeads.map((lead) => ({
        ...lead,
        id: String(lead.id), // Convert ID to string
      }));

      setLeads(fetchedLeads);
    } catch (error) {
      console.error("Error fetching leads:", error);
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
