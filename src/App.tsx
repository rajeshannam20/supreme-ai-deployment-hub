
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import DeploymentDashboard from "./pages/DeploymentDashboard";
import APIManagement from "./pages/APIManagement";
import Documentation from "./pages/Documentation";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import AgentDashboard from "./pages/AgentDashboard";
import { Toaster } from "./components/ui/sonner";
import { ChatProvider } from "./contexts/ChatContext";
import { ThemeProvider } from 'next-themes';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ChatProvider>
        <Router>
          <Navbar />
          <main className="min-h-screen">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/deployment" element={<DeploymentDashboard />} />
              <Route path="/api" element={<APIManagement />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/agents" element={<AgentDashboard />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </Router>
        <Toaster />
      </ChatProvider>
    </ThemeProvider>
  );
}

export default App;
