-- Step 3: Update existing policies to use new status values and create RLS policies
UPDATE policies SET status = 'review' WHERE status = 'under_review';
UPDATE policies SET status = 'approved' WHERE status = 'active';
UPDATE policies SET status = 'deprecated' WHERE status = 'archived';

-- Drop old RLS policies
DROP POLICY IF EXISTS "Anyone can view active policies" ON policies;
DROP POLICY IF EXISTS "Users can view policies" ON policies;
DROP POLICY IF EXISTS "Users can create draft policies" ON policies;
DROP POLICY IF EXISTS "Users can update their own draft policies" ON policies;
DROP POLICY IF EXISTS "Authenticated users can create policies" ON policies;
DROP POLICY IF EXISTS "Policy creators can delete their policies" ON policies;
DROP POLICY IF EXISTS "Users can delete their own policies or admins can delete any" ON policies;
DROP POLICY IF EXISTS "Admins can update any policy" ON policies;

-- RLS: Viewers see approved policies
CREATE POLICY "Viewers can view approved policies" 
ON policies FOR SELECT 
USING (status = 'approved');

-- RLS: Editors see own drafts and reviews
CREATE POLICY "Editors can view own drafts and reviews" 
ON policies FOR SELECT 
USING (
  auth.uid() = created_by AND 
  status IN ('draft', 'review')
);

-- RLS: Reviewers see policies under review
CREATE POLICY "Reviewers can view policies under review" 
ON policies FOR SELECT 
USING (
  has_role(auth.uid(), 'reviewer') AND 
  status = 'review'
);

-- RLS: Admins see all policies
CREATE POLICY "Admins can view all policies" 
ON policies FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

-- RLS: Editors create draft policies only
CREATE POLICY "Editors can create draft policies" 
ON policies FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND
  created_by = auth.uid() AND
  status = 'draft'
);

-- RLS: Editors update own draft/review policies
CREATE POLICY "Editors can update own policies" 
ON policies FOR UPDATE 
USING (
  auth.uid() = created_by AND 
  status IN ('draft', 'review')
)
WITH CHECK (
  auth.uid() = created_by AND 
  status IN ('draft', 'review')
);

-- RLS: Reviewers update policies under review
CREATE POLICY "Reviewers can update policies under review" 
ON policies FOR UPDATE 
USING (
  has_role(auth.uid(), 'reviewer') AND 
  status = 'review'
)
WITH CHECK (
  has_role(auth.uid(), 'reviewer') AND 
  status IN ('draft', 'approved')
);

-- RLS: Admins update any policy
CREATE POLICY "Admins can update any policy" 
ON policies FOR UPDATE 
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- RLS: Admins delete any policy
CREATE POLICY "Admins can delete any policy" 
ON policies FOR DELETE 
USING (has_role(auth.uid(), 'admin'));

-- RLS: Editors delete own draft policies
CREATE POLICY "Editors can delete own draft policies" 
ON policies FOR DELETE 
USING (
  auth.uid() = created_by AND 
  status = 'draft'
);