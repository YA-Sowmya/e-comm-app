"use client";
import { create } from "zustand";

interface Details {
  name: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface CheckoutState {
  details: Details;
  setDetails: (d: Partial<Details>) => void;
  clearDetails: () => void;
}

const initial: Details = {
  name: "",
  email: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "US",
};

export const useCheckoutStore = create<CheckoutState>((set) => ({
  details: initial,
  setDetails: (d) => set((s) => ({ details: { ...s.details, ...d } })),
  clearDetails: () => set({ details: initial }),
}));
