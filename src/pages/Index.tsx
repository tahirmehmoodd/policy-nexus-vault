
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { PolicyList } from "@/components/PolicyList";
import { PolicyDetail } from "@/components/PolicyDetail";
import { CreatePolicyModal } from "@/components/CreatePolicyModal";
import { EditPolicyModal } from "@/components/EditPolicyModal";
import { XmlImportModal } from "@/components/XmlImportModal";
import { PolicyTemplatesModal } from "@/components/PolicyTemplatesModal";
import { TagManagement } from "@/components/TagManagement";
import { EnhancedSearchFilters, SearchFilters } from "@/components/EnhancedSearchFilters";
import { VersionHistoryModal } from "@/components/VersionHistoryModal";
import { usePolicyRepository, PolicyData } from "@/hooks/usePolicyRepository";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AuthModal } from "@/components/AuthModal";
import { FileText, Upload, Download, Settings, History, BookOpen, Tag } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

// Transform database policy to UI policy format
const transformPolicy = (dbPolicy: PolicyData) => ({
  policy_id: dbPolicy.id,
  title: dbPolicy.title,
  description: dbPolicy.description || "",
  type: dbPolicy.type,
  status: dbPolicy.status,
  created_at: dbPolicy.created_at,
  updated_at: dbPolicy.updated_at,
  author: dbPolicy.author,
  content: dbPolicy.content,
  currentVersion: dbPolicy.version.toString(),
  tags: dbPolicy.tags || [],
  versions: [],
  framework_category: dbPolicy.category === 'Technical Control' ? 'technical' as const : 
                     dbPolicy.category === 'Physical Control' ? 'physical' as const : 'organizational' as const,
  security_domain: dbPolicy.type,
});

