'use client';

import React from 'react';
import Link from 'next/link';
import { Card, Button, Badge } from '@/common/components';
import { IMachine } from '@/types';
import { Layers, Eye } from 'lucide-react';

interface MachineCardProps {
  machine: IMachine;
  onViewDetails?: (machine: IMachine) => void;
}

export function MachineCard({ machine, onViewDetails }: MachineCardProps) {
  return (
    <Card className="flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-3">
          <Badge variant="primary">{machine.category?.name || 'Machinery'}</Badge>
          {machine.manufacturingYear && (
            <span className="text-xs text-slate-500 font-mono">{machine.manufacturingYear}</span>
          )}
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-1 tracking-tight">
          {machine.modelName} <span className="text-slate-500 font-normal text-base">{machine.variant}</span>
        </h3>

        <p className="text-xs text-slate-500 mb-4">Vendor: {machine.vendor?.name || 'Generic Vendor'}</p>

        {machine.prices && machine.prices.length > 0 && (
          <div className="mb-4 bg-emerald-50/60 p-3 rounded-xl border border-emerald-200/80">
            <span className="text-[11px] text-emerald-800 block uppercase tracking-wider font-semibold">
              Ex-Factory Price
            </span>
            <span className="text-lg font-extrabold text-emerald-700">
              ₹{(machine.prices[0].amount / 100000).toFixed(2)} Lakh
            </span>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails && onViewDetails(machine)}
          leftIcon={<Eye className="w-3.5 h-3.5" />}
        >
          View Specs
        </Button>

        <Link href={`/user/compare?machineId=${machine.id}`}>
          <Button variant="secondary" size="sm" leftIcon={<Layers className="w-3.5 h-3.5" />} className="w-full">
            + Compare
          </Button>
        </Link>
      </div>
    </Card>
  );
}
