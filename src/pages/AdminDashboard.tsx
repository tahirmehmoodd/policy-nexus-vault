import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Eye, Clock, FileText } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PendingPolicy {
  id: string;
  title: string;
  description: string;
  author: string;
  created_at: string;
  type: string;
  department: string;
}

export default function AdminDashboard() {
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [pendingPolicies, setPendingPolicies] = useState<PendingPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [isAdmin, roleLoading, navigate, toast]);

  useEffect(() => {
    if (isAdmin) {
      fetchPendingPolicies();
    }
  }, [isAdmin]);

  const fetchPendingPolicies = async () => {
    try {
      const { data, error } = await supabase
        .from('policies')
        .select('id, title, description, author, created_at, type, department')
        .eq('status', 'review')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingPolicies(data || []);
    } catch (error) {
      console.error('Error fetching pending policies:', error);
      toast({
        title: "Error",
        description: "Failed to load pending policies",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (policyId: string) => {
    try {
      const { error } = await supabase
        .from('policies')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .eq('id', policyId);

      if (error) throw error;

      // Send email notification to policy owner
      const { sendOwnerEmailNotification } = await import('@/utils/emailNotifications');
      await sendOwnerEmailNotification(policyId, 'approved');

      toast({
        title: "Success",
        description: "Policy approved successfully",
      });

      fetchPendingPolicies();
    } catch (error) {
      console.error('Error approving policy:', error);
      toast({
        title: "Error",
        description: "Failed to approve policy",
        variant: "destructive",
      });
    }
  };

  const handleReject = async () => {
    if (!selectedPolicy || !rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('policies')
        .update({
          status: 'draft',
          rejection_reason: rejectionReason,
        })
        .eq('id', selectedPolicy);

      if (error) throw error;

      // Send email notification to policy owner
      const { sendOwnerEmailNotification } = await import('@/utils/emailNotifications');
      await sendOwnerEmailNotification(selectedPolicy, 'rejected', rejectionReason);

      toast({
        title: "Success",
        description: "Policy rejected and returned to draft",
      });

      setShowRejectDialog(false);
      setRejectionReason('');
      setSelectedPolicy(null);
      fetchPendingPolicies();
    } catch (error) {
      console.error('Error rejecting policy:', error);
      toast({
        title: "Error",
        description: "Failed to reject policy",
        variant: "destructive",
      });
    }
  };

  const openRejectDialog = (policyId: string) => {
    setSelectedPolicy(policyId);
    setShowRejectDialog(true);
  };

  if (roleLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Clock className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Review and manage policies awaiting approval</p>
      </div>

      {pendingPolicies.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-xl font-semibold mb-2">No Pending Policies</p>
            <p className="text-muted-foreground">All policies have been reviewed</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {pendingPolicies.map((policy) => (
            <Card key={policy.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{policy.title}</CardTitle>
                    <CardDescription className="text-base">
                      {policy.description}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="ml-4">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending Review
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Author</p>
                    <p className="font-medium">{policy.author}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Type</p>
                    <p className="font-medium">{policy.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Department</p>
                    <p className="font-medium">{policy.department || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Submitted</p>
                    <p className="font-medium">
                      {new Date(policy.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => navigate(`/policy/${policy.id}`)}
                    variant="outline"
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button
                    onClick={() => handleApprove(policy.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => openRejectDialog(policy.id)}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Policy</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this policy. This will be sent to the author.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter reason for rejection..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="min-h-[120px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
