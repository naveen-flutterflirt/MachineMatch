# MachineMatch - Core Database Schema Specification

**Document Title**: MachineMatch Enterprise Database & System Architecture Blueprint  
**Version**: 2.1 (Client Sign-Off Draft)  
**Project**: MachineMatch - AI-Powered Machinery Comparison Platform  
**Target Stack**: Node.js / Express, PostgreSQL, Sequelize ORM, Redis, Pluggable AI APIs (Gemini / OpenAI / Bedrock), Next.js 14  
**Scope**: Single-Tenant Core Production Database Schema  

---

## 1. Executive Summary & Design Principles

This document specifies the complete relational database schema for **MachineMatch** (excluding system notifications and RBAC role tables as requested).

### Key Highlights

1. **Normalized Media Management (`machine_media`)**: Decoupled binary assets from the core `machines` table. Each machine supports up to 20+ images, 5+ PDF brochures/spec sheets, and 10+ video links.
2. **Normalized Comparison Session (`comparisons` & `comparison_items`)**: Header-detail relational tables for side-by-side comparisons.
3. **Flexible Multi-Tier Pricing (`prices`)**: Multi-tier pricing (`ex_factory`, `dealer_price`, `retail_mrp`, `discount_price`, `offer_price`, `rental_day_rate`, `rental_month_rate`).
4. **Universal Audit Logging (`withAudit`)**: Standard `created_by`, `updated_by`, `deleted_by` fields across all tables.
5. **Universal Soft Delete (`paranoid: true`)**: Tables contain `deleted_at` timestamps.
6. **Pluggable AI Vector Engine (`machine_embeddings`)**: Native PostgreSQL `pgvector` embedding storage (`VECTOR(768)` / `VECTOR(1536)`).
7. **B2B Lead & Quote Management (`quote_requests` & `quote_request_items`)**: Quotation request pipeline.
8. **Search Analytics (`search_logs`)**: Search engine latency and query analytics.

---

## 2. Complete Data Dictionary

### Module A: User Accounts

#### Table 1: `users`
*Stores user accounts for Admins, Vendors, Dealers, Buyers, and Consultants.*

| Field | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, Default UUIDV4 | Unique user identifier |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Login email address |
| `password` | VARCHAR(255) | NOT NULL | Bcrypt password hash |
| `first_name` | VARCHAR(100) | NOT NULL | First name |
| `last_name` | VARCHAR(100) | NOT NULL | Last name |
| `phone` | VARCHAR(20) | NULL | Contact phone number |
| `status` | ENUM | Default 'pending_verification' | Values: `pending_verification`, `active`, `suspended` |
| `email_verified` | BOOLEAN | Default FALSE | Email verification state |
| `last_login_at` | TIMESTAMP | NULL | Last login timestamp |
| `created_at` | TIMESTAMP | NOT NULL | Record creation timestamp |
| `updated_at` | TIMESTAMP | NOT NULL | Record update timestamp |
| `deleted_at` | TIMESTAMP | NULL (Paranoid) | Soft delete timestamp |
| `created_by` | UUID | FK -> `users.id`, NULL | User who created this record |
| `updated_by` | UUID | FK -> `users.id`, NULL | User who updated this record |
| `deleted_by` | UUID | FK -> `users.id`, NULL | User who deleted this record |

---

### Module B: Vendor & Catalog Taxonomy

#### Table 2: `vendors`
*Stores OEM manufacturers, distributors, and dealers.*

