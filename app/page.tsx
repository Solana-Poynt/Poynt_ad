"use client";
import React from "react";
import {
  ArrowRight,
  ChartBar,
  Rocket,
  Users,
  Plus,
  Library,
  Target,
  BarChart,
} from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";
import { getDataFromLocalStorage } from "@/utils/localStorage";

export default function Home() {
  const features = [
    {
      icon: <ChartBar className=" w-5 h-5 lg:w-8 lg:h-8 text-[#B71C1C]" />,
      title: "Real-time Engagement",
      description:
        "Our mission is to help you build brand visibility and drive results through smart ad placement and real-time engagement",
    },
    {
      icon: <Users className="w-5 h-5 lg:w-8 lg:h-8 text-[#B71C1C]" />,
      title: "Poynt for Everyone",
      description:
        "Whether you're a small startup or a growing enterprise, we make advertising simple, effective, and scalable.",
    },
    {
      icon: <Rocket className="w-5 h-5 lg:w-8 lg:h-8 text-[#B71C1C]" />,
      title: "Reach your Full Potential",
      description:
        "Maximize campaign effectiveness with our ROI-focused advertising model",
    },
  ];

  const statsData = [
    { label: "Active Users", value: "Bigger" },
    { label: "Global Reach", value: "Unlimited" },
    { label: "Ad Campaigns", value: "Effective" },
    { label: "Powered by", value: "Solana" },
  ];

  const services = [
    {
      icon: <Plus className="w-5 h-5 lg:w-8 lg:h-8" />,
      title: "Ad Campaign Creation",
      description:
        "Create and launch ad campaigns in minutes. Customize your ads, target specific audiences, and watch your business grow.",
    },
    {
      icon: <Library className="w-5 h-5 lg:w-8 lg:h-8" />,
      title: "Ad Library Management",
      description:
        "Our extensive ad library ensures your ads reach the right people at the right time, keeping your message relevant and engaging.",
    },
    {
      icon: <Target className="w-5 h-5 lg:w-8 lg:h-8" />,
      title: "Audience Targeting",
      description:
        "Advanced targeting algorithms ensure your ads reach users most likely to engage with your content.",
    },
    {
      icon: <BarChart className="w-7 h-7" />,
      title: "Real-Time Analytics",
      description:
        "Monitor performance with our intuitive dashboard. Track clicks, impressions, and conversions in real-time.",
    },
  ];
  const name = getDataFromLocalStorage("name");

  return (
    <div className="bg-white justify-center w-full">
      <Header />

      {/* Hero Section */}
      <div className="relative">
        <div className="container mx-auto px-4 pt-24 pb-16 lg:pt-28 relative">
          {/* Refined blob positions and colors */}
          <div className="absolute lg:top-[30%] left-1/4 w-24 h-24 lg:w-60 lg:h-60 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl  opacity-70 animate-blob" />
          <div className="absolute lg:top-[30%] right-1/4 w-24 h-24 lg:w-60 lg:h-60 bg-yellow-200/40 rounded-full mix-blend-multiply filter blur-xl  opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute lg:bottom-[60%] left-1/2 w-24 h-24 lg:w-60 lg:h-60 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl  opacity-70 animate-blob animation-delay-4000" />
          {/* Main Heading */}
          <h1 className="mx-auto max-w-4xl font-display text-2xl md:text-5xl lg:text-7xl font-medium tracking-tight text-slate-900 text-center">
            The Value{" "}
            <span className="relative whitespace-nowrap text-[#B71C1C]">
              <svg
                aria-hidden="true"
                viewBox="0 0 418 42"
                className="absolute left-0 top-2/3 h-[0.58em] w-full fill-[#B71C1C]"
                preserveAspectRatio="none"
              >
                <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
              </svg>
              <span className="relative">Ad Platform</span>
            </span>{" "}
            for Modern Business
          </h1>

          {/* Subheading */}
          <p className="mx-auto mt-4 lg:mt-8 w-[97%] lg:max-w-3xl text-xs lg:text-lg text-slate-700 text-center">
            Engage viewers who are eager to interact with your ads and gain
            value in return. Reach your audience at the ideal moment, offering
            them real value and providing you with verified engagement — simple,
            effective, and transparent.
          </p>

          {/* CTA Buttons */}
          <div className=" mt-8 lg:mt-14 flex justify-center relative gap-x-6">
            <a
              href="/auth"
              className="rounded-lg bg-[#B71C1C] p-2  lg:px-8 lg:py-4 text-white hover:bg-[#D32F2F] transition-colors flex items-center gap-2"
            >
              <span className="text-xs lg:text-base font-semibold">
                Start Free Trial
              </span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              disabled
              className="rounded-lg border border-slate-200 p-2 lg:px-8 lg:py-4 text-xs lg:text-base font-semibold text-slate-400 bg-slate-50 cursor-not-allowed opacity-60"
            >
              Watch Demo
            </button>
          </div>

          {/* Quick Stats */}
          <div className=" mt-20 lg:mt-36 grid grid-cols-4 sm:grid-cols-3 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {statsData.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-xs lg:text-4xl font-bold text-blue-600">
                  {stat.value}
                </div>
                <div className="mt-2 text-xs lg:text-sm text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section with 3D Cards */}
      <div className="relative py-24 w-full bg-[#FDF6E6]">
        <div className="container  mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to build brand visibility
            </h2>
          </div>

          <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-[90%] lg:max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-4 lg:p-8 bg-[#fefbf5] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#e4ddcf] to-[#fefbf5] opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
                <div className="relative">
                  <div className="mb-2 lg:mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-sm lg:text-lg font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-xs lg:text-base text-gray-600 text-left">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid with Hover Effects */}
      <div className="py-24 bg-white">
        <div className="container mx-auto w-full px-4">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              We take the burden of Publicity off you
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-[93%] lg:max-w-7xl mx-auto">
            {services.map((service, index) => (
              <div
                key={index}
                className="group p-4 lg:p-8 bg-[#FDF6E6] rounded-2xl transition-all duration-300 hover:bg-[#B71C1C]"
              >
                <div className=" mb-2 lg:mb-6 text-[#B71C1C] group-hover:text-white transition-colors">
                  {service.icon}
                </div>
                <h3 className=" text-sm lg:text-xl font-semibold text-gray-900 mb-4 group-hover:text-white transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs lg:text-base text-gray-600 group-hover:text-blue-100 transition-colors">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section with Gradient */}
      <div className="bg-gradient-to-r from-[#B71C1C] to-blue-700 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
              Ready to grow your business?
            </h2>
            <p className="mt-6 text-sm lg:text-lg leading-8 text-blue-100">
              Start your journey with Poynt today and see the difference.
            </p>
            <div className="mt-5 lg:mt-10">
              <a
                href="/auth"
                className="inline-block rounded-lg bg-white py-3 px-5  lg:px-8 lg:py-4 text-base font-semibold text-blue-600 shadow-lg hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Modern Design */}
      <Footer />
    </div>
  );
}
