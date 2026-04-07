import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import HorseMap from "./HorseMap.tsx";

const root = document.getElementById("root");
if (!root) throw new Error("No #root element found");

createRoot(root).render(
  <StrictMode>
    <HorseMap />
  </StrictMode>,
);
