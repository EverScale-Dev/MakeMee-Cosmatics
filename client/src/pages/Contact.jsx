import { useEffect } from "react";
import gsap from "gsap";

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
      },
    );
  }, []);

  return (
    <section className="min-h-screen bg-white flex items-center justify-center px-4 py-20">
      {/* OUTER CONTAINER */}
      <div className="animate w-full max-w-6xl bg-[#FDE6F1] rounded-3xl px-6 sm:px-10 md:px-14 py-14">
        {/* HEADER */}
        <div className="text-center mb-14">
          <h1 className="text-3xl sm:text-4xl font-bold text-main mb-3">
            Get In Touch
          </h1>
          <p className="text-main/70 max-w-2xl mx-auto text-sm sm:text-base">
            Lorem ipsum dolor sit amet. Ut omnis veritatis ut deserunt quia ut
            reprehenderit quam rem omnis tempora. Non excepturi impedit est
            ipsum blanditiis
          </p>
        </div>

        {/* CARD WITH GLOW */}
        <div
          className="
            bg-white rounded-3xl
            grid grid-cols-1 md:grid-cols-2
            overflow-hidden
            min-h-[560px]
            shadow-[0_0_60px_rgba(252,108,180,0.25)]
          "
        >
          {/* LEFT INFO PANEL */}
          <div className="relative bg-[#FC6CB4] text-white p-10 flex flex-col justify-between">
            <div>
              <h3 className="text-4xl font-semibold mb-3  text-main" >
                Contact Information
              </h3>
              <p className="text-white/80 text-md mb-10">
                Lorem ipsum dolor sit amet. Ut omnis veritatis ut deserunt quia
              </p>

              <div className="mt-10 space-y-5">
                {/* Phone */}
                <div
                  className="
                  bg-white/15 rounded-xl px-5 py-4
                  text-lg sm:text-lg font-semibold
                  backdrop-blur-sm
                "
                >
                  📞 9075141925
                </div>

                {/* Email */}
                <div
                  className="
                  bg-white/15 rounded-xl px-5 py-4
                  text-lg sm:text-xl font-semibold
                  break-all backdrop-blur-sm
                "
                >
                  ✉️ makemeecosmetics@gmail.com
                </div>

                {/* Location */}
                <div
                  className="
    bg-white/15 rounded-xl px-5 py-4
    text-lg sm:text-xl font-semibold
    backdrop-blur-sm
  "
                >
                  📍 Mumbai, India
                </div>
              </div>
            </div>

            {/* DECORATIVE CURVE */}
            <div className="absolute -bottom-30 -right-20 w-60 h-60 bg-white/20 rounded-full" />
            
          </div>

          {/* RIGHT FORM (TALLER) */}
          <div className="p-10 flex flex-col justify-center">
            <form className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Name"
                  className="
                    border border-black/10 rounded-lg px-4 py-3
                    focus:outline-none focus:border-[#FC6CB4]
                    transition text-main
                  "
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="
                    border border-black/10 rounded-lg px-4 py-3
                    focus:outline-none focus:border-[#FC6CB4]
                    transition text-main
                  "
                />
              </div>

              <input
                type="text"
                placeholder="Subject"
                className="
                  w-full border border-black/10 rounded-lg px-4 py-3
                  focus:outline-none focus:border-[#FC6CB4]
                  transition text-main
                "
              />

              <textarea
                placeholder="Message"
                rows="5"
                className="
                  w-full border border-black/10 rounded-lg px-4 py-3
                  focus:outline-none focus:border-[#FC6CB4]
                  resize-none transition text-main
                "
              />

              <button
                type="submit"
                className="
                  bg-[#FC6CB4] text-main font-medium
                  px-10 py-3 rounded-lg
                  hover:bg-[#F0A400]
                  transition-all duration-300
                  self-start
                "
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
