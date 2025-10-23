'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface FloatingBannerProps {
  message: string;
  variant?: 'info' | 'success' | 'warn';
  dismissible?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center';
  linkText?: string;
  linkUrl?: string;
  messageId: string;
}

export function FloatingBanner({
  message,
  variant = 'info',
  dismissible = true,
  position = 'top-right',
  linkText,
  linkUrl,
  messageId,
}: FloatingBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if banner was dismissed
    const dismissedData = localStorage.getItem(`banner-${messageId}`);
    if (dismissedData) {
      const { dismissedAt } = JSON.parse(dismissedData);
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

      if (new Date(dismissedAt).getTime() > sevenDaysAgo) {
        setIsDismissed(true);
        return;
      }
    }

    // Show banner after a short delay
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, [messageId]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(
      `banner-${messageId}`,
      JSON.stringify({
        dismissedAt: new Date().toISOString(),
      })
    );
    setTimeout(() => setIsDismissed(true), 300);
  };

  if (isDismissed) return null;

  const variantStyles = {
    info: 'bg-primary-50 border-primary-200 text-primary-900',
    success: 'bg-green-50 border-green-200 text-green-900',
    warn: 'bg-yellow-50 border-yellow-200 text-yellow-900',
  };

  const positionStyles = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: position.includes('top') ? -20 : 20, x: 0 }}
          animate={{ opacity: 1, y: 0, x: position === 'top-center' ? '-50%' : 0 }}
          exit={{ opacity: 0, y: position.includes('top') ? -20 : 20 }}
          transition={{ duration: 0.3 }}
          className={cn(
            'fixed z-50 max-w-md rounded-2xl border-2 p-4 shadow-lg',
            variantStyles[variant],
            positionStyles[position]
          )}
        >
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="text-sm leading-relaxed">{message}</p>
              {linkText && linkUrl && (
                <Link
                  href={linkUrl}
                  className="mt-2 inline-block text-sm font-medium underline hover:no-underline"
                >
                  {linkText}
                </Link>
              )}
            </div>
            {dismissible && (
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 rounded-lg p-1 hover:bg-black/5 transition-colors"
                aria-label="Dismiss banner"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
