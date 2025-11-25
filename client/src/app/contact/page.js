"use client";
import React, { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane } from "react-icons/fa";
import { motion } from "framer-motion";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await fetch("/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("✅ Message sent successfully!");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        const err = await res.json().catch(() => null);
        setStatus(err?.message || "❌ Failed to send. Try again.");
      }
    } catch (err) {
      setStatus("❌ Network error. Try again.");
    }
  };

  return (
    <>
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
                className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-lg font-medium hover:opacity-90 transition"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
              >
                Send Message
              </motion.button>
            </form>

            {status && <p className="mt-3 text-sm text-blue-900">{status}</p>}
          </div>

          {/* Right Section: Info & Hours */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Contact Information</h3>
              <InfoItem Icon={FaEnvelope} title="Email" text="makemeecosmetics@gmail.com" sub="We respond within 24 hours" />
              <InfoItem Icon={FaPhone} title="Phone" text="+91 7249334274" sub="Mon-Fri: 9AM-6PM IST" />
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

/* Reusable Components */

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
