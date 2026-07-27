'use client';

import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Locale } from '@/config/locales';

interface SearchBarProps {
  locale: Locale;
  onClose?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ locale, onClose }) => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/${locale}/products?search=${encodeURIComponent(query.trim())}`);
    if (onClose) onClose();
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md">
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-blue-400 absolute left-3.5 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un bijou, pendentif, bague..."
          className="w-full bg-slate-800 border border-slate-700 rounded-full pl-10 pr-9 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-400 transition-all shadow-inner"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </form>
  );
};
