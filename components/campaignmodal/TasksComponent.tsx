import { useState } from "react";
import { Image, Link, ListChecks, Info } from "lucide-react";
import { BaseStepProps } from "@/types/camapaignmodal";

// Task type definitions
const taskTypes = [
  {
    id: "social",
    name: "Social Media Task",
    description: "Engage with your brand on social platforms",
    icon: <Image className="w-5 h-5" />,
    placeholder: "Follow us on Twitter, Share our post, etc.",
  },
  {
    id: "engagement",
    name: "Product Engagement",
    description: "Drive users to product via specific actions",
    icon: <Link className="w-5 h-5" />,
    placeholder: "Comment on post, retweet post, etc",
  },
  {
    id: "websiteLink",
    name: "Custom Task",
    description:
      "Create your own engagement task that will deliver unique interaction",
    icon: <ListChecks className="w-5 h-5" />,
    placeholder:
      "Download our app, Visit our website, Sign up for newsletter, etc.",
  },
];

const TasksComponent = ({ formData, setFormData }: BaseStepProps) => {
  const [localTasks, setLocalTasks] = useState<{
    social: string;
    engagement: string;
    websiteLink: string;
  }>(formData.tasks);

  const handleLocalTaskUpdate = (
    taskType: keyof typeof localTasks,
    value: string
  ) => {
    const updatedTasks = {
      ...localTasks,
      [taskType]: value,
    };

    setLocalTasks(updatedTasks);
    setFormData((prev: any) => ({
      ...prev,
      tasks: updatedTasks,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">
          Configure User Tasks
        </h3>
        <div className="text-sm text-gray-500">Step 6 of 8</div>
      </div>

      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-yellow-500 mt-0.5 mr-2 shrink-0" />
          <p className="text-sm text-yellow-700">
            Create 3 tasks that users will complete to earn Poynts. Each
            campaign requires all three types of tasks.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {taskTypes.map((taskType) => (
          <div
            key={taskType.id}
            className="border border-gray-200 rounded-lg p-4"
          >
            <div className="flex items-center mb-3">
              <div className="h-8 w-8 rounded-lg bg-side/10 flex items-center justify-center mr-3">
                {taskType.icon}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{taskType.name}</h4>
                <p className="text-xs text-gray-500">
                  {taskType.description}
                </p>
              </div>
            </div>

            <div className="mt-2">
              <input
                type="text"
                value={
                  localTasks[taskType.id as keyof typeof localTasks] || ""
                }
                onChange={(e) =>
                  handleLocalTaskUpdate(
                    taskType.id as keyof typeof localTasks,
                    e.target.value
                  )
                }
                placeholder={taskType.placeholder}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-side"
              />
              {!localTasks[
                taskType.id as keyof typeof localTasks
              ]?.trim() && (
                <p className="mt-1 text-xs text-red-500">
                  This task is required
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Tips for effective tasks:
        </h4>
        <ul className="space-y-1 text-sm text-gray-600 list-disc pl-5">
          <li>Keep tasks simple and achievable</li>
          <li>Make sure tasks align with your campaign objective</li>
          <li>Create a natural progression between tasks</li>
          <li>Use clear, action-oriented language</li>
        </ul>
      </div>
    </div>
  );
};

export default TasksComponent;