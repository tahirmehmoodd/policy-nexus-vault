import { Shield } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';

export const AdminLink = () => {
  const { isAdmin } = useUserRole();
  const navigate = useNavigate();

  if (!isAdmin) return null;

  return (
    <Button
      variant="outline"
      onClick={() => navigate('/admin/policies')}
      className="gap-2"
    >
      <Shield className="h-4 w-4" />
      Admin Dashboard
    </Button>
  );
};
