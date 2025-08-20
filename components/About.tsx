import React from "react";

const AboutSection = () => {
  return (
    <section className="bg-cherry text-center p-6 " id="about">
      <div className="border-t border-white py-2  px-12"></div>
      <div className="mx-auto flex flex-col justify-center items-center gap-8 m-6 ">
        {/* Text */}
        <div className="md:w-2/3 font-body text-accent space-y-4">
          <div className="flex gap-2 items-center justify-center p-2 md:p-4">
            <img src="/point.png" className="w-8 h-8" />
            <h2 className="text-2xl md:text-3xl text-center text-white font-heading">
              ABOUT US
            </h2>
          </div>

          {/* Paragraph container with background */}
          <div
            className="p-6 rounded-full relative bg-cover bg-center  text-white space-y-4 overflow-hidden"
            style={{
              backgroundImage: "url('/cherries-2.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}>
            <div className="absolute m-4 inset-0 bg-black/50"></div>
            <div className="relative font-light m-4 sm:m-6 z-10 space-y-4">
              <p className="m-6">
                At <strong>Cherry Picked</strong>, we craft premium cherry-based
                treats for every occasion. From baked goods to confectionery,
                each item is made with high-quality ingredients and a touch of
                love.
              </p>
              <p>
                Our mission is to deliver a delightful cherry experience in
                every bite—combining artistry, flavor, and freshness. We source
                from trusted orchards and blend timeless recipes with a modern
                twist for sweets, jams, and beverages that feel both familiar
                and new.
              </p>
              <p className="m-6">
                Whether you’re gifting or treating yourself, Cherry Picked
                brings joy to the little moments, creating memorable bites worth
                savoring.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
