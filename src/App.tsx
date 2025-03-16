import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Outlet } from "react-router-dom";
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

// Update the route configuration in the router definition to include the new documentation routes:
const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    errorElement: <NotFound />,
  },
  {
    path: "/documentation/*",
    element: <Documentation />,
  },
  {
    path: "/api",
    element: <API />,
  },
  {
    path: "/api-management",
    element: <APIManagement />,
  },
  {
    path: "/deployment-dashboard",
    element: <DeploymentDashboard />,
  },
]);

const App = () => (
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
                <Footer />
                <ChatInterface />
              </div>
            </ChatProvider>
          </APIProvider>
        </DeploymentProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
