'use client';

import { ReactNode } from 'react';
import { ShortcutPrompt } from '@/components/ShortcutPrompt';

interface AppInstallWrapperProps {
  children: ReactNode;
}

/**
 * Client-side wrapper for shortcut installation
 */
export function AppInstallWrapper({ children }: AppInstallWrapperProps) {
  return (
    <>
      <ShortcutPrompt />
      {children}
    </>
  );
}
