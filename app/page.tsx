import Image from "next/image";
import Header from "../components/header";
import Footer from "../components/footer";
import { Icon } from "@iconify/react";

export default function Home() {
  return (
    <>
      <Header />

      <div className="w-full h-fit px-8 py-4 md:px-20 md:py-5 mt-20">
        <div className="relative z-10 bg-[url('/hero.jpg')] bg-no-repeat bg-cover bg-center flex justify-start items-center rounded-lg md:rounded-3xl w-full h-svh px-2 py-4 md:px-5 md:py-5">
          <div className="absolute -z-10 inset-0 bg-gradient-to-l from-secondary to-warmwhite opacity-90 rounded-lg md:rounded-3xl"></div>

          <div className="w-full flex flex-col gap-5 lg:w-3/5">
            <h1 className="w-full font-poppins font-semibold text-3xl md:text-6xl text-blacc">
              Reach Your Audience, Amplify Your Brand
            </h1>
            <p className="w-full font-poppins font-normal text-base text-blacc">
              Expand your business reach with our powerful ad platform. Create,
              manage, and serve your ads to a broader audience, driving growth
              and engagement.
            </p>
            <div className="w-full flex flex-col md:flex-row items-center justify-start gap-3">
              <a
                href="/auth"
                className="w-full md:w-2/5 h-11 md:h-16 flex items-center justify-center px-6 py-3 rounded-md border border-secondary font-poppins font-normal bg-secondary text-white text-sm md:text-base cursor-pointer hover:bg-blacc hover:border-blacc"
              >
                Start Your Campaign Now
              </a>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-10 mt-32">
          <h2 className="w-full md:w-4/6 lg:w-3/6 font-poppins font-semibold text-2xl md:text-4xl text-madeinblacc">
            Everything you need to build brand visibility and drive results
          </h2>
          <div className="flex flex-col md:flex-row gap-5 w-full justify-evenly items-start md:items-center">
            <div className="p-5 lg:p-10 flex flex-col justify-start items-start gap-4 border border-gray-300 rounded-md">
              <i className="bx bxs-analyse text-secondary text-[32px]"></i>
              <h4 className="w-full font-poppins font-semibold text-xs lg:text-base text-madeinblacc">
                Real-time Engagement
              </h4>
              <p className="w-full font-poppins font-normal text-xs lg:text-base text-madeinblacc">
                Our mission is to help you build brand visibility and drive
                results through smart ad placement and real-time engagement
              </p>
            </div>
            <div className="p-5 lg:p-10 flex flex-col justify-start items-start gap-4 border border-gray-300 rounded-md">
              <i className="bx bx-universal-access text-secondary text-[32px]"></i>
              <h4 className="w-full font-poppins font-semibold text-xs lg:text-base text-madeinblacc">
                Poynt for Everyone
              </h4>
              <p className="w-full font-poppins font-normal text-xs lg:text-base text-madeinblacc">
                Whether you're a small startup or a growing enterprise, we make
                advertising simple, effective, and scalable.
              </p>
            </div>
            <div className="p-5 lg:p-10 flex flex-col justify-start items-start gap-4 border border-gray-300 rounded-md">
              <i className="bx bx-rocket text-secondary text-[32px]"></i>
              <h4 className="w-full font-poppins font-semibold text-xs lg:text-base text-madeinblacc">
                Reach your Full Potential
              </h4>
              <p className="w-full font-poppins font-normal text-xs lg:text-base text-madeinblacc">
                We empower businesses to reach their full potential by
                connecting them with the right audience through strategic
                advertising.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-between items-center h-fit py-6 mt-32 bg-main gap-9">
          <div className="items-start justify-start gap-5 p-11">
            <h3 className="font-poppins font-medium text-xl md:text-[25px] text-blacc">
              Poynt, one-stop platform for businesses of all sizes to create
              impactful ad campaigns that resonate with their target audience
            </h3>
            <a
              href="/auth"
              className="w-fit md:w-2/5 h-11 md:h-16 flex items-center justify-center px-6 py-3 rounded-md border border-secondary font-poppins font-normal bg-secondary text-white text-sm md:text-base cursor-pointer mt-8"
            >
              Get Started
            </a>
          </div>
        </div>

        <div className="w-full flex flex-col gap-10 mt-32">
          <h2 className="w-full md:w-4/6 lg:w-3/6 font-poppins font-semibold text-2xl md:text-4xl text-madeinblacc">
            We take the burden of Publicity off you.
          </h2>
          <div className="flex flex-col md:flex-row gap-5 w-full justify-evenly items-start">
            <div className="p-5 lg:p-10 flex flex-col justify-start items-start gap-4 border border-gray-300 rounded-md">
              <i className="bx bx-plus text-secondary text-[30px]"></i>
              <h1 className="font-poppins font-medium text-xl text-madeinblacc">
                Ad Campaign Creation
              </h1>
              <p className="w-full font-poppins font-normal text-xs lg:text-base text-madeinblacc">
                We provide an easy-to-use platform where you can design and
                launch ad campaigns in minutes. Customize your ads, target
                specific audiences, and watch your business grow.
              </p>
            </div>
            <div className="p-5 lg:p-10 flex flex-col justify-start items-start gap-4 border border-gray-300 rounded-md">
              <i className="bx bx-library text-secondary text-[30px]"></i>
              <h1 className="font-poppins font-medium text-xl text-madeinblacc">
                Ad Library Management
              </h1>
              <p className="w-full font-poppins font-normal text-xs lg:text-base text-madeinblacc">
                Once your ad is created, we add it to our extensive ad library,
                ensuring it reaches the right people at the right time. Our
                library is constantly evolving, making sure your message stays
                relevant and engaging.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-5 w-full justify-evenly items-start">
            <div className="p-5 lg:p-10 flex flex-col justify-start items-start gap-4 border border-gray-300 rounded-md">
              <i className="bx bx-target-lock text-secondary text-[30px]"></i>
              <h1 className="font-poppins font-medium text-xl text-madeinblacc">
                Audience Targeting & Distribution
              </h1>
              <p className="w-full font-poppins font-normal text-xs lg:text-base text-madeinblacc">
                Your ads are served to a vast and diverse audience, helping you
                maximize your reach. We use advanced targeting algorithms to
                ensure your ads are shown to users most likely to engage with
                your content.
              </p>
            </div>
            <div className="p-5 lg:p-10 flex flex-col justify-start items-start gap-4 border border-gray-300 rounded-md">
              <i className="bx bx-analyse text-secondary text-[30px]"></i>
              <h1 className="font-poppins font-medium text-xl text-madeinblacc">
                Real-Time Analytics
              </h1>
              <p className="w-full font-poppins font-normal text-xs lg:text-base text-madeinblacc">
                Track the performance of your ads with our intuitive dashboard.
                Monitor clicks, impressions, and conversions to optimize your
                campaign and improve results.
              </p>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
