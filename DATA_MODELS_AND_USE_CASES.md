# Policy Management System - Data Models & Use Cases

## 1. Data Models

### 1.1 Core Entity-Relationship Model

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│    profiles     │         │     policies     │         │      tags       │
├─────────────────┤         ├──────────────────┤         ├─────────────────┤
│ id (PK)         │         │ id (PK)          │         │ tag_id (PK)     │
│ email           │◄───────┤│ created_by (FK)  │         │ tag_name        │
│ full_name       │         │ updated_by (FK)  │         └─────────────────┘
│ role            │         │ title            │                  ▲
│ created_at      │         │ description      │                  │
│ updated_at      │         │ content          │                  │
└─────────────────┘         │ type             │         ┌────────┴────────┐
                            │ category         │         │  policy_tags    │
                            │ status           │◄────────┤ (Junction)      │
                            │ version          │         ├─────────────────┤
                            │ author           │         │ policy_id (FK)  │
                            │ owner            │         │ tag_id (FK)     │
                            │ department       │         └─────────────────┘
                            │ security_domain  │
                            │ framework_cat.   │
                            │ created_at       │
                            │ updated_at       │
                            └──────────────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    ▼                ▼                ▼
        ┌──────────────────┐ ┌──────────────┐ ┌─────────────────┐
        │ policy_sections  │ │policy_versions│ │ policy_texts    │
        ├──────────────────┤ ├──────────────┤ ├─────────────────┤
        │ section_id (PK)  │ │ id (PK)      │ │ text_id (PK)    │
        │ policy_id (FK)   │ │ policy_id(FK)│ │ policy_id (FK)  │
        │ section_number   │ │ version      │ │ content         │
        │ section_title    │ │ title        │ └─────────────────┘
        │ section_content  │ │ description  │
        │ compliance_tags  │ │ content      │
        │ created_at       │ │ change_summ. │
        │ updated_at       │ │ created_at   │
        └──────────────────┘ │ created_by   │
                             └──────────────┘

