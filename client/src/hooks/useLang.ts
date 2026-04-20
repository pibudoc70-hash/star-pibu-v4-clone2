import { useContext } from "react";
import { LangContext } from "@/contexts/LangContext";
export function useLang() {
  const ctx = useContext(LangContext);
  return ctx;
}