| Field | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, Default UUIDV4 | Vendor ID |
| `name` | VARCHAR(255) | NOT NULL | Company name (e.g. Caterpillar, JCB, Komatsu) |
| `company_registration_no` | VARCHAR(100) | NULL | Registration number |
| `tax_id` | VARCHAR(100) | NULL | Tax / GST ID |
| `address` | TEXT | NULL | Physical address |
| `city` | VARCHAR(100) | NULL | City |
| `state` | VARCHAR(100) | NULL | State |
| `zip_code` | VARCHAR(20) | NULL | Zip/Postal code |
| `country` | VARCHAR(100) | Default 'India' | Country |
| `website` | VARCHAR(255) | NULL | Official website |
| `contact_person_name` | VARCHAR(150) | NULL | Contact person |
| `contact_phone` | VARCHAR(30) | NULL | Contact phone |
| `contact_email` | VARCHAR(255) | NULL | Contact email |
| `logo_url` | VARCHAR(500) | NULL | Logo image URL |
| `is_verified` | BOOLEAN | Default FALSE | Verified status flag |
| `rating` | DECIMAL(3,2) | Default 0.00 | Average vendor rating |
| `created_at` / `updated_at` / `deleted_at` | TIMESTAMP | Standard Audit | Timestamps |
| `created_by` / `updated_by` / `deleted_by` | UUID | Standard Audit | Foreign keys to `users.id` |

#### Table 3: `categories`
*Hierarchical classification (Excavators, Wheel Loaders, Cranes, etc.).*

| Field | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, Default UUIDV4 | Category ID |
| `name` | VARCHAR(150) | NOT NULL | Category name |
| `slug` | VARCHAR(150) | UNIQUE, NOT NULL | URL friendly slug |
| `parent_id` | UUID | FK -> `categories.id`, NULL | Self-referential parent category ID |
| `description` | TEXT | NULL | Category description |
| `icon_url` | VARCHAR(500) | NULL | Icon image URL |
| `is_active` | BOOLEAN | Default TRUE | Active category flag |
| `created_at` / `updated_at` / `deleted_at` | TIMESTAMP | Standard Audit | Timestamps |
| `created_by` / `updated_by` / `deleted_by` | UUID | Standard Audit | Foreign keys to `users.id` |

#### Table 4: `attribute_masters`
*Master registry of technical specification attributes.*

| Field | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, Default UUIDV4 | Attribute ID |
| `name` | VARCHAR(150) | NOT NULL | Attribute name (e.g. Operating Weight, Engine Power) |
| `code` | VARCHAR(100) | UNIQUE, NOT NULL | Code (`operating_weight`, `engine_power`) |
| `data_type` | ENUM | Default 'number' | Values: `number`, `string`, `boolean`, `enum` |
| `standard_unit` | VARCHAR(50) | NULL | Standardized platform unit (`kg`, `kW`, `m3`, `bar`) |
| `higher_is_better` | BOOLEAN | Default TRUE | Scoring logic direction flag |
| `default_weight` | FLOAT | Default 1.0 | Fit score multiplier weight |
| `description` | TEXT | NULL | Attribute description |
| `created_at` / `updated_at` / `deleted_at` | TIMESTAMP | Standard Audit | Timestamps |
| `created_by` / `updated_by` / `deleted_by` | UUID | Standard Audit | Foreign keys to `users.id` |

#### Table 5: `category_attribute_templates`
*Mapping template defining attributes applicable per category.*

| Field | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, Default UUIDV4 | Template record ID |
| `category_id` | UUID | FK -> `categories.id`, NOT NULL | Category reference |
| `attribute_id` | UUID | FK -> `attribute_masters.id`, NOT NULL | Master attribute reference |
| `is_required` | BOOLEAN | Default FALSE | Is attribute compulsory flag |
| `display_order` | INTEGER | Default 0 | UI display order |
| `unit_options` | JSONB | Default [] | Supported raw input units (e.g. `["HP", "kW", "PS"]`) |
| `created_at` / `updated_at` / `deleted_at` | TIMESTAMP | Standard Audit | Timestamps |
| `created_by` / `updated_by` / `deleted_by` | UUID | Standard Audit | Foreign keys to `users.id` |

---

### Module C: Machinery Catalog & Media Isolation

#### Table 6: `machines`
*Main machinery catalog table containing metadata and approval status.*

