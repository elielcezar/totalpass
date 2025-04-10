'use client';

import { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Card } from './card';
import { Copy, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { generatePassword, calculatePasswordStrength } from '@/lib/utils';

interface PasswordEntryProps {
  onSave: (data: { service: string; username: string; password: string; category: string }) => void;
}

export function PasswordEntry({ onSave }: PasswordEntryProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    service: '',
    username: '',
    password: '',
    category: '',
  });
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    setFormData(prev => ({ ...prev, password: newPassword }));
    setPasswordStrength(calculatePasswordStrength(newPassword));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({ service: '', username: '', password: '', category: '' });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Card className="p-6 shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="service">Service Name</Label>
          <Input
            id="service"
            name="service"
            value={formData.service}
            onChange={handleInputChange}
            required
            placeholder="e.g., Gmail, Netflix"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            placeholder="e.g., Email, Entertainment"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <div className="relative">
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              placeholder="your-username"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => copyToClipboard(formData.username)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              required
              className="pr-24"
              placeholder="Enter password"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleGeneratePassword}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(formData.password)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className={`password-strength-indicator strength-${passwordStrength}`} />
        </div>

        <Button type="submit" className="w-full">
          Save Password
        </Button>
      </form>
    </Card>
  );
}