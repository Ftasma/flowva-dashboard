export interface Tool {
  id: string;
  libraryId?: any;
  title: string;
  description: string;
  toolLogo?: string;
  isAITool?: boolean;
  isAitool?: boolean;
  isAiTool?: boolean;

  usersIcon?: string;
  url: string;
  oauth_provider?: string;
  category: string[];
  bgColor?: string;
  textColor?: string;
  isCustom?: boolean;
  created_at?: Date;
}

export interface LibraryTool {
  id: string;
  libraryId: string;
  title: string;
  description: string;
  toolLogo?: string;
  isAITool?: boolean;
  isAitool?: boolean;
  isAiTool?: boolean;
  url: string;
  oauth_provider: string;
  category: string[];
  isCustom?: boolean;
}
