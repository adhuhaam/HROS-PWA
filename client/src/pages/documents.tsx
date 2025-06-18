import { useQuery } from "@tanstack/react-query";
import { MobileHeader } from "@/components/mobile-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, File, Award, FileImage, Folder } from "lucide-react";
import type { Document } from "@shared/schema";

interface DocumentsPageProps {
  onBack: () => void;
}

export function DocumentsPage({ onBack }: DocumentsPageProps) {
  const { data: documents } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
  });

  const getDocumentIcon = (category: string) => {
    switch (category) {
      case "Contracts":
        return <File className="text-hros-blue w-5 h-5" />;
      case "Certificates":
        return <Award className="text-green-600 w-5 h-5" />;
      case "Tax Forms":
        return <FileText className="text-purple-600 w-5 h-5" />;
      default:
        return <FileImage className="text-orange-600 w-5 h-5" />;
    }
  };

  const getIconBgColor = (category: string) => {
    switch (category) {
      case "Contracts":
        return "bg-blue-100";
      case "Certificates":
        return "bg-green-100";
      case "Tax Forms":
        return "bg-purple-100";
      default:
        return "bg-orange-100";
    }
  };

  const categories = [
    { name: "Contracts", icon: File, bgColor: "bg-blue-100", textColor: "text-hros-blue" },
    { name: "Certificates", icon: Award, bgColor: "bg-green-100", textColor: "text-green-600" },
    { name: "Tax Forms", icon: FileText, bgColor: "bg-purple-100", textColor: "text-purple-600" },
    { name: "Other", icon: Folder, bgColor: "bg-orange-100", textColor: "text-orange-600" },
  ];

  return (
    <div className="min-h-screen pb-20">
      <MobileHeader title="Documents" onBack={onBack} />
      
      <div className="px-6 py-6">
        {/* Document Categories */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.name}
                variant="outline"
                className="bg-white rounded-xl p-4 shadow-sm border text-center hover:shadow-md transition-shadow h-auto flex-col space-y-3"
              >
                <div className={`w-12 h-12 ${category.bgColor} rounded-xl flex items-center justify-center`}>
                  <Icon className={`${category.textColor} w-6 h-6`} />
                </div>
                <p className="font-medium text-gray-900 text-sm">{category.name}</p>
              </Button>
            );
          })}
        </div>
        
        {/* Recent Documents */}
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Documents</h3>
        <div className="space-y-3">
          {documents?.map((doc) => (
            <Card key={doc.id} className="shadow-sm border">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${getIconBgColor(doc.category)} rounded-lg flex items-center justify-center`}>
                    {getDocumentIcon(doc.category)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{doc.title}</p>
                    <p className="text-xs text-gray-500">
                      {doc.fileType} • {doc.fileSize} • {new Date(doc.createdAt!).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-hros-blue hover:text-blue-700"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
