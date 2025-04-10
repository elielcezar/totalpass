'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { encryptData, decryptData, isValidPassword } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [masterPassword, setMasterPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const hasStoredData = localStorage.getItem('passwordManager') !== null;
        if (!hasStoredData) {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (!isValidPassword(masterPassword)) {
        setError('Password must be at least 8 characters long');
        return;
      }

      const encryptedData = localStorage.getItem('passwordManager');
      
      if (!encryptedData) {
        // First time setup
        localStorage.setItem('masterPassword', masterPassword);
        localStorage.setItem('passwordManager', encryptData([], masterPassword));
        router.push('/dashboard');
        return;
      }

      const storedMasterPassword = localStorage.getItem('masterPassword');
      if (masterPassword === storedMasterPassword) {
        router.push('/dashboard');
      } else {
        setError('Incorrect master password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <Card className="w-full max-w-md p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-8">Password Manager</h1>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="masterPassword">Master Password</Label>
            <Input
              id="masterPassword"
              type="password"
              value={masterPassword}
              onChange={(e) => setMasterPassword(e.target.value)}
              placeholder="Enter your master password"
              className="w-full"
              required
              minLength={8}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <Button type="submit" className="w-full">
            {localStorage.getItem('passwordManager') ? 'Login' : 'Set Master Password'}
          </Button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-500">
          {localStorage.getItem('passwordManager')
            ? 'Enter your master password to access your passwords'
            : 'Create a master password to get started'}
        </p>
      </Card>
    </div>
  );
}