| Field | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, Default UUIDV4 | Machine ID |
| `category_id` | UUID | FK -> `categories.id`, NOT NULL | Category reference |
| `vendor_id` | UUID | FK -> `vendors.id`, NOT NULL | Vendor reference |
| `model_name` | VARCHAR(150) | NOT NULL | Model identifier (e.g., 320D3, JS220) |
| `variant` | VARCHAR(100) | NULL | Variant designation |
| `manufacturing_year` | INTEGER | NULL | Manufacturing year |
| `status` | ENUM | Default 'draft' | Values: `draft`, `pending_review`, `under_review`, `approved`, `published`, `rejected`, `archived` |
| `is_featured` | BOOLEAN | Default FALSE | Featured listing badge |
| `rejection_reason` | TEXT | NULL | Admin feedback on rejection |
| `created_at` / `updated_at` / `deleted_at` | TIMESTAMP | Standard Audit | Timestamps |
| `created_by` / `updated_by` / `deleted_by` | UUID | Standard Audit | Foreign keys to `users.id` |

#### Table 7: `machine_media`
*Dedicated storage for unlimited photos, PDF brochures, spec sheets, and video links.*

| Field | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, Default UUIDV4 | Media asset ID |
| `machine_id` | UUID | FK -> `machines.id`, NOT NULL | Machine reference |
| `type` | ENUM | NOT NULL | Values: `image`, `brochure_pdf`, `video`, `manual`, `spec_sheet` |
| `url` | VARCHAR(1000) | NOT NULL | Asset URL |
| `thumbnail_url` | VARCHAR(1000) | NULL | Thumbnail image URL |
| `title` | VARCHAR(255) | NULL | Caption/Title |
| `display_order` | INTEGER | Default 0 | Display sequence order |
| `is_primary` | BOOLEAN | Default FALSE | Primary cover image flag |
| `file_size` | INTEGER | NULL | Size in bytes |
| `mime_type` | VARCHAR(100) | NULL | Asset MIME type |
| `created_at` / `updated_at` / `deleted_at` | TIMESTAMP | Standard Audit | Timestamps |
| `created_by` / `updated_by` / `deleted_by` | UUID | Standard Audit | Foreign keys to `users.id` |

#### Table 8: `specifications`
*Stores extracted or entered technical attributes per machine.*

| Field | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, Default UUIDV4 | Specification ID |
| `machine_id` | UUID | FK -> `machines.id`, NOT NULL | Machine reference |
| `attribute_id` | UUID | FK -> `attribute_masters.id`, NOT NULL | Master attribute reference |
| `raw_value` | VARCHAR(255) | NOT NULL | Raw value as entered ("148 HP") |
| `raw_unit` | VARCHAR(50) | NULL | Raw unit ("HP") |
| `normalized_value` | FLOAT | NULL | Standardized numeric value (110.36) |
| `normalized_unit` | VARCHAR(50) | NULL | Standard unit ("kW") |
| `source` | ENUM | Default 'manual' | Values: `manual`, `ai_ocr`, `vendor_feed`, `admin_override` |
| `confidence_score` | FLOAT | Default 1.0 | AI OCR confidence index |
| `created_at` / `updated_at` / `deleted_at` | TIMESTAMP | Standard Audit | Timestamps |
| `created_by` / `updated_by` / `deleted_by` | UUID | Standard Audit | Foreign keys to `users.id` |

#### Table 9: `prices`
*Flexible multi-tiered pricing entity.*

