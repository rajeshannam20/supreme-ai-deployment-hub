
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
import "./App.css";

// Create a client
const queryClient = new QueryClient();

// Note: We don't need createBrowserRouter in this file since we're using BrowserRouter in main.tsx

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
                <Toaster />
                <div className="min-h-screen flex flex-col">
                  <Navbar />
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
