import React from "react";
import HeroSection from "./_components/HeroSection";

const page = () => {
  return (
    <div>
      <HeroSection />
      <section className="md:py-14 md:px-[120px]">
        <div className="max-w-4xl privacy-policy">
          <p className="privacy-policy-intro mb-4 md:w-4/5">
            This Privacy Policy describes how MatrimonyServices.org ("we," "us,"
            or "our") collects, uses, and discloses your information when you
            use our website (the "Service") and the choices you have associated
            with that data.
          </p>
          <h2 className="mb-4 BRCobane24400">Information We Collect</h2>
          <p>
            We collect several different types of information for various
            purposes to improve our Service to you.
          </p>
          <ul className="list-disc pl-6 mb-8">
            <li>Personal Data:</li>
            <ul className="list-disc pl-6">
              <li>
                When you create an account, we collect information such as your
                name, email address, phone number (optional), gender, and date
                of birth.
              </li>
              <li>
                We may also collect demographic information (e.g., location) and
                profile information (e.g., interests, hobbies) that you
                voluntarily provide.
              </li>
              <li>
                In some instances, you may choose to link your social media
                accounts to your profile, and we may collect information from
                those accounts in accordance with their privacy policies.
              </li>
            </ul>
            <li>Usage Data:</li>
            <ul className="list-disc pl-6">
              <li>
                We collect information about your activity on the Service, such
                as the pages you visit, the searches you perform, and the
                features you use.
              </li>
              <li>
                We may also collect information about your device and its
                connection, such as your IP address, browser type, operating
                system, and referral URL.
              </li>
            </ul>
          </ul>

          <h2 className="mb-4 dmserif24400">How We Use Your Information</h2>
          <p>
            We use the information we collect for various purposes, including:
          </p>
          <ul className="list-disc pl-6 mb-8">
            <li>To provide and maintain the Service</li>
            <li>To create and manage your account</li>
            <li>To process your online transactions (if applicable)</li>
            <li>To personalize your experience on the Service</li>
            <li>
              To send you marketing and promotional communications (with your
              consent)
            </li>
            <li>To analyze the use of our Service and improve our offerings</li>
            <li>To comply with legal and regulatory obligations</li>
          </ul>

          <h2 className="mb-4 dmserif24400">Sharing Your Information</h2>
          <p>
            We may share your information with our partners who help us operate
            and maintain the Service. These service providers are obligated to
            use your information only to perform the services they are
            contracted to provide and are bound by strict confidentiality
            agreements.
          </p>
          <p>
            We may also disclose your information if we believe it is necessary
            to:
          </p>
          <ul className="list-disc pl-6 mb-8">
            <li>Comply with a law, regulation, or legal process</li>
            <li>Protect the safety or security of you or others</li>
            <li>Prevent fraud or other harmful activities</li>
            <li>enforce our Terms of Service</li>
          </ul>

          <h2 className="mb-4 dmserif24400">Your Choices</h2>
          <p>You have several choices regarding your information:</p>
          <ul className="list-disc pl-6 mb-8">
            <li>
              You can access and update your profile information at any time.
            </li>
            <li>
              You can unsubscribe from marketing and promotional communications
              by following the instructions in those emails.
            </li>
            <li>You can choose to delete your account by contacting us.</li>
          </ul>

          <h2 className="mb-4 dmserif24400">Data Retention</h2>
          <p className="mb-8">
            We will retain your information for as long as your account is
            active or as needed to provide you with the Service. We will also
            retain and use your information to the extent necessary to comply
            with our legal obligations, resolve disputes, and enforce our
            agreements.
          </p>

          <h2 className="mb-4 dmserif24400">Security</h2>
          <p className="mb-8">
            We take reasonable steps to protect your information from
            unauthorized access, disclosure, alteration, or destruction.
            However, no internet transmission or electronic storage method is
            100% secure. Therefore, we cannot guarantee absolute security.
          </p>

          <h2 className="mb-4 dmserif24400">International Transfers</h2>
          <p className="mb-8">
            Your information may be transferred to and processed in countries
            other than your own. These countries may have different data
            protection laws than your own. By using our Service, you consent to
            the transfer of your information to these countries.
          </p>

          <h2 className="mb-4 dmserif24400">California Privacy Rights</h2>
          <p>
            If you are a California resident, you have certain rights under the
            California Consumer Privacy Act ("CCPA"). You have the right to:
          </p>
          <ul className="list-disc pl-6 my-2">
            <li>
              Know what categories of personal information we collect and use.
            </li>
            <li>
              Request access to the specific personal information we have
              collected about you.
            </li>
            <li>Request deletion of your personal information.</li>
            <li>
              Opt-out of the sale of your personal information (we do not
              currently sell your personal information).{" "}
            </li>
          </ul>
          <p className="mb-8">
            You can exercise these rights by contacting us.
          </p>

          <h2 className="mb-4 dmserif24400">Changes to This Privacy Policy</h2>
          <p className="mb-8">
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page.
          </p>

          <h2 className="mb-4 dmserif24400">Contact Us</h2>
          <p className="mb-8">
            If you have any questions about this Privacy Policy, please contact
            us by email at [insert email address] or by mail at:
            <br />
            MatrimonyServices.org [Your Address]
          </p>

          <h2 className="mb-4 dmserif24400">Disclaimer</h2>
          <p className="mb-8">
            This Privacy Policy is intended to provide information about our
            practices regarding the collection, use, and disclosure of
            information that we collect through the Service. This Privacy Policy
            does not apply to information collected from you by third-party
            websites or applications. We encourage you to review the privacy
            policies of any third-party websites.
          </p>
        </div>
      </section>
    </div>
  );
};

export default page;
