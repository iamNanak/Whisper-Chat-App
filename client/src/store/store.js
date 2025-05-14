import { create } from "zustand";
import { createAuthSlice } from "./slice/auth-slice.js";

export const useAppStore = create()((...a) => ({
  ...createAuthSlice(...a),
}));
