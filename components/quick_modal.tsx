"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  getDataFromLocalStorage,
  saveDataToLocalStorage,
} from "@/utils/localStorage";
import {
  ChevronRight,
  X,
  Target,
  AlignLeft,
  DollarSign,
  Rocket,
  InfoIcon,
  Building2,
} from "lucide-react";
import BusinessModal from "./businessmodal";
import { BusinessFormData } from "@/types/general";
import { access } from "fs";

interface Step {
  title: string;
  description: string;
  icon: JSX.Element;
  lists?: string[];
  cta?: boolean;
  funding?: boolean;
}

interface QuickStartProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const QuickStartButton = ({ isModalOpen, setIsModalOpen }: QuickStartProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const router = useRouter();
  const onboardModal = getDataFromLocalStorage("onboard");

  // Modal steps content
  const steps: Step[] = [
    {
      title: "Welcome to Poynt",
      description:
        "Thank you for choosing Poynt, we are happy to have you here. To get started quickly, here is a short guide to help you:",
      icon: <Target className="w-6 h-6 text-[#B71C1C]" />,
      lists: [
        "Create an account for the business you want to serve their ads",
        "Fund your Poynt Wallet with USDC or On-Ramp Local Fiat to USDC",
        "Proceed to create a Campaign. Monitor the performance afterwards",
      ],
    },
    {
      title: "Setup a  Business Account",
      description:
        "Easily manage advertising campaigns for multiple businesses through dedicated business accounts, all from your account.",

      icon: <AlignLeft className="w-6 h-6 text-[#B71C1C]" />,
      cta: true,
    },
    {
      title: "Setup and Fund Wallet",
      description:
        "Fund your wallet with either USDC or On-Ramp Local Currency to USDC, Powered by Solana!",
      icon: <DollarSign className="w-6 h-6 text-[#B71C1C]" />,
      funding: true,
    },
    {
      title: "Launch Campaign",
      description:
        "Review settings and launch your campaign to start reaching your audience.",
      icon: <Rocket className="w-6 h-6 text-[#B71C1C]" />,
    },
  ];

  const firstTime = () => {
    if (onboardModal === "true") {
      setIsOpen(false);
    } else if (onboardModal === "false") {
      setIsOpen(true);
    }
  };

  const stopModal = () => {
    saveDataToLocalStorage("onboard", "true");
  };

  useEffect(() => {
    firstTime();
  }, [onboardModal]);

  // Pulsing button component
  const PulsingButton = () => (
    <motion.button
      onClick={() => setIsOpen(true)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <InfoIcon className="w-8 h-8 p-2 rounded-xl  bg-[#F0F0F0]" />
      {/* Pulsing rings */}
      <motion.span
        className="absolute inset-0  border-2 rounded-xl border-[#b5b4b4]"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.8, 0, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
      <motion.span
        className="absolute inset-0  border-2 rounded-xl border-[#b5b4b4]"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.8, 0, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
          delay: 0.5,
        }}
      />
    </motion.button>
  );

  return (
    <>
      <PulsingButton />

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full h-full max-w-[80%] max-h-[80%] bg-white rounded-xl shadow-xl p-6 m-4"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  setCurrentStep(0);
                  stopModal();
                }}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              <div className="flex flex-col justify-between h-full px-4">
                {/* Step Content */}
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-6">
                    {steps[currentStep].icon}
                    <h3 className="text-xl font-bold text-gray-900">
                      {steps[currentStep].title}
                    </h3>
                  </div>
                  <p className="text-sm px-6 font-semibold text-gray-600">
                    {steps[currentStep].description}
                  </p>

                  {steps[currentStep].lists && (
                    <ol className="list-disc ml-6 space-y-2 mt-6 text-sm px-6 font-semibold text-gray-600">
                      {steps[currentStep].lists.map((item, index) => (
                        <li key={index} className="pl-2">
                          {item}
                        </li>
                      ))}
                    </ol>
                  )}

                  {steps[currentStep].cta && (
                    <div className="mt-7 ml-7">
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#B71C1C] text-white rounded-lg hover:bg-[#B71C1C]/90 transition-colors"
                      >
                        <Building2 className="w-4 h-4" />
                        <span>Create Business</span>
                      </button>
                    </div>
                  )}

                  {steps[currentStep].funding && (
                    <div className="mt-7 ml-7">
                      <button className="flex items-center gap-2 px-4 py-2 bg-[#B71C1C] text-white rounded-lg hover:bg-[#B71C1C]/90 transition-colors">
                        <Building2 className="w-4 h-4" />
                        <span>Go to Wallet</span>
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  {/* Progress Indicators */}
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-2">
                      {steps.map((_, index) => (
                        <motion.div
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            index === currentStep
                              ? "bg-[#B71C1C]"
                              : "bg-gray-200"
                          }`}
                          animate={
                            index === currentStep ? { scale: [1, 1.2, 1] } : {}
                          }
                          transition={{ duration: 0.5 }}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      Step {currentStep + 1} of {steps.length}
                    </span>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between">
                    <button
                      onClick={() =>
                        currentStep > 0 && setCurrentStep(currentStep - 1)
                      }
                      className={`px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors ${
                        currentStep === 0 ? "invisible" : ""
                      }`}
                    >
                      Back
                    </button>
                    <button
                      onClick={() => {
                        if (currentStep < steps.length - 1) {
                          setCurrentStep(currentStep + 1);
                        } else {
                          setIsOpen(false);
                          setCurrentStep(0);
                          stopModal();
                          // Add navigation to campaign creation or other action

                          router.push("/create_campaign");
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-[#B71C1C] text-white rounded-lg hover:bg-[#B71C1C]/90 transition-colors"
                    >
                      {currentStep === steps.length - 1
                        ? "Create Campaign"
                        : "Next"}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {isModalOpen && (
          <BusinessModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default QuickStartButton;
