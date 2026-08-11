import { AdminSidebar } from './components/AdminSidebar';
import { AdminLayout } from './components/AdminLayout';
import { CategoryManager } from './components/CategoryManager';
import { AdminMetrics } from './components/AdminMetrics';
import { useGetSearchSummary, useGetPopularSearchTerms } from './hooks/useAdminApi';
import {
  useGetAllUsers,
  useGetAllVendors,
  useGetAllCategories,
  useGetAllAttributes,
  useGetAllAdminMachines,
  useGetAllUploads,
  useGetAllAdminComparisons,
} from './hooks/useAdminDataApi';

export default AdminLayout;
export {
  AdminSidebar,
  AdminLayout,
  CategoryManager,
  AdminMetrics,
  useGetSearchSummary,
  useGetPopularSearchTerms,
  useGetAllUsers,
  useGetAllVendors,
  useGetAllCategories,
  useGetAllAttributes,
  useGetAllAdminMachines,
  useGetAllUploads,
  useGetAllAdminComparisons,
};
