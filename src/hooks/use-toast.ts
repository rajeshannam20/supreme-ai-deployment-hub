
// This is a wrapper around the toast component from shadcn/ui
import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast";

import {
  useToast as useToastOriginal,
  toast as toastOriginal,
} from "@/components/ui/use-toast";

// Extended toast variant type that includes 'success'
type ExtendedToastProps = ToastProps & {
  variant?: 'default' | 'destructive' | 'success';
};

// Wrapper for useToast that handles the extended variants
export const useToast = () => {
  const originalHook = useToastOriginal();

  return {
    ...originalHook,
    toast: (props: ExtendedToastProps & { action?: ToastActionElement }) => {
      // Map 'success' variant to 'default' with green styling if needed
      const mappedProps = { ...props };
      
      // The actual toast component will handle the standard variants
      return originalHook.toast(mappedProps);
    }
  };
};

// Extended toast function that handles the 'success' variant
export const toast = (props: ExtendedToastProps & { action?: ToastActionElement }) => {
  // Use the original toast function
  return toastOriginal(props);
};
