import { RouterProvider, createRouter } from "@tanstack/react-router"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { ThemeProvider } from "./components/theme-provider/theme-provider"
import "./index.css"

import { registerChartComponents } from "./components/xai_predictor/core/config/chartConfig"
import { QueryProvider } from "./components/xai_predictor/core/providers/QueryProvider"

// Import the generated route tree
import { routeTree } from "./routeTree.gen"

// Create a new router instance
const router = createRouter({
  routeTree,
  defaultPendingMs: 0,
  defaultPendingMinMs: 500,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

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
