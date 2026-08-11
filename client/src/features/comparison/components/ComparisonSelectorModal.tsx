'use client';

import React, { useState, useEffect } from 'react';
import { Modal, Button, Badge } from '@/common/components';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import { IMachine, ICategory, IUploadRecord } from '@/types';
import { CheckCircle2, Layers, FileText, Cpu } from 'lucide-react';
import { useCreateComparison } from '../hooks/useComparisonApi';
import { toast } from 'sonner';

interface ComparisonSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComparisonCreated: (comparisonId: string) => void;
}

export function ComparisonSelectorModal({
  isOpen,
  onClose,
  onComparisonCreated,
}: ComparisonSelectorModalProps) {
  const [activeTab, setActiveTab] = useState<'uploads' | 'catalog'>('uploads');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedMachineIds, setSelectedMachineIds] = useState<string[]>([]);
  const createComparisonMutation = useCreateComparison();

  // Fetch User's Uploaded PDF Brochures
  const { data: uploadsData, isLoading: isLoadingUploads } = useQuery({
    queryKey: ['my-uploads-for-compare'],
    queryFn: async () => {
      const res = await apiClient.get(API_ENDPOINTS.UPLOADS.MY_UPLOADS);
      return res.data.data as IUploadRecord[];
    },
    enabled: isOpen,
  });

  // Fetch Category Tree
  const { data: categories } = useQuery({
    queryKey: ['categories-tree'],
    queryFn: async () => {
      const res = await apiClient.get(API_ENDPOINTS.CATEGORIES.TREE);
      return res.data.data as ICategory[];
    },
    enabled: isOpen,
  });

  // Auto-set category if not set
  useEffect(() => {
    if (categories && categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  // Fetch Machines for Selected Category / Catalog Tab
  const { data: machinesData, isLoading: isLoadingMachines } = useQuery({
    queryKey: ['machines-for-compare', selectedCategoryId],
    queryFn: async () => {
      const params: any = { limit: 50 };
      if (selectedCategoryId) params.categoryId = selectedCategoryId;
      const res = await apiClient.get(API_ENDPOINTS.MACHINES.SEARCH, { params });
      return res.data.data?.data as IMachine[];
    },
    enabled: isOpen,
  });

  const uploads = uploadsData || [];
  const machines = machinesData || [];

  const toggleMachineSelect = (targetId: string, catId?: string) => {
    if (catId && !selectedCategoryId) {
      setSelectedCategoryId(catId);
    }

    if (selectedMachineIds.includes(targetId)) {
      setSelectedMachineIds(selectedMachineIds.filter((id) => id !== targetId));
    } else {
      if (selectedMachineIds.length >= 4) {
        toast.error('You can select a maximum of 4 items for side-by-side comparison.');
        return;
      }
      setSelectedMachineIds([...selectedMachineIds, targetId]);
    }
  };

  const handleCreateComparison = async () => {
    if (selectedMachineIds.length < 2) {
      toast.error('Please select at least 2 items to compare.');
      return;
    }

    const selectedNames: string[] = [];
    let detectedCatId: string | undefined = undefined;

    for (const id of selectedMachineIds) {
      const m = (machinesData || []).find((cm: any) => cm.id === id);
      if (m) {
        selectedNames.push(m.modelName);
        if (m.categoryId) detectedCatId = m.categoryId;
      } else {
        const u = (uploadsData || []).find((up: any) => up.id === id);
        if (u) {
          const name = u.ocrExtractedData?.modelName || u.originalName.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
          selectedNames.push(name);
          if (u.ocrExtractedData?.categoryId) {
            detectedCatId = u.ocrExtractedData.categoryId;
          }
        }
      }
    }

    const realTitle = selectedNames.length > 1 ? selectedNames.join(' vs ') : (selectedNames[0] ? `${selectedNames[0]} Spec Alignment` : 'Machinery Spec Comparison');
    const catId = detectedCatId || selectedCategoryId || (categories && categories.length > 0 ? categories[0].id : '');

    if (!catId) {
      toast.error('Category is required to build a specification matrix.');
      return;
    }

    try {
      const res = await createComparisonMutation.mutateAsync({
        categoryId: catId,
        machineIds: selectedMachineIds,
        title: realTitle,
      });

      toast.success('Specification matrix created successfully!');
      onComparisonCreated(res.id);
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create comparison matrix.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Side-by-Side Machinery Comparison"
      subtitle="Select 2 to 4 uploaded PDF brochures or catalog models to build an aligned specification matrix"
      size="lg"
    >
      <div className="space-y-6">
        {/* Source Tabs: PDF Uploads vs Catalog Models */}
        <div className="flex border-b border-slate-200 gap-6">
          <button
            onClick={() => setActiveTab('uploads')}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'uploads'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-600" /> My Uploaded PDF Brochures ({uploads.length})
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'catalog'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Cpu className="w-4 h-4 text-emerald-600" /> Browse Catalog Models ({machines.length})
          </button>
        </div>

        {/* Tab 1: Uploaded PDF Brochures */}
        {activeTab === 'uploads' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Select 2 to 4 Uploaded PDF Brochures ({selectedMachineIds.length}/4 selected)
              </label>
              {selectedMachineIds.length >= 2 && (
                <Badge variant="success" icon={<CheckCircle2 className="w-3 h-3" />}>
                  Ready to Compare
                </Badge>
              )}
            </div>

            {isLoadingUploads ? (
              <div className="py-8 text-center text-slate-500 text-sm">Loading your uploaded PDF brochures...</div>
            ) : uploads.length === 0 ? (
              <div className="py-8 text-center bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 text-xs">
                No PDF brochures uploaded yet. Go to <strong className="text-emerald-700">Upload PDF Brochure</strong> page to add brochures.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                {uploads.map((u) => {
                  let targetId = u.id;
                  if (u.ocrExtractedData) {
                    const ocrData = typeof u.ocrExtractedData === 'string' ? JSON.parse(u.ocrExtractedData) : u.ocrExtractedData;
                    if (ocrData.machineId) {
                      targetId = typeof ocrData.machineId === 'object' ? ocrData.machineId.machineId || u.id : String(ocrData.machineId);
                    }
                  }

                  const isSelected = selectedMachineIds.includes(targetId);

                  return (
                    <div
                      key={u.id}
                      onClick={() => toggleMachineSelect(targetId)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-500 text-slate-900 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2 rounded-xl bg-emerald-100/60 border border-emerald-200 text-emerald-700 shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{u.originalName}</h4>
                          <span className="text-[10px] text-slate-500 font-mono block truncate">
                            {u.fileName}
                          </span>
                        </div>
                      </div>
                      {isSelected ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-300 shrink-0 ml-2" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Catalog Models */}
        {activeTab === 'catalog' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Machinery Category
              </label>
              <select
                value={selectedCategoryId}
                onChange={(e) => {
                  setSelectedCategoryId(e.target.value);
                  setSelectedMachineIds([]);
                }}
                className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs"
              >
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Select Models ({selectedMachineIds.length}/4 selected)
                </label>
                {selectedMachineIds.length >= 2 && (
                  <Badge variant="success" icon={<CheckCircle2 className="w-3 h-3" />}>
                    Ready to Compare
                  </Badge>
                )}
              </div>

              {isLoadingMachines ? (
                <div className="py-8 text-center text-slate-500 text-sm">Loading available machinery models...</div>
              ) : machines.length === 0 ? (
                <div className="py-8 text-center bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 text-xs">
                  No models available for selected category. Try uploading PDF brochures or selecting another category.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-52 overflow-y-auto pr-1">
                  {machines.map((m) => {
                    const isSelected = selectedMachineIds.includes(m.id);
                    return (
                      <div
                        key={m.id}
                        onClick={() => toggleMachineSelect(m.id, m.categoryId)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-500 text-slate-900 shadow-sm'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{m.modelName}</h4>
                          <span className="text-[10px] text-slate-500">{m.variant}</span>
                        </div>
                        {isSelected ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-slate-300" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleCreateComparison}
            isLoading={createComparisonMutation.isPending}
            disabled={selectedMachineIds.length < 2}
            leftIcon={<Layers className="w-4 h-4" />}
          >
            Create Side-by-Side Matrix
          </Button>
        </div>
      </div>
    </Modal>
  );
}