export default function Index() {
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [xmlImportOpen, setXmlImportOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [tagManagementOpen, setTagManagementOpen] = useState(false);
  const [versionHistoryOpen, setVersionHistoryOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [filteredPolicies, setFilteredPolicies] = useState([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    policies,
    loading,
    searchPolicies,
    downloadPolicyAsJson,
    downloadPolicyAsPdf,
    refreshPolicies
  } = usePolicyRepository();

  // Extract unique tags from policies
  useEffect(() => {
    const tags = new Set<string>();
    policies.forEach(policy => {
      if (policy.tags) {
        policy.tags.forEach(tag => tags.add(tag));
      }
    });
    setAvailableTags(Array.from(tags));
  }, [policies]);

  // Set initial filtered policies
  useEffect(() => {
    const transformed = policies.map(transformPolicy);
    setFilteredPolicies(transformed);
  }, [policies]);

  // Show auth modal if not authenticated
  useEffect(() => {
    if (!user && !loading) {
      setAuthModalOpen(true);
    }
  }, [user, loading]);

  const handleSearch = async (query: string, filters: SearchFilters) => {
    try {
      const results = await searchPolicies(
        query,
        filters.tags,
        filters.type,
        filters.status,
        filters.category
      );
      const transformed = results.map(transformPolicy);
      setFilteredPolicies(transformed);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to search policies. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCategoryChange = async (category: string) => {
    setActiveCategory(category);
    
    if (category === 'all') {
      const transformed = policies.map(transformPolicy);
      setFilteredPolicies(transformed);
      return;
    }

    // Handle framework categories
    if (category === 'technical' || category === 'physical' || category === 'organizational') {
      const categoryMapping = {
        'technical': 'Technical Control',
        'physical': 'Physical Control', 
        'organizational': 'Organizational Control'
      };
      
      const results = await searchPolicies('', [], '', '', categoryMapping[category]);
      const transformed = results.map(transformPolicy);
      setFilteredPolicies(transformed);
      return;
    }

    // Handle specific domain filtering
    if (category.includes('-')) {
      const [frameworkCategory, domain] = category.split('-');
      const domainName = domain.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      
      const results = await searchPolicies('', [], domainName, '', '');
      const transformed = results.map(transformPolicy);
      setFilteredPolicies(transformed);
    }
  };

  const handlePolicyClick = (policy) => {
    setSelectedPolicy(policy);
  };

  const handleEditPolicy = (policy) => {
    setSelectedPolicy(policy);
    setEditModalOpen(true);
  };

  const handleDownloadPolicy = (policy) => {
    // Find the original database policy
    const dbPolicy = policies.find(p => p.id === policy.policy_id);
    if (dbPolicy) {
      downloadPolicyAsJson(dbPolicy);
    }
  };

  const handleDownloadPdf = (policy) => {
    const dbPolicy = policies.find(p => p.id === policy.policy_id);
    if (dbPolicy) {
      downloadPolicyAsPdf(dbPolicy);
    }
  };

  const handleViewVersionHistory = (policy) => {
    setSelectedPolicy(policy);
    setVersionHistoryOpen(true);
  };

  const stats = {
    total: policies.length,
    active: policies.filter(p => p.status === 'active').length,
    draft: policies.filter(p => p.status === 'draft').length,
    templates: policies.filter(p => p.author === 'Policy Repository Templates').length,
  };

  // Don't show main content if not authenticated
  if (!user) {
    return (
      <>
        <motion.div 
          className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl">Policy Repository</CardTitle>
                <p className="text-muted-foreground">
                  Secure Information Security Policy Management System
                </p>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setAuthModalOpen(true)} className="w-full">
                  Sign In to Continue
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
        <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      </>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        onCategoryChange={handleCategoryChange}
        onNewPolicyClick={() => setCreateModalOpen(true)}
        activeCategory={activeCategory}
        policies={filteredPolicies}
      />
      
      <main className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Main Policy List */}
          <div className="flex-1 flex flex-col">
            <div className="border-b bg-background p-6">
              <div className="flex items-center justify-between mb-6">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-3xl font-bold">Information Security Policy Repository</h1>
                  <p className="text-muted-foreground mt-1">
                    Manage, search, and maintain your organization's security policies
                  </p>
                </motion.div>
                <motion.div 
                  className="flex gap-2"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Button variant="outline" onClick={() => setTagManagementOpen(true)}>
                    <Tag className="h-4 w-4 mr-2" />
                    Manage Tags
                  </Button>
                  <Button variant="outline" onClick={() => setTemplatesOpen(true)}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Templates
                  </Button>
                  <Button variant="outline" onClick={() => setXmlImportOpen(true)}>
                    <Upload className="h-4 w-4 mr-2" />
                    Import XML
                  </Button>
                  <Button onClick={() => setCreateModalOpen(true)}>
                    <FileText className="h-4 w-4 mr-2" />
                    New Policy
                  </Button>
                </motion.div>
              </div>

              {/* Statistics Cards */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="hover-scale">
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-muted-foreground">Total Policies</p>
                        <p className="text-2xl font-bold">{stats.total}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover-scale">
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-muted-foreground">Active</p>
                        <p className="text-2xl font-bold">{stats.active}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover-scale">
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-muted-foreground">Drafts</p>
                        <p className="text-2xl font-bold">{stats.draft}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover-scale">
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <BookOpen className="h-8 w-8 text-purple-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-muted-foreground">Templates</p>
                        <p className="text-2xl font-bold">{stats.templates}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="flex-1 overflow-auto p-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <EnhancedSearchFilters
                  onSearch={handleSearch}
                  availableTags={availableTags}
                  loading={loading}
                />
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <PolicyList
                  policies={filteredPolicies}
                  onPolicyClick={handlePolicyClick}
                  onEditPolicy={handleEditPolicy}
                  onDownloadPolicy={handleDownloadPolicy}
                />
              </motion.div>
            </div>
          </div>

          {/* Policy Detail Sidebar */}
          {selectedPolicy && (
            <motion.div 
              className="w-1/3 border-l bg-muted/30"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PolicyDetail
                policy={selectedPolicy}
                onEdit={() => setEditModalOpen(true)}
                onDownload={handleDownloadPolicy}
                onDownloadPdf={handleDownloadPdf}
                onViewVersionHistory={handleViewVersionHistory}
                onClose={() => setSelectedPolicy(null)}
              />
            </motion.div>
          )}
        </div>
      </main>

      {/* Modals */}
      <CreatePolicyModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />

      <EditPolicyModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        policy={selectedPolicy}
      />

      <XmlImportModal
        open={xmlImportOpen}
        onOpenChange={setXmlImportOpen}
      />

      <PolicyTemplatesModal
        open={templatesOpen}
        onOpenChange={setTemplatesOpen}
      />

      <TagManagement
        isOpen={tagManagementOpen}
        onOpenChange={setTagManagementOpen}
        policies={filteredPolicies}
        onUpdatePolicy={(policy) => {
          refreshPolicies();
        }}
      />

      <VersionHistoryModal
        open={versionHistoryOpen}
        onOpenChange={setVersionHistoryOpen}
        policy={selectedPolicy ? policies.find(p => p.id === selectedPolicy.policy_id) : null}
      />
    </div>
  );
}
