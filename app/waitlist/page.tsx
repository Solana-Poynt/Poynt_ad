"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/waitlistheader";
import Footer from "@/components/footer";
import {
  ArrowRight,
  Check,
  Mail,
  Diamond,
  CheckIcon,
  Target,
} from "lucide-react";

const WaitlistPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Basic email validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setIsSubmitting(true);

    // Simulate API call
    try {
      // In a real app, you would make an API call here to save the email
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full md:min-h-screen px-3 md:px-0 w-full bg-gradient-to-b from-gray-50 to-white flex flex-col">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <main className="flex-grow flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-24 w-full">
          <div className="grid md:grid-cols-2 gap-8 pt-12 md:pt-0 lg:gap-28  items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-side text-white text-xs md:text-sm font-medium px-4 py-1 rounded-full inline-block mb-6">
                Coming Soon
              </div>
              <h1 className="text-xl  lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
                We Deliver Actions, Not Just Attention
              </h1>
              <p className="text-sm lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-lg font-normal">
                Watch Ads, complete interactive tasks, earn Poynt, and drive
                real conversions. Join the waitlist and be the first to
                experience it.
              </p>

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className={`block w-full pl-10 pr-3 py-3 border ${
                          error ? "border-red-300" : "border-gray-300"
                        } rounded-lg focus:ring-2`}
                      />
                    </div>
                    {error && (
                      <p className="mt-2 text-sm text-red-600">{error}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-side hover:bg-side/60 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Get Early Access <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-100 rounded-lg p-6 max-w-md"
                >
                  <div className="flex items-center">
                    <div className="bg-green-100 rounded-full p-2 mr-4">
                      <Check className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-sm md:text-lg font-semibold text-gray-900">
                        You're in!
                      </h3>
                      <p className="text-gray-600">
                        Check your inbox for your exclusive download link to try
                        the Poynt beta.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden md:block"
            >
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-48 sm:w-64 h-48 sm:h-64 bg-red-100 rounded-full opacity-50 filter blur-3xl"></div>
                <div className="absolute -bottom-8 -right-8 w-48 sm:w-64 h-48 sm:h-64 bg-blue-100 rounded-full opacity-50 filter blur-3xl"></div>

                {/* Phone mockup */}
                <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[500px] sm:h-[600px] w-[250px] sm:w-[300px] shadow-xl">
                  <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
                  <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
                  <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
                  <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
                  <div className="rounded-[2rem] overflow-hidden w-[222px] sm:w-[272px] h-[472px] sm:h-[572px] bg-white">
                    {/* App Screen Content */}
                    <div className="w-full h-full bg-gradient-to-b from-red-50 to-white flex flex-col">
                      {/* App Header */}
                      <div className="h-12 bg-side flex items-center justify-between px-4">
                        <div className="text-white font-bold text-lg">
                          Poynt
                        </div>
                        <div className="h-8 w-8 rounded-full bg-white/20"></div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-4 space-y-4 overflow-hidden">
                        {/* Ad Card */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                          <div className="h-48 bg-gray-200 flex items-center justify-center">
                            <div className="text-2xl">📱</div>
                          </div>
                          <div className="p-4">
                            <div className="text-sm font-bold">Brand Name</div>
                            <div className="text-xs text-gray-500 mt-1">
                              Sponsored
                            </div>
                            <div className="mt-3 py-2 px-3 bg-side/10 rounded-lg flex items-center justify-between">
                              <span className="text-xs font-medium">
                                Complete task to earn 50 Poynts
                              </span>
                              <ArrowRight className="h-3 w-3" />
                            </div>
                          </div>
                        </div>

                        {/* Points Display */}
                        <div className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center">
                          <div>
                            <div className="text-xs text-gray-500">
                              Your Balance
                            </div>
                            <div className="text-xl font-bold">150 Poynts</div>
                          </div>
                          <div className="h-8 w-20 bg-side rounded-md flex items-center justify-center text-white text-xs font-medium">
                            Redeem
                          </div>
                        </div>

                        {/* Another Ad */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                          <div className="h-48 bg-gray-200 flex items-center justify-center">
                            <div className="text-2xl">🛍️</div>
                          </div>
                          <div className="p-4">
                            <div className="text-sm font-bold">
                              Another Brand
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Sponsored
                            </div>
                            <div className="mt-3 py-2 px-3 bg-side/10 rounded-lg flex items-center justify-between">
                              <span className="text-xs font-medium">
                                Watch to earn 25 Poynts
                              </span>
                              <ArrowRight className="h-3 w-3" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <div id="features" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-70"></div>
        <div className="absolute right-0 top-0 w-1/3 h-full bg-red-50 opacity-20 rounded-l-full transform translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="text-center mb-16">
            <h2 className="text-xl  lg:text-5xl font-bold text-gray-900 mb-4">
              A New Era of <span className="text-red-600">Advertising</span>
            </h2>

            <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              Interactive ads that deliver measurable actions and real value for
              everyone involved.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: "Interactive Tasks",
                description:
                  "Users engage with ads by completing specific tasks, guaranteeing meaningful interaction.",
                icon: <Target className="w-4 sm:w-7 h-4 sm:h-7" />,
              },
              {
                title: "Reward System",
                description:
                  "Users earn Poynts for engagement that can be redeemed for real value, creating a win-win ecosystem.",
                icon: <Diamond className="w-4 sm:w-7 h-4 sm:h-7" />,
              },
              {
                title: "Verified Actions",
                description:
                  "Businesses pay for actual engagement, not just impressions, maximizing your ad spend ROI.",
                icon: <CheckIcon className="w-4 sm:w-7 h-4 sm:h-7" />,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="w-9 md:w-14 h-9 md:h-14 bg-red-50 rounded-2xl flex items-center justify-center text-xl md:text-3xl mb-6 group-hover:bg-red-100 transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-base lg:text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 font-medium text-sm lg:text-base">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div
        id="faq"
        className="pt-16  md:h-[450px] bg-gradient-to-r from-[#B71C1C] to-blue-700 relative overflow-hidden"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-16 md:mb-0 text-center relative">
          <div className="bg-white/10 backdrop-blur-sm p-6 md:p-12 rounded-3xl border border-white/20 shadow-2xl">
            <h2 className="text-base  lg:text-4xl md:text-5xl font-bold mb-6 ">
              Be Among the First to Experience Poynt
            </h2>
            <p className="text-sm font-medium sm:text-xl mb-8 text-white/90">
              Join our waitlist today and transform how you interact with
              advertising forever.
            </p>
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-flex items-center bg-white text-red-600 px-8 py-4 rounded-full font-medium hover:bg-red-50 transition-colors shadow-lg hover:shadow-xl text-sm md:text-base"
            >
              Get Early Access <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default WaitlistPage;
