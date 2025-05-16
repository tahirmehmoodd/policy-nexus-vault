
export interface Version {
  version_id: string;
  version_label: string;
  description: string;
  created_at: string;
  edited_by: string;
}

export interface Policy {
  policy_id: string;
  title: string;
  description: string;
  type: string;
  status: 'active' | 'draft' | 'archived';
  created_at: string;
  updated_at: string;
  author: string;
  content: string;
  currentVersion: string;
  tags: string[];
  versions: Version[];
}
