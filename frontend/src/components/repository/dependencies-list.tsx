import React, { useState } from 'react';
import { Package, Search } from 'lucide-react';
import { DependencyItem } from '@/types/scanner';

interface Props {
  dependencies: DependencyItem[];
}

export const DependenciesList: React.FC<Props> = ({ dependencies }) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const filtered = dependencies.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || d.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          <h3 className="text-base font-bold tracking-tight text-foreground">Detected Third-Party Dependencies</h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search package..."
              className="rounded-lg border border-border bg-background py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-slate-500 focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex gap-1 text-xs">
            {['ALL', 'backend', 'frontend'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded font-semibold capitalize transition ${
                  categoryFilter === cat ? 'bg-primary text-primary-foreground' : 'bg-background border border-border text-slate-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border/50 text-slate-400 uppercase font-semibold">
            <tr>
              <th className="pb-3 pl-2">Package Name</th>
              <th className="pb-3">Version Constraint</th>
              <th className="pb-3 text-right pr-2">Category</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {filtered.map((dep, i) => (
              <tr key={i} className="hover:bg-accent/40 transition">
                <td className="py-2.5 pl-2 font-mono font-semibold text-foreground">{dep.name}</td>
                <td className="py-2.5 font-mono text-slate-400">{dep.version}</td>
                <td className="py-2.5 text-right pr-2">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                    dep.category === 'backend' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                  }`}>
                    {dep.category}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
