import { Target, MousePointer, Check } from "lucide-react";

interface EngagementSelectorProps {
  formData: any;
  setFormData: (data: any) => void;
}

const engagementGoals = [
  {
    id: "brand_awareness",
    title: "Brand Awareness",
    description: "Maximize visibility and reach",
    icon: <Target className="w-5 h-5" />,
    metrics: "Measured by impressions",
    features: [
      "Premium ad placement",
      "More reach and Target",
      "Viewability tracking",
    ],
  },
  {
    id: "website_traffic",
    title: "Website Traffic",
    description: "Drive visitors to your site",
    icon: <MousePointer className="w-5 h-5" />,
    metrics: "Measured by clicks and CTR",
    features: [
      "Click optimization",
      "Landing page tracking",
      "Retargeting options",
      "Engagement analytics",
    ],
  },
];

const EngagementSelector = ({ formData, setFormData }: EngagementSelectorProps) => {
  const handleEngagementSelect = (type: "brand_awareness" | "website_traffic") => {
    setFormData((prev: any) => ({
      ...prev,
      engagementGoal: type,
    }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">
        Choose Campaign Objective
      </h3>

      <div className="grid grid-cols-1 gap-4">
        {engagementGoals.map((type) => (
          <div
            key={type.id}
            onClick={() => handleEngagementSelect(type.id as "brand_awareness" | "website_traffic")}
            className={`
                bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6
                cursor-pointer transition-all duration-200 border
                ${
                  formData.engagementGoal === type.id
                    ? "border-side ring-1 ring-side shadow-md"
                    : "border-gray-200 hover:border-gray-300"
                }
              `}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`
                      w-10 h-10 rounded-lg flex items-center justify-center
                      ${
                        formData.engagementGoal === type.id
                          ? "bg-side/10 text-side"
                          : "bg-white text-gray-600"
                      }
                    `}
                  >
                    {type.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {type.title}
                    </h4>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </div>
                </div>
                {formData.engagementGoal === type.id && (
                  <div className="h-6 w-6 bg-side/10 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-side" />
                  </div>
                )}
              </div>

              {formData.engagementGoal === type.id && (
                <div className="pt-4 border-t border-gray-200 space-y-4">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">
                      Key Features:
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {type.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center text-sm text-gray-600"
                        >
                          <Check className="w-4 h-4 text-green-500 mr-2 shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium text-gray-900">
                        Performance Metrics:
                      </div>
                      <div className="text-sm text-gray-600">
                        {type.metrics}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {formData.engagementGoal && (
        <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
          <h5 className="text-sm font-medium text-gray-900 mb-2">
            Campaign Tips
          </h5>
          <p className="text-sm text-gray-600">
            {formData.engagementGoal === "brand_awareness" &&
              "Brand awareness campaigns are perfect for reaching new audiences and increasing your brand's visibility. Focus on creating memorable, engaging content."}
            {formData.engagementGoal === "website_traffic" &&
              "Traffic campaigns are ideal when you want to drive visitors to your website. Ensure your landing pages are optimized for the best results."}
          </p>
        </div>
      )}
    </div>
  );
};

export default EngagementSelector;