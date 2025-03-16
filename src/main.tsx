
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import Index from './pages/Index.tsx'
import NotFound from './pages/NotFound.tsx'
import DeploymentDashboard from './pages/DeploymentDashboard.tsx'
import Documentation from './pages/Documentation.tsx'
import API from './pages/API.tsx'
import APIManagement from './pages/APIManagement.tsx'
import About from './pages/About.tsx'
import Contact from './pages/Contact.tsx'
import Privacy from './pages/Privacy.tsx'
import Terms from './pages/Terms.tsx'

// Clear any cached styles that might be preventing theme changes
if (typeof window !== 'undefined') {
  const head = document.head;
  const stylesheets = head.querySelectorAll('style');
  stylesheets.forEach(sheet => {
    if (sheet.innerHTML.includes('--primary') || sheet.innerHTML.includes('--background')) {
      sheet.remove();
    }
  });
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Index />} />
        <Route path="/deployment" element={<DeploymentDashboard />} />
        <Route path="/documentation" element={<Documentation />} />
        <Route path="/api" element={<API />} />
        <Route path="/api-management" element={<APIManagement />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
