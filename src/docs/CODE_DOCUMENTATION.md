
# Information Security Policy Repository - Code Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Technology Stack](#architecture--technology-stack)
3. [File Structure & Component Explanations](#file-structure--component-explanations)
4. [Policy Template Sources](#policy-template-sources)
5. [Database Schema](#database-schema)
6. [Authentication & Security](#authentication--security)
7. [Key Features Implementation](#key-features-implementation)
8. [Data Flow](#data-flow)

## Project Overview

The Information Security Policy Repository is a comprehensive web application designed to manage organizational security policies. It provides capabilities for creating, editing, searching, categorizing, and versioning security policies with a focus on compliance with industry standards like NIST, ISO 27001, and SOC 2.

### Core Functionality
- **Policy Management**: Create, read, update, delete security policies
- **Version Control**: Track policy changes with detailed version history
- **Search & Filtering**: Advanced search with full-text capabilities and multi-criteria filtering
- **Import/Export**: XML import and JSON/PDF export capabilities
- **Template System**: Pre-loaded industry-standard policy templates
- **Tag Management**: Comprehensive tagging system for policy organization
- **Security Framework Mapping**: Policies mapped to NIST, ISO 27001, and other frameworks

## Architecture & Technology Stack

### Frontend Technologies
- **React 18**: Component-based UI framework with hooks
- **TypeScript**: Type safety and enhanced developer experience
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Framer Motion**: Animation library for smooth transitions
- **Shadcn/UI**: Component library built on Radix UI primitives
- **React Query**: Data fetching, caching, and synchronization
- **Vite**: Fast build tool and development server

### Backend Services
- **Supabase**: Backend-as-a-Service providing:
  - PostgreSQL database with Row-Level Security (RLS)
  - Authentication system
  - Real-time subscriptions
  - Edge functions for serverless computing

## File Structure & Component Explanations

### Core Pages

#### `src/pages/Index.tsx` (869 lines)
**Purpose**: Main application page and central orchestrator
**Key Features**:
- Manages all application state (selected policies, modal states, filters)
- Coordinates between sidebar navigation and policy display
- Handles search and filtering operations
- Manages user authentication flow
- Integrates all modals (Create, Edit, Import, Templates, etc.)

**Key Functions**:
- `transformPolicy()`: Converts database policy format to UI format
- `transformSearchResult()`: Converts search results to UI format
- `handleSearch()`: Coordinates search operations with filters
- `handleCategoryChange()`: Manages framework category filtering

**State Management**:
```typescript
const [selectedPolicy, setSelectedPolicy] = useState(null);
const [filteredPolicies, setFilteredPolicies] = useState([]);
const [activeCategory, setActiveCategory] = useState('all');
```

#### `src/pages/NotFound.tsx`
**Purpose**: 404 error page for invalid routes
**Features**: Simple error page with navigation back to main application

### Core Components

#### `src/components/Sidebar.tsx`
**Purpose**: Navigation sidebar with framework categories and statistics
**Features**:
- Security framework category navigation (Technical, Physical, Organizational)
- Policy statistics display
- Quick action buttons for new policy creation
- Active category highlighting

#### `src/components/PolicyList.tsx`
**Purpose**: Displays policies in grid or list view
**Features**:
- Toggle between grid and list view modes
- Animated policy cards with Framer Motion
- Empty state handling
- Policy interaction handlers (click, edit, download)

#### `src/components/PolicyCard.tsx`
**Purpose**: Individual policy display card
**Features**:
- Policy metadata display (title, status, tags, dates)
- Action buttons (edit, download)
- Status badges with color coding
- Responsive design for different view modes

#### `src/components/PolicyDetail.tsx`
**Purpose**: Detailed policy view in sidebar
**Features**:
- Full policy content display
- Metadata visualization
- Action buttons (edit, download, version history)
- Tag display and management

### Modal Components

#### `src/components/CreatePolicyModal.tsx`
**Purpose**: Form for creating new policies
**Features**:
- Multi-step form with validation
- Rich text editor for policy content
- Tag selection and management
- Category and type selection
- Real-time preview

#### `src/components/EditPolicyModal.tsx`
**Purpose**: Form for editing existing policies
**Features**:
- Pre-populated form with existing policy data
- Version tracking with change descriptions
- Tag management
- Content editing with rich text support

#### `src/components/PolicyTemplatesModal.tsx` (220 lines)
**Purpose**: Browse and import policy templates
**Features**:
- Categorized template browser with tabs
- Template preview with full content
- Import functionality
- Source attribution for templates

#### `src/components/XmlImportModal.tsx`
**Purpose**: Import policies from XML files
**Features**:
- File upload with drag-and-drop
- XML parsing and validation
- Preview before import
- Error handling for malformed files

#### `src/components/TagManagement.tsx`
**Purpose**: Manage policy tags across the system
**Features**:
- Bulk tag operations
- Tag renaming and deletion
- Policy association management
- Tag usage statistics

#### `src/components/VersionHistoryModal.tsx`
**Purpose**: Display policy version history
**Features**:
- Chronological version listing
- Change descriptions and editor attribution
- Version comparison capabilities
- Restore previous versions

### Search & Filter Components

#### `src/components/EnhancedSearchFilters.tsx`
**Purpose**: Advanced search interface
**Features**:
- Full-text search across policies
- Multi-criteria filtering (tags, status, type, category)
- Real-time search results
- Filter persistence

#### `src/components/SearchBar.tsx`
**Purpose**: Basic search input component
**Features**:
- Debounced search input
- Search suggestions
- Clear functionality

### Authentication Components

#### `src/components/AuthModal.tsx`
**Purpose**: User authentication interface
**Features**:
- Email/password login
- User registration
- Password reset functionality
- Integration with Supabase Auth

### Utility Components

#### `src/components/ui/*`
**Purpose**: Reusable UI components from Shadcn/UI
**Components Include**:
- Button, Card, Dialog, Badge, Tabs
- Form controls (Input, Select, Checkbox)
- Layout components (ScrollArea, Separator)
- Feedback components (Toast, Alert)

## Policy Template Sources

### Real-World Policy Templates
The application includes three comprehensive policy templates based on industry best practices:

#### 1. Access Control Policy
**Source**: NIST Cybersecurity Framework (NIST CSF) and NIST SP 800-53
**Standards Referenced**:
- NIST Cybersecurity Framework Core Functions
- ISO/IEC 27001:2013 - A.9 Access Control
- COBIT 5 - APO13 (Manage Security)
- SOX Compliance Requirements

**Content Sections**:
- Principle of Least Privilege implementation
- Role-Based Access Control (RBAC)
- Multi-Factor Authentication requirements
- Account lifecycle management
- Remote access security controls
- Monitoring and auditing procedures

#### 2. Data Classification Policy
**Source**: NIST SP 800-60 "Guide for Mapping Types of Information and Information Systems to Security Categories"
**Standards Referenced**:
- NIST Federal Information Processing Standards (FIPS) 199
- ISO/IEC 27001:2013 - A.8 Asset Management
- GDPR Article 32 - Security of Processing
- HIPAA Security Rule (if applicable)

**Classification Levels**:
- Public Data (Marketing materials, public websites)
- Internal Data (Policies, procedures, org charts)
- Confidential Data (Financial data, strategic plans)
- Restricted Data (PII, trade secrets, payment data)

#### 3. Acceptable Use Policy
**Source**: SANS Institute Policy Templates and NIST SP 800-114
**Standards Referenced**:
- NIST SP 800-114 "User's Guide to Telework and Bring Your Own Device Security"
- ISO/IEC 27001:2013 - A.7 Human Resource Security
- COBIT 5 - APO07 (Manage Human Resources)

**Policy Areas Covered**:
- IT resource usage guidelines
- Email and communication standards
- Internet usage policies
- Software licensing compliance
- Mobile device security
- Social media guidelines

### Template Implementation Details

```typescript
// Located in src/hooks/usePolicyRepository.ts
const REAL_WORLD_TEMPLATES = [
  {
    title: "Access Control Policy",
    description: "Comprehensive access control policy based on NIST cybersecurity framework standards",
    type: "Access Control",
    category: "Technical Control",
    content: `# Access Control Policy... [Full NIST-compliant content]`,
    tags: ["access-control", "authentication", "authorization", "NIST", "security", "compliance"],
    author: "Policy Repository Templates"
  },
  // Additional templates...
];
```

## Database Schema

### Core Tables

#### `policies` Table
```sql
CREATE TABLE public.policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  tags TEXT[],
  type TEXT NOT NULL,
  version NUMERIC DEFAULT 1.0,
  status policy_status DEFAULT 'draft',
  category policy_category NOT NULL,
  file_url TEXT,
  created_by UUID REFERENCES auth.users,
  updated_by UUID REFERENCES auth.users,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  author TEXT NOT NULL
);
```

#### `policy_texts` Table
```sql
CREATE TABLE public.policy_texts (
  text_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id UUID REFERENCES public.policies ON DELETE CASCADE,
  content TEXT NOT NULL
);
```

#### `versions` Table
```sql
CREATE TABLE public.versions (
  version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id UUID REFERENCES public.policies ON DELETE CASCADE,
  version_label TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  edited_by TEXT NOT NULL
);
```

#### `tags` and `policy_tags` Tables
```sql
CREATE TABLE public.tags (
  tag_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_name TEXT UNIQUE NOT NULL
);

CREATE TABLE public.policy_tags (
  policy_id UUID REFERENCES public.policies ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags ON DELETE CASCADE,
  PRIMARY KEY (policy_id, tag_id)
);
```

### Database Functions

#### `search_policies_enhanced()`
**Purpose**: Advanced search with full-text capabilities
**Features**:
- Full-text search across title, description, and content
- Multi-criteria filtering (tags, type, status)
- Relevance ranking with ts_rank
- Tag aggregation for results

#### `log_search()`
**Purpose**: Track search analytics
**Features**:
- Search query logging
- Filter usage tracking
- Results count recording
- User attribution

## Authentication & Security

### Row-Level Security (RLS)
All tables implement RLS policies ensuring users can only access their own data:

```sql
-- Example RLS policy
CREATE POLICY "Users can view their own policies" 
  ON public.policies 
  FOR SELECT 
  USING (auth.uid() = created_by);
```

### Authentication Flow
1. User authentication via Supabase Auth
2. JWT token validation on each request
3. User ID extraction from token
4. RLS policy enforcement at database level

## Key Features Implementation

### 1. Version Control System
**Implementation**: `src/hooks/usePolicies.ts`
- Automatic version incrementing on updates
- Change description tracking
- Historical version storage
- Version comparison capabilities

### 2. Search System
**Implementation**: `src/hooks/usePolicyRepository.ts`
- PostgreSQL full-text search with tsvector
- Relevance ranking with ts_rank
- Multi-criteria filtering
- Real-time search results

### 3. Tag Management
**Implementation**: Distributed across multiple components
- Many-to-many relationship between policies and tags
- Automatic tag creation
- Tag usage analytics
- Bulk tag operations

### 4. Import/Export System
**XML Import**: Parses XML structure and maps to policy fields
**JSON Export**: Structured data export for policy backup
**PDF Export**: HTML-based PDF generation for document sharing

### 5. Template System
**Implementation**: Pre-loaded templates with real-world content
- Industry-standard policy content
- Framework compliance mapping
- Customizable import process

## Data Flow

### Policy Creation Flow
1. User fills CreatePolicyModal form
2. Form data sent to `createPolicy()` in usePolicies hook
3. Database insertion with RLS policy check
4. Automatic version 1.0 creation
5. Tag associations created
6. UI refreshed with new policy

### Search Flow
1. User enters search query in EnhancedSearchFilters
2. Search triggers `searchPolicies()` function
3. Database function `search_policies_enhanced()` executes
4. Results ranked by relevance and filtered
5. Search logged for analytics
6. UI updated with filtered results

### Version Management Flow
1. User edits policy via EditPolicyModal
2. `updatePolicy()` function called with changes
3. Version number incremented (e.g., 1.0 → 1.1)
4. New version record created in versions table
5. Change description stored
6. Policy updated with new content and version

This documentation provides a comprehensive understanding of the codebase architecture, implementation details, and the sources of the professional policy templates included in the system.
