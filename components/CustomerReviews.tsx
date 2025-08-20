"use client";
import { useRef } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

interface Review {
  name: string;
  text: string;
  rating: number;
}

const reviews: Review[] = [
  {
    name: "Sana",
    text: "Absolutely loved the cherry tarts! Fresh and full of flavor.",
    rating: 5,
  },
  {
    name: "Levi",
    text: "The jams are my favorite. Perfect balance of sweetness and tang.",
    rating: 4,
  },
  {
    name: "Anur",
    text: "Ordered for a party and everyone asked where I got them from!",
    rating: 5,
  },
  {
    name: "Ria",
    text: "Great taste but delivery took a bit longer than expected.",
    rating: 5,
  },
  {
    name: "Mira",
    text: "The cherry chocolates are a must-try. So unique and delicious.",
    rating: 5,
  },
];

export default function ReviewCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -clientWidth : clientWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative p-6 bg-cherry">
      {/* Divider */}
      <div className="border-t border-white py-2 px-12"></div>

      {/* Heading */}
      <div className="flex gap-2 items-center justify-center p-12">
        <img src="/point.png" className="w-8 h-8" />
        <h2 className="text-2xl md:text-3xl text-center text-white font-heading">
          OUR BUYERS SAY
        </h2>
      </div>

      {/* Carousel wrapper → relative so arrows align with cards */}
      <div className="relative">
        {/* Scroll Buttons */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2  -translate-y-1/2 z-10 text-cherry bg-accent p-2 rounded-full border shadow shadow-cherry hover:bg-cherry hover hover:text-white">
          <BiChevronLeft size={24} />
        </button>

        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2  -translate-y-1/2 z-10 bg-accent text-cherry p-2 rounded-full border shadow shadow-cherry hover:bg-cherry hover hover:text-white">
          <BiChevronRight size={24} />
        </button>

        {/* Reviews Container */}
        <div
          ref={scrollRef}
          style={{ scrollbarWidth: "none" }}
          className="flex overflow-x-auto space-x-6 px-12 scroll-smooth snap-x snap-mandatory ">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="min-w-[300px] md:min-w-[400px]  bg-white rounded-xl shadow-md  p-6 snap-center">
              <p className="text-gray-600 italic mb-4">"{review.text}"</p>
              <p className="font-semibold text-cherry">- {review.name}</p>

              {/* Ratings */}
              <div className="flex mt-2">
                {Array.from({ length: 5 }).map((_, starIdx) => (
                  <span
                    key={starIdx}
                    className={`text-lg ${
                      starIdx < review.rating ? "text-cherry" : "text-gray-300"
                    }`}>
                    <i className="bi bi-star-fill"></i>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
