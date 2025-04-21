
// This is a wrapper around the toast component from shadcn/ui
import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast";

import {
  useToast as useToastOriginal,
} from "@/components/ui/use-toast";

// Define the extended toast props type with all required properties
export type ExtendedToastProps = {
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  title?: string;
  description?: string;
  duration?: number;
  action?: ToastActionElement;
};

// Wrapper for useToast that handles the extended variants
export const useToast = () => {
  const originalHook = useToastOriginal();

  return {
    ...originalHook,
    toast: (props: ExtendedToastProps) => {
      // Pass all props to the original toast function
      return originalHook.toast(props);
    }
  };
};

// Extended toast function that handles all variants
export const toast = (props: ExtendedToastProps) => {
  // Use the original toast function from use-toast.ts
  return useToastOriginal().toast(props);
};
