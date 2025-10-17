import { useState } from 'react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import LoginForm from './login-form';
import RegisterForm from './register-form';

interface GarenaAuthDialogProps {
  children: React.ReactNode;
}

export default function GarenaAuthDialog({ children }: GarenaAuthDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleClose = () => {
    setIsOpen(false);
    setAuthMode('login'); // Reset to login mode when closing
  };

  const handleSwitchToRegister = () => {
    setAuthMode('register');
  };

  const handleSwitchToLogin = () => {
    setAuthMode('login');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      {authMode === 'login' ? (
        <LoginForm
          isOpen={isOpen}
          onClose={handleClose}
          onSwitchToRegister={handleSwitchToRegister}
        />
      ) : (
        <RegisterForm
          isOpen={isOpen}
          onClose={handleClose}
          onSwitchToLogin={handleSwitchToLogin}
        />
      )}
    </Dialog>
  );
}
