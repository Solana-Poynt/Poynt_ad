import React from "react";

const Privacy = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 bg-white">
      <h1 className="text-3xl font-bold mb-8 text-center text-[#B71C1C]">
        Poynt Privacy Policy
      </h1>

      <p className="text-center mb-8 text-gray-500">
        Last Updated: May 1, 2025
      </p>

      <div className="space-y-8">
        {/* Introduction */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-[#B71C1C] border-b pb-2">
            Introduction
          </h2>
          <p className="mb-3 text-gray-700">
            Welcome to Poynt. We're committed to building a reformed attention
            economy by creating value for both brands and users. This Privacy
            Policy explains how we collect, use, disclose, and safeguard
            information for both our users (viewers who engage with content and
            earn Poynts) and our business partners (advertisers who create
            campaigns on our platform).
          </p>
          <p className="text-gray-700">
            By accessing or using our Service, whether as a user earning Poynts
            or as a business running advertising campaigns, you agree to this
            Privacy Policy. If you do not agree with these terms, please do not
            access or use our Service.
          </p>
        </div>

        {/* Information We Collect */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-[#B71C1C] border-b pb-2">
            Information We Collect
          </h2>

          <div className="mb-5">
            <h3 className="font-medium mb-2 text-gray-800">From Users</h3>
            <p className="mb-2 text-gray-700">
              We may collect personal information that you voluntarily provide
              when you register, complete your profile, participate in
              campaigns, contact support, or subscribe to our newsletters. This
              includes: full name, email address, phone number, date of birth,
              profile pictures, demographic information, and personal
              preferences.
            </p>
            <p className="text-gray-700">
              We also automatically collect device information, IP address,
              browser type, time spent on campaigns, interaction metrics, Poynts
              earned and redeemed, geolocation data (with permission), and usage
              patterns.
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-2 text-gray-800">
              From Business Partners
            </h3>
            <p className="text-gray-700">
              For businesses using our platform, we collect company information,
              contact details, billing information, campaign details, creative
              assets, targeting preferences, performance metrics, account
              activity, and communication preferences. We also collect business
              payment information to facilitate transactions, though we don't
              store complete credit card information on our servers.
            </p>
          </div>
        </div>

        {/* How We Use Information */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-[#B71C1C] border-b pb-2">
            How We Use Information
          </h2>

          <div className="mb-4">
            <h3 className="font-medium mb-2 text-gray-800">User Information</h3>
            <p className="text-gray-700">
              We use user information to create accounts, match with relevant
              campaigns, track and reward participation, improve our Service,
              communicate updates, detect fraud, and comply with legal
              obligations. We may also use anonymized data to enhance our
              matching algorithms and platform performance.
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-2 text-gray-800">
              Business Partner Information
            </h3>
            <p className="text-gray-700">
              We use business information to create and manage advertiser
              accounts, process payments, deliver campaigns to relevant users,
              provide performance analytics, optimize campaign effectiveness,
              offer support services, communicate about platform updates, and
              comply with legal obligations.
            </p>
          </div>
        </div>

        {/* Information Sharing */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-[#B71C1C] border-b pb-2">
            Information Sharing
          </h2>

          <div className="mb-4">
            <h3 className="font-medium mb-2 text-gray-800">
              Sharing User Data
            </h3>
            <p className="text-gray-700">
              We share aggregated, anonymized engagement data with our business
              partners to demonstrate campaign performance and ROI. Individual
              users are never personally identified to advertisers. We may also
              share information with service providers who help operate our
              platform.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="font-medium mb-2 text-gray-800">
              Sharing Business Partner Data
            </h3>
            <p className="text-gray-700">
              We do not share our business partners' proprietary campaign
              strategies or creative content with competitors. We may share
              anonymized, aggregated campaign performance benchmarks across the
              platform to improve overall service quality.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="font-medium mb-2 text-gray-800">
              Legal Requirements
            </h3>
            <p className="text-gray-700">
              We may disclose information if required by law or in response to
              valid requests by public authorities.
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-2 text-gray-800">
              Business Transfers
            </h3>
            <p className="text-gray-700">
              If we are involved in a merger, acquisition, or sale of assets,
              your information may be transferred. We will notify all parties of
              any change in ownership.
            </p>
          </div>
        </div>

        {/* Data Security */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-[#B71C1C] border-b pb-2">
            Data Security
          </h2>
          <p className="text-gray-700">
            We implement appropriate technical and organizational measures to
            protect all personal and business information. These include
            encryption, access controls, regular security assessments, and
            employee training. However, no method of transmission over the
            internet or electronic storage is 100% secure.
          </p>
        </div>

        {/* Your Privacy Rights */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-[#B71C1C] border-b pb-2">
            Your Privacy Rights
          </h2>
          <p className="mb-3 text-gray-700">
            Both users and business partners have rights regarding their
            information, including: access to data we've collected, correction
            of inaccurate data, deletion of data (where legally permissible),
            restriction of processing, data portability, objection to
            processing, and withdrawal of consent.
          </p>
          <p className="text-gray-700">
            To exercise these rights, contact us at{" "}
            <span className="text-[#B71C1C]">poynt@poyntad.com</span>.
          </p>
        </div>

        {/* Cookies */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-[#B71C1C] border-b pb-2">
            Cookies and Tracking
          </h2>
          <p className="text-gray-700">
            We use cookies and similar tracking technologies to enhance user
            experience, analyze platform usage, and measure campaign
            performance. Users and business partners can manage cookie
            preferences through browser settings, though this may limit
            functionality.
          </p>
        </div>

        {/* Retention */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-[#B71C1C] border-b pb-2">
            Data Retention
          </h2>
          <p className="text-gray-700">
            We retain user and business partner information for as long as
            necessary to fulfill the purposes outlined in this Privacy Policy,
            unless a longer retention period is required by law. Account
            information is retained until accounts are deleted, while anonymized
            analytics data may be kept indefinitely for platform improvement.
          </p>
        </div>

        {/* Children's Privacy */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-[#B71C1C] border-b pb-2">
            Children's Privacy
          </h2>
          <p className="text-gray-700">
            Our Service is not directed to individuals under 16. We do not
            knowingly collect personal information from children under 16.
            Business partners must certify that their campaigns comply with all
            applicable children's privacy regulations.
          </p>
        </div>

        {/* International Data */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-[#B71C1C] border-b pb-2">
            International Data Transfers
          </h2>
          <p className="text-gray-700">
            Information may be transferred to and processed in countries with
            different data protection laws. We implement appropriate safeguards
            for international transfers in accordance with applicable law.
          </p>
        </div>

        {/* Changes */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-[#B71C1C] border-b pb-2">
            Policy Updates
          </h2>
          <p className="text-gray-700">
            We may update our Privacy Policy periodically to reflect changes in
            our practices or legal requirements. We will notify all users and
            business partners of significant changes via email and/or platform
            notifications.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-[#B71C1C] border-b pb-2">
            Contact Us
          </h2>
          <p className="mb-4 text-gray-700">
            If you have questions about this Privacy Policy or our data
            practices, please contact our Privacy Team:
          </p>
          <div className="bg-gray-50 p-5 rounded-lg text-center">
            <p className="font-semibold text-gray-800">Poynt, Inc.</p>
            <p className="text-[#B71C1C] font-medium">poynt@poyntad.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
