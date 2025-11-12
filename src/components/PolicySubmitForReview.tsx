import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Send, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PolicySubmitForReviewProps {
  policyId: string;
  policyTitle: string;
  currentReviewerId?: string | null;
  onSuccess?: () => void;
}

interface Reviewer {
  user_id: string;
  email: string;
  full_name: string | null;
}

export function PolicySubmitForReview({ policyId, policyTitle, currentReviewerId, onSuccess }: PolicySubmitForReviewProps) {
  const [open, setOpen] = useState(false);
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);
  const [selectedReviewer, setSelectedReviewer] = useState<string>(currentReviewerId || '');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchReviewers();
    }
  }, [open]);

  const fetchReviewers = async () => {
    try {
      // Get all users with reviewer role
      const { data: reviewerRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'reviewer');

      if (rolesError) throw rolesError;

      if (!reviewerRoles || reviewerRoles.length === 0) {
        return;
      }

      // Get profiles for these users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .in('id', reviewerRoles.map(r => r.user_id));

      if (profilesError) throw profilesError;

      setReviewers(profiles?.map(p => ({
        user_id: p.id,
        email: p.email || '',
        full_name: p.full_name
      })) || []);
    } catch (error) {
      console.error('Error fetching reviewers:', error);
      toast({
        title: "Error",
        description: "Failed to load reviewers",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (!selectedReviewer) {
      toast({
        title: "Error",
        description: "Please select a reviewer",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // First, assign the reviewer
      const { error: updateError } = await supabase
        .from('policies')
        .update({ reviewer_id: selectedReviewer })
        .eq('id', policyId);

      if (updateError) throw updateError;

      // Then transition to review status
      const { error: transitionError } = await supabase.rpc('transition_policy_status', {
        policy_id_param: policyId,
        new_status_param: 'review',
      });

      if (transitionError) throw transitionError;

      toast({
        title: "Success",
        description: "Policy submitted for review",
      });

      setOpen(false);
      onSuccess?.();
    } catch (error: any) {
      console.error('Error submitting for review:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit policy for review",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="default">
        <Send className="h-4 w-4 mr-2" />
        Submit for Review
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Policy for Review</DialogTitle>
            <DialogDescription>
              Select a reviewer to review "{policyTitle}". The reviewer will be notified via email.
            </DialogDescription>
          </DialogHeader>

          {reviewers.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No reviewers are available. Please contact an administrator to assign reviewer roles.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reviewer">Select Reviewer *</Label>
                <Select value={selectedReviewer} onValueChange={setSelectedReviewer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a reviewer" />
                  </SelectTrigger>
                  <SelectContent>
                    {reviewers.map((reviewer) => (
                      <SelectItem key={reviewer.user_id} value={reviewer.user_id}>
                        {reviewer.full_name || reviewer.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading || !selectedReviewer || reviewers.length === 0}>
              {loading ? 'Submitting...' : 'Submit for Review'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
