import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUserManagement } from '@/hooks/useUserManagement';
import { UserRole } from '@/hooks/useUserRole';
import { Users, Shield, Edit, Eye, Trash2, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const roleColors = {
  admin: 'bg-red-100 text-red-800 border-red-200',
  reviewer: 'bg-blue-100 text-blue-800 border-blue-200',
  editor: 'bg-green-100 text-green-800 border-green-200',
  viewer: 'bg-gray-100 text-gray-800 border-gray-200',
};

const roleIcons = {
  admin: Shield,
  reviewer: Edit,
  editor: Edit,
  viewer: Eye,
};

export const UserRoleManagement = () => {
  const { users, loading, assignRole, removeRole } = useUserManagement();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<Record<string, UserRole>>({});

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssignRole = async (userId: string) => {
    const role = selectedRole[userId];
    if (role) {
      await assignRole(userId, role);
      setSelectedRole(prev => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.roles.includes('admin')).length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reviewers</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.roles.includes('reviewer')).length}
                </p>
              </div>
              <Edit className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Editors</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.roles.includes('editor')).length}
                </p>
              </div>
              <Edit className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users by email or name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* User List */}
      <div className="space-y-4">
        {filteredUsers.map(user => {
          const RoleIcon = user.roles.length > 0 ? roleIcons[user.roles[0]] : Users;
          
          return (
            <Card key={user.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <RoleIcon className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-lg">{user.email}</CardTitle>
                    </div>
                    <CardDescription>
                      {user.full_name || 'No name provided'} • Joined {formatDate(user.created_at)}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Current Roles */}
                  <div>
                    <p className="text-sm font-medium mb-2">Current Roles:</p>
                    <div className="flex flex-wrap gap-2">
                      {user.roles.length > 0 ? (
                        user.roles.map(role => (
                          <div key={role} className="flex items-center gap-2">
                            <Badge className={roleColors[role]}>
                              {role}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeRole(user.id, role)}
                              className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">No roles assigned</span>
                      )}
                    </div>
                  </div>

                  {/* Assign New Role */}
                  <div>
                    <p className="text-sm font-medium mb-2">Assign New Role:</p>
                    <div className="flex gap-2">
                      <Select
                        value={selectedRole[user.id] || ''}
                        onValueChange={(value) =>
                          setSelectedRole(prev => ({ ...prev, [user.id]: value as UserRole }))
                        }
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select a role..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4" />
                              Admin
                            </div>
                          </SelectItem>
                          <SelectItem value="reviewer">
                            <div className="flex items-center gap-2">
                              <Edit className="h-4 w-4" />
                              Reviewer
                            </div>
                          </SelectItem>
                          <SelectItem value="editor">
                            <div className="flex items-center gap-2">
                              <Edit className="h-4 w-4" />
                              Editor
                            </div>
                          </SelectItem>
                          <SelectItem value="viewer">
                            <div className="flex items-center gap-2">
                              <Eye className="h-4 w-4" />
                              Viewer
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={() => handleAssignRole(user.id)}
                        disabled={!selectedRole[user.id]}
                      >
                        Assign Role
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredUsers.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-xl font-semibold mb-2">No Users Found</p>
              <p className="text-muted-foreground">Try adjusting your search query</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
