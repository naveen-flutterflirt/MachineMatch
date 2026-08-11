'use client';

import React from 'react';
import { Badge } from '@/common/components';
import { IComparisonData } from '@/types';
import { CheckCircle2, FileText, Sparkles, Layers } from 'lucide-react';

interface ComparisonTableProps {
  comparisonData: IComparisonData;
}

export function ComparisonTable({ comparisonData }: ComparisonTableProps) {
  if (!comparisonData || !comparisonData.machines) return null;

  const machineNames = comparisonData.machines.map((m) => m.modelName).filter(Boolean);
  const realTitle = machineNames.length > 1 ? machineNames.join(' vs ') : (machineNames[0] ? `${machineNames[0]} Spec Alignment` : 'Machinery Spec Comparison');

  const displayTitle = comparisonData.title && !comparisonData.title.includes('Side-by-Side Comparison') && comparisonData.title !== 'Machinery Comparison'
    ? comparisonData.title
    : realTitle;

  const displayCategory = comparisonData.machines[0]?.category?.name || comparisonData.category?.name || 'Heavy Machinery';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md space-y-0 text-slate-900">
      {/* Matrix Header Banner */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{displayTitle}</h2>
            <Badge variant="success" icon={<CheckCircle2 className="w-3 h-3" />}>
              Saved to Database
            </Badge>
          </div>
          <p className="text-xs text-slate-500">
            Comparing {comparisonData.machines.length} Models/PDF Brochures in Category:{' '}
            <strong className="text-emerald-700 font-semibold">{displayCategory}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="primary" icon={<FileText className="w-3 h-3" />}>
            {comparisonData.machines.length} PDF Brochures Aligned
          </Badge>
          <Badge variant="emeraldBest" icon={<Sparkles className="w-3 h-3" />}>
            MCDA Fit Scores Active
          </Badge>
        </div>
      </div>

      {/* Specification Alignment Matrix */}
      <div className="overflow-x-auto">
        {!comparisonData.rows || comparisonData.rows.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-slate-50/50">
            <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Technical Specifications Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              The selected documents or models do not contain technical machine performance specs. Please upload valid OEM machinery PDF brochures/quotations or select catalog models.
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-100/80 text-slate-800 uppercase text-xs tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-4 w-1/4">Specification Attribute</th>
                {comparisonData.machines.map((m) => (
                  <th key={m.id} className="p-4 text-center border-l border-slate-200/80">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span className="font-extrabold text-base text-slate-900">{m.modelName}</span>
                    </div>
                    <div className="text-xs text-slate-500 font-normal">{m.variant}</div>
                    <div className="text-xs text-emerald-700 font-medium mt-1">{m.vendor?.name || 'Vendor OEM'}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {comparisonData.rows?.map((row) => (
                <tr key={row.attributeId} className="hover:bg-slate-50 transition">
                  <td className="p-4 font-semibold text-slate-900">
                    {row.attributeName}{' '}
                    {row.standardUnit && <span className="text-xs text-slate-400">({row.standardUnit})</span>}
                  </td>
                  {row.values?.map((val) => {
                    const isBest = val.machineId === row.bestMachineId;
                    return (
                      <td
                        key={val.machineId}
                        className={`p-4 text-center font-medium border-l border-slate-200/80 ${
                          isBest
                            ? 'bg-emerald-100/70 text-emerald-900 font-bold border-l-2 border-emerald-500'
                            : 'text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          <span>{val.rawValue}</span>
                          {isBest && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
