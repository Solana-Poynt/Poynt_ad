"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Target,
  AlignLeft,
  DollarSign,
  Rocket,
  Building2,
} from "lucide-react";
import BusinessModal from "./BusinessModal";

interface Step {
  title: string;
  description: string;
  icon: JSX.Element;
  lists?: string[];
  cta?: boolean;
  funding?: boolean;
}

interface QuickStartProps {
  showBusinessModal: boolean;
  setShowBusinessModal: (open: boolean) => void;
}

const QuickStartButton = ({
  showBusinessModal,
  setShowBusinessModal,
}: QuickStartProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showBusinessForm, setShowBusinessForm] = useState(false);
  // const router = useRouter();

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
      title: "Setup a Business Account",
      description:
        "Easily manage advertising campaigns for multiple businesses through dedicated business accounts, all from your account",
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
        "Review settings and launch your campaign to start reaching your audience. To get started, proceed with creating a business account first",
      icon: <Rocket className="w-6 h-6 text-[#B71C1C]" />,
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowBusinessForm(true);
      setShowBusinessModal(false);
    }
  };

  // const handleFundWallet = () => {
  //   router.push("/business/wallet");
  // };

  return (
    <AnimatePresence>
      {showBusinessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full h-full max-w-[80%] max-h-[80%] bg-white rounded-xl shadow-xl p-6 m-4 overflow-auto"
          >
            <div className="flex flex-col justify-between h-full px-4">
              {/* Step Content */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-6">
                  {steps[currentStep].icon}
                  <h3 className="text-lg md:text-xl font-bold text-gray-900">
                    {steps[currentStep].title}
                  </h3>
                </div>
                <p className="text-xs md:text-sm px-6 font-semibold text-gray-600">
                  {steps[currentStep].description}
                </p>

                {steps[currentStep].lists && (
                  <ul className="list-disc ml-6 space-y-2 mt-6 text-xs md:text-sm px-6 font-semibold text-gray-600">
                    {steps[currentStep].lists.map((item, index) => (
                      <li key={index} className="pl-2">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {/* {steps[currentStep].funding && (
                  <div className="mt-7 ml-7">
                    <button
                      onClick={handleFundWallet}
                      className="flex items-center gap-2 px-4 py-2 bg-[#B71C1C] text-white rounded-lg hover:bg-[#B71C1C]/90 transition-colors"
                    >
                      <Building2 className="w-4 h-4" />
                      <span>Go to Wallet</span>
                    </button>
                  </div>
                )} */}
              </div>

              <div>
                {/* Progress Indicators */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-2">
                    {steps.map((_, index) => (
                      <motion.div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === currentStep ? "bg-[#B71C1C]" : "bg-gray-200"
                        }`}
                        animate={
                          index === currentStep ? { scale: [1, 1.2, 1] } : {}
                        }
                        transition={{ duration: 0.5 }}
                      />
                    ))}
                  </div>
                  <span className="text-xs md:text-sm text-gray-500">
                    Step {currentStep + 1} of {steps.length}
                  </span>
                </div>

                {/* Navigation */}
                <div className="flex justify-between mb-4">
                  <button
                    onClick={() =>
                      currentStep > 0 && setCurrentStep(currentStep - 1)
                    }
                    className={`px-4 py-2 text-xs md:text-sm text-gray-600 rounded-lg hover:bg-gray-100 transition-colors ${
                      currentStep === 0 ? "invisible" : ""
                    }`}
                  >
                    Back
                  </button>
                  {/* {steps[currentStep].cta && (
                  <div className="mt-7 ml-7">
                    <button
                      onClick={handleShowBusinessForm}
                      className="flex items-center gap-2 px-4 py-2 bg-[#B71C1C] text-white rounded-lg hover:bg-[#B71C1C]/90 transition-colors"
                    >
                      <Building2 className="w-4 h-4" />
                      <span></span>
                    </button>
                  </div>
                )} */}
                  <button
                    onClick={handleNext}
                    className="flex items-center text-xs md:text-sm gap-2 px-4 py-2 bg-[#B71C1C] text-white rounded-lg hover:bg-[#B71C1C]/90 transition-colors"
                  >
                    {currentStep === steps.length - 1
                      ? "Create Business"
                      : "Next"}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {showBusinessForm && (
        <BusinessModal
          isOpen={showBusinessForm}
          onClose={() => setShowBusinessForm(false)}
        />
      )}
    </AnimatePresence>
  );
};

export default QuickStartButton;
