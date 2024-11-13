export interface NotificationState {
  message: string;
  status: "success" | "error";
  show: boolean;
}

export interface User {
  id: string | null;
  email: string | null;
  name: string | null;
  role?: string | null;
}

export interface BusinessFormData {
  businessName: string;
  businessIndustry: string;
  selectedCategories: string[];
}
