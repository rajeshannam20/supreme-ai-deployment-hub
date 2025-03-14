
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import Index from './pages/Index.tsx'
import NotFound from './pages/NotFound.tsx'
import DeploymentDashboard from './pages/DeploymentDashboard.tsx'

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
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
