'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { ComparisonTable, QuoteModal, ComparisonSelectorModal, useGetSideBySideTable } from '@/features/comparison';
import { Button, Card, Badge } from '@/common/components';
import { Layers, Sparkles, Send, PlusCircle, Lock, LogIn, UserPlus } from 'lucide-react';

function UserCompareContent() {
  const searchParams = useSearchParams();
  const queryId = searchParams.get('id') || searchParams.get('comparisonId') || '';

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [comparisonId, setComparisonId] = useState<string>(queryId);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isSelectorModalOpen, setIsSelectorModalOpen] = useState(false);

  useEffect(() => {
    if (queryId) {
      setComparisonId(queryId);
    }
  }, [queryId]);

  const { data: comparisonData, isLoading, error } = useGetSideBySideTable(comparisonId);

  // If NOT LOGGED IN -> Show Authentication Lock Card
  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <Card hoverEffect={false} className="p-12 max-w-xl mx-auto border-slate-200/80 bg-white shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <Badge variant="primary" className="mb-3">Authentication Required</Badge>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-3">Login to Access Machinery Comparison</h1>
          <p className="text-slate-600 text-sm mb-8 leading-relaxed">
            Side-by-Side Spec Alignment Matrix and Match Scoring are available exclusively for registered users. Please login or register to continue.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/login" className="w-full sm:w-auto">
              <Button variant="primary" size="md" leftIcon={<LogIn className="w-4 h-4" />}>
                Login to Account
              </Button>
            </Link>
            <Link href="/register" className="w-full sm:w-auto">
              <Button variant="outline" size="md" leftIcon={<UserPlus className="w-4 h-4" />}>
                Create Free Account
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Layers className="w-8 h-8 text-emerald-600" /> Side-by-Side Machinery Comparison
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Compare 2-4 machines aligned on shared attribute templates with row-wise best value highlighting & MCDA Match Scores.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSelectorModalOpen(true)}
            leftIcon={<PlusCircle className="w-4 h-4 text-emerald-600" />}
          >
            + New Comparison
          </Button>

          {comparisonData && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsQuoteModalOpen(true)}
              rightIcon={<Send className="w-4 h-4" />}
            >
              Request Official Quote
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-slate-500 font-medium">Loading specification comparison matrix...</div>
      ) : !comparisonData || error ? (
        <Card hoverEffect={false} className="p-12 text-center max-w-xl mx-auto border-slate-200/80 bg-white shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Select Machines to Compare</h2>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            Choose 2 to 4 excavators or loaders from the catalog or uploaded PDF brochures to build a comparative spec matrix.
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsSelectorModalOpen(true)}
            leftIcon={<Layers className="w-4 h-4" />}
          >
            Select Models to Compare
          </Button>
        </Card>
      ) : (
        <ComparisonTable comparisonData={comparisonData} />
      )}

      {/* Interactive Machine Selection Modal */}
      <ComparisonSelectorModal
        isOpen={isSelectorModalOpen}
        onClose={() => setIsSelectorModalOpen(false)}
        onComparisonCreated={(newId) => setComparisonId(newId)}
      />

      {/* B2B Quotation Lead Submission Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />
    </div>
  );
}

export default function UserComparePage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-500 font-medium">Loading comparison session...</div>}>
      <UserCompareContent />
    </Suspense>
  );
}
