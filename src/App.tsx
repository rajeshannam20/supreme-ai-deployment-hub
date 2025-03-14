
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { DeploymentProvider } from "./contexts/DeploymentContext";
import "./App.css";

// Create a client
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <DeploymentProvider>
          <Toaster />
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Outlet />
            </main>
            <Footer />
          </div>
        </DeploymentProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
