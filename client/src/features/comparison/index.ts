import { FitScoreCard } from './components/FitScoreCard';
import { ComparisonTable } from './components/ComparisonTable';
import { QuoteModal } from './components/QuoteModal';
import { ComparisonSelectorModal } from './components/ComparisonSelectorModal';
import { useGetSideBySideTable, useCreateComparison, useGetMyComparisons } from './hooks/useComparisonApi';

export default ComparisonTable;
export {
  ComparisonTable,
  FitScoreCard,
  QuoteModal,
  ComparisonSelectorModal,
  useGetSideBySideTable,
  useCreateComparison,
  useGetMyComparisons,
};
