"use client";
import React, { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [popup, setPopup] = useState({ show: false, type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false); // 👉 new state

  const showPopup = (type, message) => {
    setPopup({ show: true, type, message });

    setTimeout(() => {
      setPopup({ show: false, type: "", message: "" });
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // 👉 start submitting

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const result = await res.json();

      if (res.ok) {
        showPopup("success", "Your message has been sent successfully!");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        showPopup("error", result?.message || "Failed to send message. Please try again.");
      }
    } catch (err) {
      showPopup("error", "Network error. Please try again.");
    }

    setIsSubmitting(false); // 👉 done submitting
  };

  return (
    <>
      {/* Popup Message */}
      <AnimatePresence>
        {popup.show && (
          <PopupMessage
            type={popup.type}
            message={popup.message}
            onClose={() => setPopup({ show: false })}
          />
        )}
      </AnimatePresence>

      <Header />
      <div className="relative min-h-screen bg-gray-50 flex items-center justify-center px-5 py-16">
        <motion.div
          className="relative bg-white p-8 md:p-12 rounded-xl shadow-lg max-w-6xl w-full grid md:grid-cols-2 gap-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Left Section: Contact Form */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaPaperPlane className="text-blue-900" /> Send us a Message
            </h3>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <InputField
                label="Full Name *"
                type="text"
                placeholder="Your full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                name="name"
              />

              <InputField
                label="Email Address *"
                type="email"
                placeholder="Your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                name="email"
              />

              <InputField
                label="Subject *"
                type="text"
                placeholder="What can we help you with?"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                name="subject"
              />

              <TextAreaField
                label="Message *"
                placeholder="Tell us more about your inquiry..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                name="message"
              />

              <motion.button
                type="submit"
                disabled={isSubmitting} // 👉 prevent double submit
                className={`w-full bg-blue-900 text-white py-3 rounded-lg font-medium hover:opacity-90 transition flex justify-center items-center gap-2 ${isSubmitting ? "cursor-not-allowed opacity-70" : "hover:bg-blue-800"}`}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.96 }}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Send Message"
                )}
              </motion.button>
            </form>
          </div>

          {/* Right Section: Info & Hours */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Contact Information</h3>
              <InfoItem Icon={FaEnvelope} title="Email" text="makemeecosmetics@gmail.com" sub="We respond within 24 hours" />
              <InfoItem Icon={FaPhone} title="Phone" text="+91 9075141925" sub="Mon-Fri: 9AM-6PM IST" />
              <InfoItem Icon={FaMapMarkerAlt} title="Address" text="A/P Derde Korhale, Tal. Kopargaon, Dist. Ahilyanagar, Maharashtra 423601" />
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Business Hours</h3>
              <BusinessHour day="Monday - Friday" time="9:00 AM - 6:00 PM" />
              <BusinessHour day="Saturday" time="10:00 AM - 4:00 PM" />
              <BusinessHour day="Sunday" time="Closed" />
              <p className="mt-4 text-sm text-gray-600 flex items-center gap-2">
                <FaClock className="text-blue-900" />
                We respond to all inquiries within 24 hours during business days.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

/* ------------------- Popup Component ------------------- */

const PopupMessage = ({ type, message, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-6 right-6 z-50 px-5 py-4 rounded-lg shadow-lg text-white flex items-center gap-3 
        ${type === "success" ? "bg-green-600" : "bg-red-600"}
      `}
    >
      <span className="text-lg">
        {type === "success" ? "✔️" : "⚠️"}
      </span>
      <p className="font-medium">{message}</p>

      <button
        className="ml-3 text-white text-xl hover:opacity-70"
        onClick={onClose}
      >
        ×
      </button>
    </motion.div>
  );
};

/* ------------------- Reusable Components ------------------- */

const InfoItem = ({ Icon, title, text, sub }) => (
  <div className="flex items-start space-x-3 mb-4">
    <div className="text-blue-900 text-xl mt-1">
      <Icon />
    </div>
    <div>
      <p className="font-semibold text-gray-800">{title}</p>
      <p className="text-gray-700">{text}</p>
      {sub && <p className="text-sm text-gray-500">{sub}</p>}
    </div>
  </div>
);

const BusinessHour = ({ day, time }) => (
  <div className="flex justify-between text-gray-700 mb-2">
    <span>{day}</span>
    <span className="font-medium">{time}</span>
  </div>
);

const InputField = ({ label, type, placeholder, value, onChange, name }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-1">{label}</label>
    <input
      name={name}
      type={type}
      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
    />
  </div>
);

const TextAreaField = ({ label, placeholder, value, onChange, name }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-1">{label}</label>
    <textarea
      name={name}
      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder={placeholder}
      rows="4"
      value={value}
      onChange={onChange}
      required
    ></textarea>
  </div>
);

export default Contact;