┌───────────────────────┐         ┌──────────────────────┐
│compliance_frameworks  │         │   search_logs        │
├───────────────────────┤         ├──────────────────────┤
│ framework_id (PK)     │         │ log_id (PK)          │
│ framework_name        │         │ user_id (FK)         │
│ framework_category    │         │ search_query         │
│ control_id            │         │ search_filters       │
│ control_description   │         │ results_count        │
│ keywords[]            │         │ created_at           │
│ created_at            │         └──────────────────────┘
└───────────────────────┘
```

### 1.2 Detailed Table Schemas

#### **policies** (Main Policy Entity)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique policy identifier |
| title | TEXT | NOT NULL | Policy title |
| description | TEXT | NULLABLE | Policy summary |
| content | TEXT | NOT NULL | Full policy content |
| type | TEXT | NOT NULL, DEFAULT 'General' | Policy type category |
| category | ENUM | NOT NULL | Policy category |
| status | ENUM | NOT NULL, DEFAULT 'draft' | Current status (draft/under_review/active/archived) |
| version | NUMERIC | NOT NULL, DEFAULT 1.0 | Version number |
| author | TEXT | NOT NULL | Policy author name |
| owner | TEXT | NULLABLE | Policy owner (Week 3) |
| department | TEXT | NULLABLE | Owning department (Week 3) |
| security_domain | TEXT | NULLABLE | Security classification (Week 3) |
| framework_category | TEXT | NULLABLE | Compliance category (Week 3) |
| tags | TEXT[] | NULLABLE | Quick access tags |
| file_url | TEXT | NULLABLE | Attached file location |
| created_by | UUID | FOREIGN KEY → profiles(id) | Creator user ID |
| updated_by | UUID | FOREIGN KEY → profiles(id) | Last updater user ID |
| created_at | TIMESTAMPTZ | DEFAULT now() | Creation timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT now() | Last update timestamp |

**Enums:**
- `policy_category`: access_control, incident_handling, data_classification, compliance, etc.
- `policy_status`: draft, under_review, active, archived

#### **policy_sections** (Policy Sections - Week 3)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| section_id | UUID | PRIMARY KEY | Unique section identifier |
| policy_id | UUID | FOREIGN KEY → policies(id) | Parent policy |
| section_number | INTEGER | NOT NULL | Sequential section number |
| section_title | TEXT | NOT NULL | Section heading |
| section_content | TEXT | NOT NULL | Section body text |
| compliance_tags | JSONB | NULLABLE, DEFAULT '[]' | Auto-tagged frameworks |
| created_at | TIMESTAMPTZ | DEFAULT now() | Creation timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT now() | Last update timestamp |

#### **compliance_frameworks** (Compliance Reference - Week 3)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| framework_id | UUID | PRIMARY KEY | Unique framework control ID |
| framework_name | TEXT | NOT NULL | Framework name (ISO 27001, NIST, GDPR) |
| framework_category | TEXT | NOT NULL | Category (physical/technical/organizational) |
| control_id | TEXT | NOT NULL | Control reference (e.g., "A.9.1.1") |
| control_description | TEXT | NULLABLE | Control description |
| keywords | TEXT[] | NULLABLE | Keywords for auto-tagging |
| created_at | TIMESTAMPTZ | DEFAULT now() | Creation timestamp |

**UNIQUE Constraint:** (framework_name, control_id)

#### **policy_versions** (Version History)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Version record ID |
| policy_id | UUID | FOREIGN KEY → policies(id) | Parent policy |
| version | NUMERIC | NOT NULL | Version number snapshot |
| title | TEXT | NOT NULL | Title at this version |
| description | TEXT | NULLABLE | Description at this version |
| content | TEXT | NOT NULL | Content at this version |
| tags | TEXT[] | NULLABLE | Tags at this version |
| category | ENUM | NOT NULL | Category at this version |
| status | ENUM | NOT NULL | Status at this version |
| file_url | TEXT | NULLABLE | File URL at this version |
| change_summary | TEXT | NULLABLE | Summary of changes |
| created_by | UUID | NULLABLE | User who created version |
| created_at | TIMESTAMPTZ | DEFAULT now() | Version timestamp |

#### **profiles** (User Profiles)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, FOREIGN KEY → auth.users(id) | User identifier |
| email | TEXT | NULLABLE | User email |
| full_name | TEXT | NULLABLE | User display name |
| role | TEXT | DEFAULT 'user' | User role |
| created_at | TIMESTAMPTZ | DEFAULT now() | Creation timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT now() | Last update timestamp |

#### **tags** (Tag Master List)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| tag_id | UUID | PRIMARY KEY | Unique tag identifier |
| tag_name | TEXT | NOT NULL, UNIQUE | Tag display name |

#### **policy_tags** (Policy-Tag Junction)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| policy_id | UUID | FOREIGN KEY → policies(id) | Policy reference |
| tag_id | UUID | FOREIGN KEY → tags(tag_id) | Tag reference |

**Composite Primary Key:** (policy_id, tag_id)

---

## 2. Use Cases

### 2.1 Primary Use Cases

#### **UC-01: Create New Policy**
**Actors:** Security Team Member, Policy Manager  
**Preconditions:** User is authenticated  
**Main Flow:**
1. User clicks "Create Policy" button
2. System displays policy creation form
3. User enters:
   - Title (required)
   - Description (optional)
   - Content with markdown headings (required)
   - Type selection (required)
   - Owner name (optional)
   - Department (optional)
   - Tags (optional)
4. User clicks "Create"
5. System validates inputs
6. System creates policy record with status='draft', version=1.0
7. System automatically splits content into sections (Week 3)
8. System auto-tags sections with compliance frameworks (Week 3)
9. System displays success message
10. System broadcasts real-time update (Week 3)

**Postconditions:** 
- Policy created with unique ID
- Policy sections created with compliance tags
- Policy visible to authenticated users

**Alternative Flows:**
- 5a. Validation fails → Display error messages
- 7a. No headings detected → No sections created

---

#### **UC-02: Search and Filter Policies**
**Actors:** All Users (Authenticated & Public)  
**Preconditions:** Policies exist in system  
**Main Flow:**
1. User enters search term in search bar
2. User optionally selects filters:
   - Policy type
   - Status
   - Tags
   - Category
3. User clicks "Search" or presses Enter
4. System queries database with full-text search
5. System ranks results by relevance
6. System displays matching policies with highlights
7. System logs search for analytics

**Postconditions:** 
- Relevant policies displayed
- Search logged for analytics

**Alternative Flows:**
- 6a. No results found → Display "No policies found" message

---

#### **UC-03: Edit Policy with Automatic Section Regeneration**
**Actors:** Policy Creator, Admin  
**Preconditions:** 
- User is authenticated
- User is policy creator or admin
- Policy exists  

**Main Flow:**
1. User opens policy detail view
2. User clicks "Edit" button
3. System displays edit form with current values
4. System pre-populates all fields including owner, department, security_domain, framework_category (Week 3)
5. User modifies content, title, or metadata
6. User clicks "Update"
7. System validates inputs
8. System increments version number
9. System creates version snapshot in `policy_versions`
10. System updates policy record
11. **System detects content change (Week 3):**
    - Deletes all existing sections for policy
    - Splits updated content into new sections
    - Auto-tags new sections with compliance frameworks
    - Inserts new sections to database
12. System broadcasts real-time update (Week 3)
13. System displays success message
14. All open tabs reflect changes immediately (Week 3)

**Postconditions:** 
- Policy updated with new version
- Version history preserved
- Sections regenerated and re-tagged
- Changes visible across all sessions

**Alternative Flows:**
- 7a. Validation fails → Display error messages
- 7b. No permission → Display "Access Denied"

---

#### **UC-04: View Policy with Sections and Compliance Tags**
**Actors:** All Users  
**Preconditions:** Policy exists with sections  
**Main Flow:**
1. User clicks policy card from list
2. System displays policy detail view with tabs
3. System fetches policy data and sections (Week 3)
4. **Content Tab (Default):**
   - Displays full policy text
   - Shows metadata: owner, department, security domain (Week 3)
   - Shows version, status, dates
5. **Sections Tab (Week 3):**
   - User clicks "Sections" tab
   - System displays sections in accordion UI
   - Each section shows:
     - Section number and title
     - Section content (expandable)
     - Compliance framework tags (ISO 27001, NIST, GDPR)
     - Creation date
6. User can expand/collapse sections
7. System subscribes to real-time updates for sections (Week 3)

**Postconditions:** 
- Policy displayed with structured sections
- User can navigate sections easily
- Compliance tags visible per section

**Alternative Flows:**
- 3a. No sections exist → Display "No sections available" message

---

#### **UC-05: Compare Policy Versions**
**Actors:** Security Team Member, Auditor  
**Preconditions:** Policy has multiple versions  
**Main Flow:**
1. User opens policy detail view
2. User clicks "Version History" button
3. System displays list of all versions
4. User selects two versions to compare
5. User clicks "Compare Versions"
6. System displays side-by-side diff view:
   - Highlighted additions in green
   - Highlighted deletions in red
   - Unchanged content in standard format
7. User reviews changes

**Postconditions:** 
- User understands changes between versions
- Audit trail visible

---

#### **UC-06: Import Policies from JSON**
**Actors:** Policy Manager, Admin  
**Preconditions:** User is authenticated  
**Main Flow:**
1. User clicks "Import JSON" button
2. System displays JSON import modal
3. User pastes JSON or uploads JSON file
4. System validates JSON schema
5. System parses policies from JSON
6. System creates policy records
7. System auto-generates sections and tags (Week 3)
8. System displays import summary (success/failed count)

**Postconditions:** 
- Policies created from JSON
- Sections auto-generated
- Import logged

**Alternative Flows:**
- 4a. Invalid JSON → Display "Invalid JSON format" error

---

#### **UC-07: Export Policies**
**Actors:** All Users  
**Preconditions:** Policies exist  
**Main Flow:**
1. User selects one or more policies
2. User clicks "Export" dropdown
3. User selects format:
   - **PDF**: Professional document with formatting
   - **JSON**: Machine-readable data export
4. System generates file
5. System triggers download

**Postconditions:** 
- File downloaded to user's device
- Export logged

---

#### **UC-08: Real-Time Collaboration (Week 3)**
**Actors:** Multiple Concurrent Users  
**Preconditions:** 
- Multiple users viewing same policy
- Real-time subscription active  

**Main Flow:**
1. User A opens policy in browser tab
2. User B opens same policy in different tab/browser
3. User A edits and saves policy
4. System updates policy in database
5. System regenerates sections
6. System broadcasts change via Supabase real-time
7. User B's view automatically refreshes
8. User B sees updated content and sections without manual refresh

**Postconditions:** 
- All users see consistent, latest data
- No stale data displayed

---

### 2.2 Administrative Use Cases

#### **UC-09: Manage Compliance Frameworks (Week 3)**
**Actors:** Admin, Compliance Officer  
**Preconditions:** User has admin role  
**Main Flow:**
1. Admin navigates to compliance frameworks section
2. System displays all framework controls
3. Admin can:
   - Add new framework control with keywords
   - Edit existing control descriptions
   - Update keyword lists for better tagging
4. System saves changes
5. New keywords apply to future section tagging

**Postconditions:** 
- Compliance frameworks updated
- Future policies use updated keywords

---

#### **UC-10: Audit Policy Access**
**Actors:** Auditor, Compliance Officer  
**Preconditions:** Policy access logging enabled  
**Main Flow:**
1. Auditor requests access logs for policy
2. System queries `policy_access_logs` table
3. System displays:
   - User who accessed policy
   - Action performed (view, edit, delete)
   - Timestamp
   - IP address and user agent
4. Auditor exports log for compliance reporting

**Postconditions:** 
- Audit trail available
- Compliance requirements met

---

## 3. Data Flow Diagrams

### 3.1 Policy Creation Data Flow
```
User Input → CreatePolicyModal → usePolicies.createPolicy()
    ↓