| Field | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, Default UUIDV4 | Price record ID |
| `machine_id` | UUID | FK -> `machines.id`, NOT NULL | Machine reference |
| `price_type` | ENUM | Default 'ex_factory' | Values: `ex_factory`, `dealer_price`, `retail_mrp`, `discount_price`, `offer_price`, `rental_day_rate`, `rental_month_rate` |
| `amount` | DECIMAL(14,2) | NOT NULL | Price amount |
| `currency` | VARCHAR(10) | Default 'INR' | Currency code |
| `region` | VARCHAR(100) | NULL | Geographic applicability |
| `effective_from` | TIMESTAMP | NULL | Effective start date |
| `effective_to` | TIMESTAMP | NULL | Effective end date |
| `notes` | TEXT | NULL | Additional pricing notes |
| `created_at` / `updated_at` / `deleted_at` | TIMESTAMP | Standard Audit | Timestamps |
| `created_by` / `updated_by` / `deleted_by` | UUID | Standard Audit | Foreign keys to `users.id` |

---

### Module D: Uploads & AI Vector Engine

#### Table 10: `uploads`
*Tracks brochure PDF uploads and asynchronous AI OCR pipeline state.*

| Field | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, Default UUIDV4 | Upload file ID |
| `uploaded_by_user_id` | UUID | FK -> `users.id`, NULL | Uploader reference |
| `original_name` | VARCHAR(255) | NOT NULL | Original upload filename |
| `file_name` | VARCHAR(255) | NOT NULL | Saved filename |
| `file_url` | VARCHAR(1000) | NOT NULL | Asset URL |
| `mime_type` | VARCHAR(100) | NOT NULL | File MIME type |
| `file_size` | INTEGER | NOT NULL | File size in bytes |
| `status` | ENUM | Default 'pending' | Values: `pending`, `processing`, `processed`, `failed` |
| `ocr_extracted_data` | JSONB | Default {} | Extracted specifications JSON |
| `error_message` | TEXT | NULL | Processing error log |
| `created_at` / `updated_at` / `deleted_at` | TIMESTAMP | Standard Audit | Timestamps |
| `created_by` / `updated_by` / `deleted_by` | UUID | Standard Audit | Foreign keys to `users.id` |

#### Table 11: `machine_embeddings`
*High-performance PostgreSQL `pgvector` vector store for AI machine similarity.*

| Field | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, Default UUIDV4 | Embedding ID |
| `machine_id` | UUID | UNIQUE, FK -> `machines.id`, NOT NULL | Machine reference |
| `embedding` | VECTOR / JSONB | NOT NULL | Native float vector for cosine similarity search |
| `spec_summary_text` | TEXT | NULL | Textual summary used to construct vector |
| `last_generated_at` | TIMESTAMP | Default NOW | Embedding generation timestamp |
| `created_at` / `updated_at` / `deleted_at` | TIMESTAMP | Standard Audit | Timestamps |
| `created_by` / `updated_by` / `deleted_by` | UUID | Standard Audit | Foreign keys to `users.id` |

---

### Module E: Comparison & Quote Requests

#### Table 12: `comparisons`
*Header record for side-by-side machine comparison sessions.*

| Field | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, Default UUIDV4 | Comparison session ID |
| `user_id` | UUID | FK -> `users.id`, NULL | User reference (NULL for guest users) |
| `category_id` | UUID | FK -> `categories.id`, NOT NULL | Category reference |
| `title` | VARCHAR(255) | NULL | Session title |
| `notes` | TEXT | NULL | User notes |
| `requirements_profile` | JSONB | Default {} | Buyer requirement weights & thresholds JSON |
| `created_at` / `updated_at` / `deleted_at` | TIMESTAMP | Standard Audit | Timestamps |
| `created_by` / `updated_by` / `deleted_by` | UUID | Standard Audit | Foreign keys to `users.id` |

#### Table 13: `comparison_items`
*Detail record linking machines to a comparison session.*

| Field | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, Default UUIDV4 | Item ID |
| `comparison_id` | UUID | FK -> `comparisons.id`, NOT NULL | Comparison session reference |
| `machine_id` | UUID | FK -> `machines.id`, NOT NULL | Machine reference |
| `display_order` | INTEGER | Default 0 | UI column display sequence |
| `calculated_fit_score` | FLOAT | NULL | Computed 0-100% weighted fit score |
| `created_at` / `updated_at` / `deleted_at` | TIMESTAMP | Standard Audit | Timestamps |
| `created_by` / `updated_by` / `deleted_by` | UUID | Standard Audit | Foreign keys to `users.id` |

