
import { Button } from "@/components/ui/button";
import { FileIcon, ListIcon, DownloadIcon } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow">
        <h1 className="text-3xl font-bold text-center">Motorcycle Database</h1>
        <p className="text-center text-muted-foreground">
          Manage your motorcycle database with easy import and export features
        </p>
        
        <div className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-start gap-2"
            onClick={() => navigate('/import')}
          >
            <FileIcon className="h-5 w-5" />
            Import Excel File
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-start gap-2"
            onClick={() => navigate('/motorcycles')}
          >
            <ListIcon className="h-5 w-5" />
            List of Motorcycles
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-start gap-2"
            onClick={() => navigate('/output')}
          >
            <DownloadIcon className="h-5 w-5" />
            Output
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
