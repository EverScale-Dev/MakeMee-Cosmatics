import { useEffect } from "react";
import gsap from "gsap";
import UnderlineInput from "../components/UnderlineInput";

const Contact = () => {
  useEffect(() => {
    gsap.fromTo(
      ".animate",
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
      }
    );
  }, []);

  return (
    <section className="min-h-screen bg-[#FFF1F7] px-8 pt-24 pb-16">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        
        {/* LEFT CONTENT — BOTTOM ALIGNED */}
        <div className="animate flex flex-col justify-end">
          <h1 className="text-4xl font-bold text-black mb-4">
            Contact Us
          </h1>

          <p className="text-black max-w-md mb-6">
            Email, call, or complete the form to learn how we can help
            solve your messaging problems.
          </p>

          <p className="text-black font-medium">info@example.com</p>
          <p className="text-black font-medium mb-10">
            +91 98765 43210
          </p>

          <div className="grid grid-cols-3 gap-6 text-sm">
            <div>
              <p className="font-semibold text-black mb-1">
                Customer Support
              </p>
              <p className="text-black">
                Our team is available 24/7
              </p>
            </div>

            <div>
              <p className="font-semibold text-black mb-1">
                Feedback
              </p>
              <p className="text-black">
                We value your suggestions
              </p>
            </div>

            <div>
              <p className="font-semibold text-black mb-1">
                Media
              </p>
              <p className="text-black">
                For press inquiries
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="animate bg-white rounded-2xl shadow-xl p-10">
          <h2 className="text-2xl font-semibold text-black mb-1">
            Get in Touch
          </h2>
          <p className="text-black text-sm mb-8">
            You can reach us anytime
          </p>

          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <UnderlineInput placeholder="First name" />
              <UnderlineInput placeholder="Last name" />
            </div>

            <UnderlineInput placeholder="Your email" />
            <UnderlineInput placeholder="Phone number" />

            <textarea
              placeholder="How can we help?"
              rows="3"
              className="
                w-full bg-transparent
                border-b border-black/30
                focus:outline-none
                focus:border-[#FC6CB4]
                hover:border-[#731162]
                transition-all duration-300
                placeholder-black/50 py-2 resize-none
              "
            />

            <button
              className="
                w-full bg-[#FC6CB4] text-black py-3 rounded-full
                hover:bg-[#F0A400]
                transition-all duration-300
              "
            >
              Submit
            </button>

            <p className="text-xs text-center text-black">
              By contacting us, you agree to our{" "}
              <span className="font-medium">Terms</span> and{" "}
              <span className="font-medium">Privacy Policy</span>
            </p>
          </form>
        </div>

      </div>
    </section>
  );
};

export default Contact;
