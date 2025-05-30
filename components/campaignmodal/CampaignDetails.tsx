import { useState } from "react";
import { BaseStepProps } from "@/types/camapaignmodal";

const CampaignDetails = ({ formData, setFormData }: BaseStepProps) => {
  const [localInputs, setLocalInputs] = useState({
    name: formData.name,
    description: formData.description,
    ctaText: formData.cta.text,
    ctaUrl: formData.cta.url,
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setLocalInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    setFormData((prevData: any) => ({
      ...prevData,
      name: localInputs.name,
      description: localInputs.description,
      cta: {
        text: localInputs.ctaText,
        url: localInputs.ctaUrl,
      },
    }));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Campaign Details</h3>
        <div className="text-sm text-gray-500">Step 5 of 8</div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Campaign Name
          </label>
          <input
            type="text"
            value={localInputs.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-side focus:border-transparent"
            placeholder="Enter campaign name"
            maxLength={50}
          />
          <div className="mt-1 text-xs text-gray-500">
            {localInputs.name.length}/50 characters
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ad Description
          </label>
          <textarea
            value={localInputs.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-side focus:border-transparent resize-none"
            placeholder="Describe your ad campaign and what you're promoting"
            maxLength={200}
          />
          <div className="mt-1 text-xs text-gray-500">
            {localInputs.description.length}/200 characters
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Call to Action
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                value={localInputs.ctaText}
                onChange={(e) => handleInputChange("ctaText", e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-side focus:border-transparent"
                placeholder="CTA Text (e.g., Learn More)"
                maxLength={20}
              />
              <div className="mt-1 text-xs text-gray-500">
                {localInputs.ctaText.length}/20 characters
              </div>
            </div>
            <div>
              <input
                type="url"
                value={localInputs.ctaUrl}
                onChange={(e) => handleInputChange("ctaUrl", e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-side focus:border-transparent"
                placeholder="https://your-website.com"
              />
              <div className="mt-1 text-xs text-gray-500">
                Where should users be directed?
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2">
          {isSaved && (
            <span className="text-sm text-green-600">
              Changes saved successfully!
            </span>
          )}
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-side text-white rounded-lg hover:bg-side/90 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;