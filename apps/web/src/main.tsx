import { RouterProvider } from "@tanstack/react-router"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { ThemeProvider } from "./components/theme-provider/theme-provider"
import "./index.css"

import { registerChartComponents } from "./components/xai_predictor/core/config/chartConfig"
import { QueryProvider } from "./components/xai_predictor/core/providers/QueryProvider"
import { router } from "./routes"

// Initialize Chart.js components once at app startup
registerChartComponents();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryProvider>
        <RouterProvider router={router} />
      </QueryProvider>
    </ThemeProvider>
  </StrictMode>
)
