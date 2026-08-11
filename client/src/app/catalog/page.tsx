'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MachineCard, MachineDetailModal, useGetCategoryTree, useSearchMachines } from '@/features/catalog';
import { Input, Button } from '@/common/components';
import { IMachine } from '@/types';
import { Search, Layers, FileText, Sparkles } from 'lucide-react';

export default function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedMachine, setSelectedMachine] = useState<IMachine | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: categoriesData } = useGetCategoryTree();
  const { data: machinesData, isLoading } = useSearchMachines(searchTerm, selectedCategory);

  const machines: IMachine[] = machinesData?.data || [];

  const handleOpenDetails = (machine: IMachine) => {
    setSelectedMachine(machine);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Machinery Catalog</h1>
          <p className="text-slate-500 text-sm mt-1">Browse, filter, and compare heavy machinery specifications</p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/user/upload">
            <Button variant="secondary" size="sm" leftIcon={<FileText className="w-4 h-4 text-emerald-600" />}>
              Upload PDF Brochure
            </Button>
          </Link>
          <Link href="/user/compare">
            <Button variant="primary" size="sm" leftIcon={<Layers className="w-4 h-4" />}>
              Side-by-Side Compare
            </Button>
          </Link>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <div className="md:col-span-3">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by model name, variant, or manufacturer..."
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs"
          >
            <option value="">All Categories</option>
            {categoriesData?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Catalog Cards Grid */}
      {isLoading ? (
        <div className="text-center py-20 text-slate-500 font-medium">Loading machinery catalog...</div>
      ) : machines.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <p className="text-slate-600 text-base">No machinery models found matching your search.</p>
          <Link href="/user/upload" className="text-emerald-600 hover:underline text-sm font-semibold mt-3 inline-block">
            Upload a PDF brochure to add a new model ➔
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {machines.map((machine) => (
            <MachineCard key={machine.id} machine={machine} onViewDetails={handleOpenDetails} />
          ))}
        </div>
      )}

      {/* Machine Specification Details Modal */}
      <MachineDetailModal
        machine={selectedMachine}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
