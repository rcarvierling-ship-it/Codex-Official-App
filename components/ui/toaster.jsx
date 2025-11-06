'use client';

import { useToast } from "./use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./toast";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, onOpenChange, open, ...props }) {
        const handleClose = () => {
          if (onOpenChange) {
            onOpenChange(false);
          }
          dismiss(id);
        };

        return (
          <Toast 
            key={id} 
            {...props} 
            open={open !== false}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                handleClose();
              }
            }}
          >
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleClose();
              }} 
              aria-label="Close notification" 
            />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
} 
