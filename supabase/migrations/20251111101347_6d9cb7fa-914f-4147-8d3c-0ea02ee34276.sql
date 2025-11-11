-- Add new role values to app_role enum
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'editor';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'reviewer';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'viewer';