#### Table 14: `quote_requests`
*B2B Buyer quotation request header.*

| Field | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, Default UUIDV4 | Quote request ID |
| `buyer_user_id` | UUID | FK -> `users.id`, NULL | Buyer user reference |
| `vendor_id` | UUID | FK -> `vendors.id`, NOT NULL | Target vendor reference |
| `status` | ENUM | Default 'submitted' | Values: `submitted`, `viewed`, `responded`, `closed`, `declined` |
| `contact_name` | VARCHAR(150) | NOT NULL | Contact person name |
| `contact_phone` | VARCHAR(30) | NOT NULL | Contact phone number |
| `contact_email` | VARCHAR(255) | NOT NULL | Contact email address |
| `company_name` | VARCHAR(255) | NULL | Buyer company name |
| `message` | TEXT | NULL | Requirements message |
| `target_delivery_date` | TIMESTAMP | NULL | Desired delivery date |
| `preferred_financing` | BOOLEAN | Default FALSE | Financing interest flag |
| `created_at` / `updated_at` / `deleted_at` | TIMESTAMP | Standard Audit | Timestamps |
| `created_by` / `updated_by` / `deleted_by` | UUID | Standard Audit | Foreign keys to `users.id` |

#### Table 15: `quote_request_items`
*Quotation request detail items specifying machines and quantities.*

| Field | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, Default UUIDV4 | Quote item ID |
| `quote_request_id` | UUID | FK -> `quote_requests.id`, NOT NULL | Quote request header reference |
| `machine_id` | UUID | FK -> `machines.id`, NOT NULL | Machine reference |
| `quantity` | INTEGER | Default 1 | Requested unit quantity |
| `requested_price` | DECIMAL(14,2) | NULL | Target / Offered price per unit |
| `notes` | TEXT | NULL | Item notes |
| `created_at` / `updated_at` / `deleted_at` | TIMESTAMP | Standard Audit | Timestamps |
| `created_by` / `updated_by` / `deleted_by` | UUID | Standard Audit | Foreign keys to `users.id` |

#### Table 16: `search_logs`
*Query analytics logging for NLP AI search and filter usage.*

| Field | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, Default UUIDV4 | Search log ID |
| `user_id` | UUID | FK -> `users.id`, NULL | Searching user reference |
| `query_text` | TEXT | NOT NULL | Raw search text entered |
| `search_type` | ENUM | Default 'nlp_ai' | Values: `keyword`, `nlp_ai`, `filter`, `similar` |
| `parsed_filters` | JSONB | Default {} | AI-parsed SQL filter JSON |
| `result_count` | INTEGER | Default 0 | Total matching machines found |
| `execution_time_ms` | INTEGER | Default 0 | Query latency in milliseconds |
| `user_ip` | VARCHAR(45) | NULL | User IP address |
| `created_at` / `updated_at` / `deleted_at` | TIMESTAMP | Standard Audit | Timestamps |
| `created_by` / `updated_by` / `deleted_by` | UUID | Standard Audit | Foreign keys to `users.id` |

---

## 3. Client Sign-Off & Approval

By signing below, the Client / Project Stakeholder approves the database schema design, entity relationships, data types, and architectural scope outlined in this specification document as the authoritative blueprint for development.

| Role | Name | Signature | Date |
| :--- | :--- | :--- | :--- |
| **Client / Project Lead** | ________________________ | ________________________ | ____ / ____ / 2026 |
| **Lead Developer** | ________________________ | ________________________ | ____ / ____ / 2026 |
| **Senior Solution Architect** | Antigravity AI Team | *Approved v2.1* | 05 / 08 / 2026 |
