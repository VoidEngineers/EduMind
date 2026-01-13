import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import "./index.css"

import AdminApp from "./AdminApp"
import AdminSignin from "./AdminSignin"
import App from "./App"
import Engagement from "./Engagement"
import LMSHome from "./LMS/LMSHome"
import LearningStyle from "./LearningStyle"
import Navbar from "./Navbar"
import UserSignin from "./UserSignin"
import { TailwindTestComponent } from "./components/TailwindTestComponent"
import { registerChartComponents } from "./components/xai_predictor/config/chartConfig"
import { QueryProvider } from "./components/xai_predictor/providers/QueryProvider"
import XAIPrediction from "./components/xai_predictor/xai-prediction/XAIPrediction"

// Initialize Chart.js components once at app startup
registerChartComponents();


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/admin" element={<AdminApp />} />
          <Route path="/admin-signin" element={<AdminSignin />} />
          <Route path="/user-signin" element={<UserSignin />} />
          <Route path="/engagement" element={<Engagement />} />
          <Route path="/learning-style" element={<LearningStyle />} />
          <Route path="/lms" element={<LMSHome />} />
          <Route path="/analytics" element={<XAIPrediction />} />
          <Route path="/test-tailwind" element={<TailwindTestComponent />} />

        </Routes>
      </BrowserRouter>
    </QueryProvider>
  </StrictMode>
)
