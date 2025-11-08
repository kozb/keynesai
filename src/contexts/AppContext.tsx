import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Material {
  id: string;
  name: string;
  type: "PDF" | "Excel" | "Word";
  file?: File;
  uploadedAt: Date;
  status: "uploading" | "ready" | "error";
}

interface AnalysisResult {
  action: string;
  materials: string[];
  data: any;
  timestamp: Date;
}

interface AppContextType {
  materials: Material[];
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>;
  analysisResults: Record<string, AnalysisResult>;
  setAnalysisResults: (results: Record<string, AnalysisResult>) => void;
  addAnalysisResult: (actionId: string, result: AnalysisResult) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [analysisResults, setAnalysisResults] = useState<Record<string, AnalysisResult>>({});

  const addAnalysisResult = (actionId: string, result: AnalysisResult) => {
    setAnalysisResults((prev) => ({
      ...prev,
      [actionId]: result,
    }));
  };

  return (
    <AppContext.Provider
      value={{
        materials,
        setMaterials,
        analysisResults,
        setAnalysisResults,
        addAnalysisResult,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
