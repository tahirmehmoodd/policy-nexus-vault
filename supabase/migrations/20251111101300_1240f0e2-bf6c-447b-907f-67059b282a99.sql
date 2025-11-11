-- Step 1: Add new status values to the policy_status enum
ALTER TYPE policy_status ADD VALUE IF NOT EXISTS 'review';
ALTER TYPE policy_status ADD VALUE IF NOT EXISTS 'approved';
ALTER TYPE policy_status ADD VALUE IF NOT EXISTS 'deprecated';