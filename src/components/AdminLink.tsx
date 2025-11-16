import { Shield } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';

export const AdminLink = () => {
  const { isAdmin, role } = useUserRole();
  const navigate = useNavigate();

  // Show for both admins and reviewers
  const canAccessDashboard = isAdmin || role === 'reviewer';
  
  if (!canAccessDashboard) return null;

  return (
    <Button
      variant="outline"
      onClick={() => navigate('/admin/policies')}
      className="gap-2"
    >
      <Shield className="h-4 w-4" />
      {isAdmin ? 'Admin' : 'Reviewer'} Dashboard
    </Button>
  );
};
