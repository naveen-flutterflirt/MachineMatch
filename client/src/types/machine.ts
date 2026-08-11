export interface IVendor {
  id: string;
  name: string;
  companyRegistrationNo?: string;
  taxId?: string;
  country?: string;
  contactEmail?: string;
  isVerified?: boolean;
}

export interface ICategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
  parentId?: string | null;
  subcategories?: ICategory[];
}

export interface IAttributeMaster {
  id: string;
  name: string;
  code: string;
  dataType: 'number' | 'string' | 'boolean' | 'enum';
  standardUnit?: string;
  higherIsBetter: boolean;
  defaultWeight: number;
}

export interface ISpecification {
  id: string;
  machineId: string;
  attributeId: string;
  rawValue: string;
  rawUnit?: string;
  normalizedValue?: number;
  normalizedUnit?: string;
  source: string;
  attribute?: IAttributeMaster;
}

export interface IPrice {
  id: string;
  machineId: string;
  priceType: string;
  amount: number;
  currency: string;
  region?: string;
}

export interface IMachineMedia {
  id: string;
  machineId: string;
  type: 'image' | 'brochure_pdf' | 'video' | 'manual' | 'spec_sheet';
  url: string;
  thumbnailUrl?: string;
  title?: string;
  isPrimary: boolean;
}

export interface IMachine {
  id: string;
  categoryId: string;
  vendorId?: string | null;
  modelName: string;
  variant?: string;
  manufacturingYear?: number;
  status: 'draft' | 'pending_review' | 'approved' | 'published' | 'rejected';
  isFeatured: boolean;
  category?: ICategory;
  vendor?: IVendor;
  media?: IMachineMedia[];
  specifications?: ISpecification[];
  prices?: IPrice[];
}
