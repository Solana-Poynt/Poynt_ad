"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Building2, Briefcase, Loader2 } from "lucide-react";
import { NotificationState } from "@/types/general";
import Notification from "./Notification";
import { useSendDataMutation } from "@/store/api/api";
import { saveDataToLocalStorage } from "@/utils/localStorage";

interface BusinessFormData {
  name: string;
  email: string;
  industry: string;
  category: string[];
}

interface BusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BusinessModal = ({ isOpen, onClose }: BusinessModalProps) => {
  // Form and loading state
  const router = useRouter();
  const [formData, setFormData] = useState<BusinessFormData>({
    name: "",
    email: "",
    industry: "",
    category: [],
  });

  // Notification state
  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    status: "error",
    show: false,
  });

  const showNotification = useCallback(
    (message: string, status: "success" | "error") => {
      setNotification({
        message,
        status,
        show: true,
      });
    },
    []
  );

  const industries = [
    { id: "retail", name: "Retail & Shopping" },
    { id: "tech", name: "Technology & Software" },
    { id: "food", name: "Food & Beverage" },
    { id: "health", name: "Healthcare & Medical" },
    { id: "education", name: "Education & Training" },
    { id: "finance", name: "Finance & Banking" },
    { id: "automotive", name: "Automotive" },
    { id: "real_estate", name: "Real Estate & Property" },
    { id: "travel", name: "Travel & Tourism" },
    { id: "entertainment", name: "Entertainment & Media" },
    { id: "construction", name: "Construction & Architecture" },
    { id: "manufacturing", name: "Manufacturing & Industrial" },
    { id: "fashion", name: "Fashion & Apparel" },
    { id: "beauty", name: "Beauty & Personal Care" },
    { id: "sports", name: "Sports & Recreation" },
    { id: "agriculture", name: "Agriculture & Farming" },
    { id: "energy", name: "Energy & Utilities" },
    { id: "transportation", name: "Transportation & Logistics" },
    { id: "telecom", name: "Telecommunications" },
    { id: "legal", name: "Legal Services" },
    { id: "hospitality", name: "Hospitality & Hotels" },
    { id: "art", name: "Arts & Crafts" },
    { id: "nonprofit", name: "Non-Profit & Charity" },
    { id: "gaming", name: "Gaming & eSports" },
    { id: "professional", name: "Professional Services" },
    { id: "events", name: "Events & Weddings" },
    { id: "marketing", name: "Marketing & Advertising" },
    { id: "home", name: "Home Services & Maintenance" },
    { id: "pet", name: "Pet Care & Veterinary" },
    { id: "fitness", name: "Fitness & Wellness" },
    { id: "childcare", name: "Childcare & Education" },
    { id: "consulting", name: "Business Consulting" },
    { id: "insurance", name: "Insurance" },
    { id: "jewelry", name: "Jewelry & Accessories" },
    { id: "music", name: "Music & Audio" },
    { id: "publishing", name: "Publishing & Books" },
    { id: "religious", name: "Religious & Spiritual" },
    { id: "security", name: "Security & Defense" },
    { id: "government", name: "Government & Public Sector" },
    { id: "environmental", name: "Environmental & Green" },
    { id: "others", name: "Other Sectors" },
  ];

  const categories = [
    { id: "local", name: "Local Business" },
    { id: "online", name: "Online Store" },
    { id: "service", name: "Service Provider" },
    { id: "brand", name: "Brand" },
    { id: "startup", name: "Startup" },
    { id: "enterprise", name: "Enterprise" },
  ];

  const handleCategoryToggle = useCallback((categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      category: prev.category.includes(categoryId)
        ? prev.category.filter((id) => id !== categoryId)
        : [...prev.category, categoryId],
    }));
  }, []);

  const [createBusiness, { isLoading, reset }] = useSendDataMutation();
  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.industry ||
      formData.category.length === 0
    ) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    const request: any = await createBusiness({
      url: "business",
      data: formData,
      type: "POST",
    });

    if (request?.data) {
      const { data, message, status } = request?.data;
      saveDataToLocalStorage("businessId", data.id);
      showNotification(message, "success");
      // Reset form
      setFormData({
        name: "",
        email: "",
        industry: "",
        category: [],
      });
      setTimeout(() => {
        onClose();
      }, 6000);
      router.push("/business");
    } else {
      showNotification(
        request?.error?.data?.message
          ? request?.error?.data?.message
          : "Check Internet Connection and try again",
        "error"
      );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex-shrink-0">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Create Business
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={isLoading}
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Business Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B71C1C] disabled:bg-gray-50 disabled:cursor-not-allowed"
                      placeholder="Enter your business name"
                    />
                  </div>
                </div>

                {/* Business email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Email
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B71C1C] disabled:bg-gray-50 disabled:cursor-not-allowed"
                      placeholder="Enter your business email"
                    />
                  </div>
                </div>

                {/* Industry Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Industry
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={formData.industry}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          industry: e.target.value,
                        }))
                      }
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B71C1C] appearance-none bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select an industry</option>
                      {industries.map((industry) => (
                        <option key={industry.id} value={industry.id}>
                          {industry.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Category
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryToggle(category.id)}
                        disabled={isLoading}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors
                          ${
                            formData.category.includes(category.id)
                              ? "bg-[#B71C1C] border-[#B71C1C] text-white"
                              : "border-gray-200 text-gray-700 hover:bg-gray-50"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={
                  isLoading ||
                  !formData.name ||
                  !formData.email ||
                  !formData.industry ||
                  formData.category.length === 0
                }
                className="flex items-center justify-center px-4 py-2 bg-[#B71C1C] text-white rounded-lg hover:bg-[#B71C1C]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Creating...
                  </>
                ) : (
                  "Create Business"
                )}
              </button>
            </div>
          </motion.div>

          {/* Notification Component */}
          {notification.show && (
            <Notification
              message={notification.message}
              status={notification.status}
              switchShowOff={() =>
                setNotification((prev) => ({ ...prev, show: false }))
              }
            />
          )}
        </div>
      )}
    </AnimatePresence>
  );
};

export default BusinessModal;
