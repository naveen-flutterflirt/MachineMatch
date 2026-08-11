import { ICategory, IMachine } from '../catalog/catalog.types';

export interface IComparisonRowValue {
  machineId: string;
  modelName: string;
  rawValue: string;
  rawUnit?: string;
  normalizedValue?: number | null;
  normalizedUnit?: string;
}

export interface IComparisonRow {
  attributeId: string;
  attributeName: string;
  code: string;
  standardUnit?: string;
  higherIsBetter: boolean;
  bestMachineId?: string | null;
  values: IComparisonRowValue[];
}

export interface IComparisonData {
  comparisonId: string;
  title: string;
  category?: ICategory;
  machines: IMachine[];
  rows: IComparisonRow[];
}
