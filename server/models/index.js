import sequelize from '../config/db.js';

// --- Auth & User ---
import User from './User.js';

// --- Catalog & Vendor ---
import Vendor from './Vendor.js';
import Category from './Category.js';
import AttributeMaster from './AttributeMaster.js';
import CategoryAttributeTemplate from './CategoryAttributeTemplate.js';

// --- Machine & Media ---
import Machine from './Machine.js';
import MachineMedia from './MachineMedia.js';
import Specification from './Specification.js';
import Price from './Price.js';

// --- Uploads & Embeddings ---
import Upload from './Upload.js';
import MachineEmbedding from './MachineEmbedding.js';

// --- Comparison Module ---
import Comparison from './Comparison.js';
import ComparisonItem from './ComparisonItem.js';

// --- Quote Requests ---
import QuoteRequest from './QuoteRequest.js';
import QuoteRequestItem from './QuoteRequestItem.js';

// --- Search Analytics ---
import SearchLog from './SearchLog.js';

// ==========================================
// 1. CATEGORY & ATTRIBUTE TEMPLATE ASSOCIATIONS
// ==========================================
Category.hasMany(Category, { foreignKey: 'parentId', as: 'subcategories' });
Category.belongsTo(Category, { foreignKey: 'parentId', as: 'parentCategory' });

Category.belongsToMany(AttributeMaster, {
  through: CategoryAttributeTemplate,
  foreignKey: 'categoryId',
  as: 'attributeTemplates',
});
AttributeMaster.belongsToMany(Category, {
  through: CategoryAttributeTemplate,
  foreignKey: 'attributeId',
  as: 'categories',
});

CategoryAttributeTemplate.belongsTo(AttributeMaster, {
  foreignKey: 'attributeId',
  as: 'attribute',
});
CategoryAttributeTemplate.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category',
});
Category.hasMany(CategoryAttributeTemplate, {
  foreignKey: 'categoryId',
  as: 'templates',
});

// ==========================================
// 2. MACHINE & DOMAIN ASSOCIATIONS
// ==========================================
Vendor.hasMany(Machine, { foreignKey: 'vendorId', as: 'machines' });
Machine.belongsTo(Vendor, { foreignKey: 'vendorId', as: 'vendor' });

Category.hasMany(Machine, { foreignKey: 'categoryId', as: 'categoryMachines' });
Machine.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

Machine.hasMany(MachineMedia, { foreignKey: 'machineId', as: 'media' });
MachineMedia.belongsTo(Machine, { foreignKey: 'machineId', as: 'machine' });

Machine.hasMany(Specification, { foreignKey: 'machineId', as: 'specifications' });
Specification.belongsTo(Machine, { foreignKey: 'machineId', as: 'machine' });

AttributeMaster.hasMany(Specification, { foreignKey: 'attributeId', as: 'specifications' });
Specification.belongsTo(AttributeMaster, { foreignKey: 'attributeId', as: 'attribute' });

Machine.hasMany(Price, { foreignKey: 'machineId', as: 'prices' });
Price.belongsTo(Machine, { foreignKey: 'machineId', as: 'machine' });

Machine.hasOne(MachineEmbedding, { foreignKey: 'machineId', as: 'embedding' });
MachineEmbedding.belongsTo(Machine, { foreignKey: 'machineId', as: 'machine' });

// ==========================================
// 3. COMPARISON ENGINE ASSOCIATIONS
// ==========================================
User.hasMany(Comparison, { foreignKey: 'userId', as: 'comparisons' });
Comparison.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Category.hasMany(Comparison, { foreignKey: 'categoryId', as: 'comparisons' });
Comparison.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

Comparison.hasMany(ComparisonItem, { foreignKey: 'comparisonId', as: 'items' });
ComparisonItem.belongsTo(Comparison, { foreignKey: 'comparisonId', as: 'comparison' });

Machine.hasMany(ComparisonItem, { foreignKey: 'machineId', as: 'comparisonAppearances' });
ComparisonItem.belongsTo(Machine, { foreignKey: 'machineId', as: 'machine' });

// ==========================================
// 4. QUOTE REQUEST ASSOCIATIONS
// ==========================================
User.hasMany(QuoteRequest, { foreignKey: 'buyerUserId', as: 'quoteRequests' });
QuoteRequest.belongsTo(User, { foreignKey: 'buyerUserId', as: 'buyer' });

Vendor.hasMany(QuoteRequest, { foreignKey: 'vendorId', as: 'quoteRequests' });
QuoteRequest.belongsTo(Vendor, { foreignKey: 'vendorId', as: 'vendor' });

QuoteRequest.hasMany(QuoteRequestItem, { foreignKey: 'quoteRequestId', as: 'items' });
QuoteRequestItem.belongsTo(QuoteRequest, { foreignKey: 'quoteRequestId', as: 'quoteRequest' });

Machine.hasMany(QuoteRequestItem, { foreignKey: 'machineId', as: 'quotedIn' });
QuoteRequestItem.belongsTo(Machine, { foreignKey: 'machineId', as: 'machine' });

// ==========================================
// 5. UPLOADS & LOGS
// ==========================================
User.hasMany(Upload, { foreignKey: 'uploadedByUserId', as: 'uploads' });
Upload.belongsTo(User, { foreignKey: 'uploadedByUserId', as: 'uploader' });

User.hasMany(SearchLog, { foreignKey: 'userId', as: 'searches' });
SearchLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export {
  sequelize,
  User,
  Vendor,
  Category,
  AttributeMaster,
  CategoryAttributeTemplate,
  Machine,
  MachineMedia,
  Specification,
  Price,
  Upload,
  MachineEmbedding,
  Comparison,
  ComparisonItem,
  QuoteRequest,
  QuoteRequestItem,
  SearchLog,
};
