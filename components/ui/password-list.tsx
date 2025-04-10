'use client';

import { useState } from 'react';
import { Card } from './card';
import { Input } from './input';
import { Button } from './button';
import { Copy, Eye, EyeOff, Trash2 } from 'lucide-react';

interface PasswordEntry {
  id: string;
  service: string;
  username: string;
  password: string;
  category: string;
}

interface PasswordListProps {
  passwords: PasswordEntry[];
  onDelete: (id: string) => void;
}

export function PasswordList({ passwords, onDelete }: PasswordListProps) {
  const [search, setSearch] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const categories = ['all', ...new Set(passwords.map(p => p.category))];

  const filteredPasswords = passwords.filter(p => {
    const matchesSearch = p.service.toLowerCase().includes(search.toLowerCase()) ||
                         p.username.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap">
        <Input
          placeholder="Search passwords..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded-md px-3 py-2"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPasswords.map((entry) => (
          <Card key={entry.id} className="p-4 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">{entry.service}</h3>
              <span className="text-sm bg-secondary px-2 py-1 rounded-full">
                {entry.category}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Username:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono">{entry.username}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(entry.username)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Password:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono">
                    {visiblePasswords.has(entry.id)
                      ? entry.password
                      : '••••••••'}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => togglePasswordVisibility(entry.id)}
                  >
                    {visiblePasswords.has(entry.id) 
                      ? <EyeOff className="h-4 w-4" />
                      : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(entry.password)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                variant="destructive"
                size="icon"
                onClick={() => onDelete(entry.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredPasswords.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No passwords found
        </div>
      )}
    </div>
  );
}