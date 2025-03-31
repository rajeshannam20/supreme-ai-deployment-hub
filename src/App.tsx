
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { DeploymentProvider } from "./contexts/DeploymentContext";
import { ChatProvider } from "./contexts/ChatContext";
import { APIProvider } from "./contexts/APIContext";
import ChatInterface from "./components/ChatInterface";
import { MatrixRain } from "./components/ui/matrix-rain";
import "./App.css";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" enableSystem>
        <TooltipProvider>
          <DeploymentProvider>
            <APIProvider>
              <ChatProvider>
                {/* Matrix Rain Background - present on all pages */}
                <MatrixRain speed={0.8} density={0.4} opacity={0.2} />
                
                {/* Semi-transparent overlay for better readability */}
                <div className="fixed inset-0 bg-black/80 -z-10"></div>
                
                <Toaster 
                  theme="dark"
                  toastOptions={{
                    style: { 
                      background: 'rgba(0, 0, 0, 0.8)',
                      border: '1px solid rgba(0, 255, 65, 0.2)',
                      color: 'white'
                    }
                  }}
                />
                <div className="min-h-screen flex flex-col bg-black text-white">
                  <Navbar transparent={isHome} />
                  <main className="flex-grow">
                    <Outlet />
                  </main>
                  {/* Only show footer on non-home pages as home already has one */}
                  {!isHome && <Footer />}
                  <ChatInterface />
                </div>
              </ChatProvider>
            </APIProvider>
          </DeploymentProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
