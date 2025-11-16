import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Eye, Clock, FileText, Users } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserRoleManagement } from '@/components/UserRoleManagement';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Policy {
  id: string;
  title: string;
  description: string;
  author: string;
  created_at: string;
  type: string;
  department: string;
  status: string;
  version: number;
  category: string;
}

export default function AdminDashboard() {
  const { isAdmin, role, loading: roleLoading } = useUserRole();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Allow both admins and reviewers to access this dashboard
  const canAccessDashboard = isAdmin || role === 'reviewer';

  useEffect(() => {
    if (!roleLoading && !canAccessDashboard) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this dashboard",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [canAccessDashboard, roleLoading, navigate, toast]);

  useEffect(() => {
    if (canAccessDashboard) {
      fetchPolicies();
    }
  }, [canAccessDashboard]);

  const fetchPolicies = async () => {
    try {
      const { data, error } = await supabase
        .from('policies')
        .select('id, title, description, author, created_at, type, department, status, version, category')
        .in('status', ['review', 'approved', 'active'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPolicies(data || []);
    } catch (error) {
      console.error('Error fetching policies:', error);
      toast({
        title: "Error",
        description: "Failed to load policies",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (policyId: string) => {
    try {
      const { error } = await supabase.rpc('transition_policy_status', {
        policy_id_param: policyId,
        new_status_param: 'approved',
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Policy approved and ready for publishing",
      });

      fetchPolicies();
    } catch (error: any) {
      console.error('Error approving policy:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to approve policy",
        variant: "destructive",
      });
    }
  };

  const handlePublish = async (policyId: string) => {
    try {
      const { error } = await supabase.rpc('transition_policy_status', {
        policy_id_param: policyId,
        new_status_param: 'active',
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Policy published and now active",
      });

      fetchPolicies();
    } catch (error: any) {
      console.error('Error publishing policy:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to publish policy",
        variant: "destructive",
      });
    }
  };

  const handleArchive = async (policyId: string) => {
    try {
      const { error } = await supabase.rpc('transition_policy_status', {
        policy_id_param: policyId,
        new_status_param: 'archived',
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Policy archived successfully",
      });

      fetchPolicies();
    } catch (error: any) {
      console.error('Error archiving policy:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to archive policy",
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
      const { error } = await supabase.rpc('transition_policy_status', {
        policy_id_param: selectedPolicy,
        new_status_param: 'draft',
        rejection_reason_param: rejectionReason,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Policy rejected and returned to draft",
      });

      setShowRejectDialog(false);
      setRejectionReason('');
      setSelectedPolicy(null);
      fetchPolicies();
    } catch (error: any) {
      console.error('Error rejecting policy:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to reject policy",
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

  if (!canAccessDashboard) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{isAdmin ? 'Admin' : 'Reviewer'} Dashboard</h1>
        <p className="text-muted-foreground">
          {isAdmin ? 'Manage policies, users, and system settings' : 'Review and approve policies'}
        </p>
      </div>

      <Tabs defaultValue="review" className="w-full">
        <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-4' : 'grid-cols-3'} mb-6`}>
          <TabsTrigger value="review" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Review ({policies.filter(p => p.status === 'review').length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Approved ({policies.filter(p => p.status === 'approved').length})
          </TabsTrigger>
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Active ({policies.filter(p => p.status === 'active').length})
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="review">{policies.filter(p => p.status === 'review').length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Clock className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-xl font-semibold mb-2">No Policies for Review</p>
            <p className="text-muted-foreground">All submitted policies have been reviewed</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {policies.filter(p => p.status === 'review').map((policy) => (
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
        </TabsContent>

        <TabsContent value="approved">
          {policies.filter(p => p.status === 'approved').length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-xl font-semibold mb-2">No Approved Policies</p>
                <p className="text-muted-foreground">No policies are waiting to be published</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {policies.filter(p => p.status === 'approved').map((policy) => (
                <Card key={policy.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2">{policy.title}</CardTitle>
                        <CardDescription className="text-base">
                          {policy.description}
                        </CardDescription>
                      </div>
                      <Badge className="ml-4 bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approved
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
                        <p className="text-sm text-muted-foreground mb-1">Category</p>
                        <p className="font-medium">{policy.category}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Version</p>
                        <p className="font-medium">v{policy.version}</p>
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
                      {isAdmin && (
                        <Button
                          onClick={() => handlePublish(policy.id)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Publish to Active
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active">
          {policies.filter(p => p.status === 'active').length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Eye className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-xl font-semibold mb-2">No Active Policies</p>
                <p className="text-muted-foreground">No policies are currently published</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {policies.filter(p => p.status === 'active').map((policy) => (
                <Card key={policy.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2">{policy.title}</CardTitle>
                        <CardDescription className="text-base">
                          {policy.description}
                        </CardDescription>
                      </div>
                      <Badge className="ml-4 bg-blue-100 text-blue-800">
                        <Eye className="h-3 w-3 mr-1" />
                        Active
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
                        <p className="text-sm text-muted-foreground mb-1">Category</p>
                        <p className="font-medium">{policy.category}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Version</p>
                        <p className="font-medium">v{policy.version}</p>
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
                      {isAdmin && (
                        <Button
                          onClick={() => handleArchive(policy.id)}
                          variant="destructive"
                          className="flex-1"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Archive
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="users">
          {isAdmin ? (
            <UserRoleManagement />
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-xl font-semibold mb-2">Admin Access Required</p>
                <p className="text-muted-foreground">Only admins can manage user roles</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>


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