Insert policy → policies table (status=draft, version=1.0)
    ↓
Split content → sectionSplitter.splitPolicyIntoSections()
    ↓
Fetch frameworks → compliance_frameworks table
    ↓
Auto-tag sections → sectionSplitter.autoTagSection()
    ↓
Insert sections → policy_sections table
    ↓
Broadcast update → Supabase real-time channel
    ↓
All clients refresh → Display new policy with sections
```

### 3.2 Policy Update with Section Regeneration Data Flow
```
User Input → EditPolicyModal → usePolicies.updatePolicy()
    ↓
Increment version → Update policies table
    ↓
Create snapshot → Insert to policy_versions table
    ↓
Content changed? → Check if content differs
    ↓ YES
Delete old sections → DELETE FROM policy_sections WHERE policy_id
    ↓
Split new content → sectionSplitter.splitPolicyIntoSections()
    ↓
Fetch frameworks → compliance_frameworks table
    ↓
Re-tag sections → sectionSplitter.autoTagSection()
    ↓
Insert new sections → policy_sections table
    ↓
Broadcast update → Supabase real-time channel
    ↓
All clients refresh → Display updated policy with new sections
```

---

## 4. Security & Access Control

### 4.1 Row-Level Security (RLS) Policies

**policies table:**
- **SELECT**: Active policies visible to everyone; all policies visible to authenticated users
- **INSERT**: Authenticated users can create policies
- **UPDATE**: Policy creators or admins can update
- **DELETE**: Policy creators or admins can delete

**policy_sections table:**
- **SELECT**: Anyone can view sections for active policies or if authenticated
- **INSERT**: Authenticated users can create sections
- **UPDATE**: Policy creators can update sections
- **DELETE**: Policy creators can delete sections

**compliance_frameworks table:**
- **SELECT**: Public read access
- **ALL**: Authenticated users can manage

**profiles table:**
- **SELECT, UPDATE, INSERT**: Users can only access their own profile

---

**Document Version:** 1.0  
**Last Updated:** 2025-10-22  
**Covers:** Week 1-3 Implementation
