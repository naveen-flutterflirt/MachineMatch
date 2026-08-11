'use client';

import React from 'react';
import { Modal, Button, Badge } from '@/common/components';
import { IMachine } from '@/types';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import { Cpu, CheckCircle2, Sparkles, Layers, DollarSign } from 'lucide-react';

interface MachineDetailModalProps {
  machine: IMachine | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MachineDetailModal({ machine, isOpen, onClose }: MachineDetailModalProps) {
  if (!machine) return null;

  // Fetch vector similarity suggestions ("Machines like this")
  const { data: similarData } = useQuery({
    queryKey: ['similar-machines', machine.id],
    queryFn: async () => {
      const res = await apiClient.get(API_ENDPOINTS.AI.SIMILAR(machine.id));
      return res.data.data;
    },
    enabled: Boolean(machine.id && isOpen),
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${machine.modelName} ${machine.variant || ''}`}
      subtitle={`Category: ${machine.category?.name || 'Machinery'} | Vendor: ${machine.vendor?.name || 'Generic'}`}
      size="lg"
    >
      <div className="space-y-6">
        {/* Specifications Grid */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-600" /> Extracted Specifications
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {machine.specifications && machine.specifications.length > 0 ? (
              machine.specifications.map((spec) => (
                <div key={spec.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <span className="text-[11px] text-slate-500 block truncate">
                    {spec.attribute?.name || 'Specification'}
                  </span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block">{spec.rawValue}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 col-span-3">No specification data available.</p>
            )}
          </div>
        </div>

        {/* Price Tiers */}
        {machine.prices && machine.prices.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" /> Pricing Structure
            </h4>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-800 font-medium uppercase tracking-wider block">
                  {machine.prices[0].priceType.replace('_', ' ')}
                </span>
                <span className="text-2xl font-extrabold text-emerald-700">
                  ₹{(machine.prices[0].amount / 100000).toFixed(2)} Lakh
                </span>
              </div>
              <Badge variant="emeraldBest">Verified Price</Badge>
            </div>
          </div>
        )}

        {/* Vector Similarity Suggestions ("Machines like this") */}
        {similarData && similarData.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" /> Similar Machines Across Brands
            </h4>
            <div className="space-y-2">
              {similarData.slice(0, 3).map((item: any) => {
                const simMachine = item.machine || item;
                return (
                  <div
                    key={simMachine.id}
                    className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between hover:border-emerald-300 transition"
                  >
                    <div>
                      <span className="text-sm font-semibold text-slate-900">{simMachine.modelName}</span>
                      <span className="text-xs text-slate-500 ml-2">{simMachine.vendor?.name}</span>
                    </div>
                    <Badge variant="secondary" size="sm">
                      {simMachine.category?.name}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal Action Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" size="sm" leftIcon={<Layers className="w-4 h-4" />}>
            + Add to Comparison
          </Button>
        </div>
      </div>
    </Modal>
  );
}
