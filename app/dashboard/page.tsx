'use client';

import { useState, useEffect } from 'react';
import { PasswordEntry } from '@/components/ui/password-entry';
import { PasswordList } from '@/components/ui/password-list';
import { encryptData, decryptData, delay } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PasswordData {
  id: string;
  service: string;
  username: string;
  password: string;
  category: string;
}

export default function Dashboard() {
  const [passwords, setPasswords] = useState<PasswordData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeData = async () => {
      try {
        const masterPassword = localStorage.getItem('masterPassword');
        if (!masterPassword) {
          router.push('/');
          return;
        }

        await delay(100); // Small delay to ensure localStorage is ready

        const encryptedData = localStorage.getItem('passwordManager');
        if (encryptedData) {
          const decryptedData = decryptData(encryptedData, masterPassword);
          if (decryptedData) {
            setPasswords(decryptedData);
          }
        }
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [router]);

  const handleSavePassword = async (data: Omit<PasswordData, 'id'>) => {
    try {
      const masterPassword = localStorage.getItem('masterPassword');
      if (!masterPassword) {
        router.push('/');
        return;
      }

      const newPassword = {
        ...data,
        id: crypto.randomUUID(),
      };

      const updatedPasswords = [...passwords, newPassword];
      setPasswords(updatedPasswords);
      
      const encryptedData = encryptData(updatedPasswords, masterPassword);
      localStorage.setItem('passwordManager', encryptedData);
    } catch (error) {
      console.error('Save password error:', error);
    }
  };

  const handleDeletePassword = async (id: string) => {
    try {
      const masterPassword = localStorage.getItem('masterPassword');
      if (!masterPassword) {
        router.push('/');
        return;
      }

      const updatedPasswords = passwords.filter(p => p.id !== id);
      setPasswords(updatedPasswords);
      
      const encryptedData = encryptData(updatedPasswords, masterPassword);
      localStorage.setItem('passwordManager', encryptedData);
    } catch (error) {
      console.error('Delete password error:', error);
    }
  };

  const handleLogout = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Password Manager</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid gap-8 md:grid-cols-[400px,1fr]">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Add New Password</h2>
            <PasswordEntry onSave={handleSavePassword} />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Your Passwords</h2>
            <PasswordList
              passwords={passwords}
              onDelete={handleDeletePassword}
            />
          </div>
        </div>
      </div>
    </div>
  );
}