import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileText, Download, Eye, Search, Filter, Upload, Calendar } from "lucide-react";
import { MobileHeader } from "@/components/mobile-header";
import { Input } from "@/components/ui/input";
import { LoadingOverlay } from "@/components/loading-overlay";

interface DocumentsPageProps {
  onBack: () => void;
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  category: string;
  url?: string;
}

export function DocumentsPage({ onBack }: DocumentsPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: documents, isLoading } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
  });

  const categories = [
    { id: "all", name: "All Documents" },
    { id: "contract", name: "Contracts" },
    { id: "certificate", name: "Certificates" },
    { id: "policy", name: "Policies" },
    { id: "personal", name: "Personal" },
  ];

  const filteredDocuments = documents?.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getFileIcon = (type: string) => {
    const fileType = type.toLowerCase();
    if (fileType.includes('pdf')) {
      return <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
        <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
      </div>;
    } else if (fileType.includes('doc') || fileType.includes('word')) {
      return <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
        <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      </div>;
    } else if (fileType.includes('xls') || fileType.includes('excel')) {
      return <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
        <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
      </div>;
    } else {
      return <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
        <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      </div>;
    }
  };

  if (isLoading) {
    return <LoadingOverlay isVisible={true} message="Loading documents..." />;
  }

  return (
    <div className="min-h-screen" style={{ background: '#f2f2f7' }}>
      <MobileHeader 
        title="Documents" 
        onBack={onBack}
        showNotifications={true}
      />

      <div className="px-4 pb-28 space-y-4 pt-4">
        {/* Upload Button */}
        <button className="w-full ios-button py-4 px-6 text-lg font-semibold flex items-center justify-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Document
        </button>

        {/* Search and Filter */}
        <div className="ios-card">
          <div className="p-4">
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 ios-button-secondary border-0"
                />
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'ios-button text-white'
                        : 'ios-button-secondary'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Document List */}
        <div className="ios-card">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white" style={{ fontWeight: 600, letterSpacing: '-0.022em' }}>
                {selectedCategory === "all" ? "All Documents" : categories.find(c => c.id === selectedCategory)?.name}
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {filteredDocuments.length} files
              </span>
            </div>
            
            {filteredDocuments.length > 0 ? (
              <div className="space-y-3">
                {filteredDocuments.map((document) => (
                  <div key={document.id} className="ios-list-item p-4">
                    <div className="flex items-start gap-3">
                      {getFileIcon(document.type)}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-lg font-semibold text-gray-900 dark:text-white truncate" style={{ fontWeight: 600, letterSpacing: '-0.022em' }}>
                              {document.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {document.type} • {formatFileSize(document.size)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <Calendar className="h-3 w-3" />
                            <span>Uploaded {formatDate(document.uploadDate)}</span>
                          </div>
                          
                          <div className="flex gap-2">
                            <button className="ios-button-secondary px-3 py-1.5 text-xs font-medium flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              View
                            </button>
                            <button className="ios-button-secondary px-3 py-1.5 text-xs font-medium flex items-center gap-1">
                              <Download className="h-3 w-3" />
                              Download
                            </button>
                          </div>
                        </div>

                        {/* Category Badge */}
                        <div className="mt-2">
                          <span className="ios-badge" style={{ 
                            background: 'rgba(0, 122, 255, 0.15)', 
                            color: 'rgba(0, 122, 255, 1)',
                            fontSize: '11px'
                          }}>
                            {document.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="ios-list-item p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {searchTerm ? 'No documents found' : 'No documents available'}
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  {searchTerm 
                    ? `Try adjusting your search term "${searchTerm}"` 
                    : 'Upload your first document to get started'
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Access */}
        <div className="ios-card">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4" style={{ fontWeight: 600, letterSpacing: '-0.022em' }}>
              Quick Access
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <button className="ios-list-item p-4 text-left hover:scale-[0.98] transition-transform">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Employment Contract</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">PDF</p>
                  </div>
                </div>
              </button>

              <button className="ios-list-item p-4 text-left hover:scale-[0.98] transition-transform">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Tax Documents</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Multiple</p>
                  </div>
                </div>
              </button>

              <button className="ios-list-item p-4 text-left hover:scale-[0.98] transition-transform">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Certificates</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">PDF</p>
                  </div>
                </div>
              </button>

              <button className="ios-list-item p-4 text-left hover:scale-[0.98] transition-transform">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                    <FileText className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Policies</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">PDF</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}