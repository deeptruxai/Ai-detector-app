import React, { useEffect } from 'react';
import { useAppState } from '@/hooks/useAppState';
import { authService } from '@/service/firebase';

export interface ParentComponentProps {
  children: React.ReactNode;
}

const ParentComponent: React.FC<ParentComponentProps> = ({ children }) => {
  useAppState();

  useEffect(() => {
    authService.configureGoogleSignIn();
  }, []);

  return <>{children}</>;
};

export default ParentComponent;
