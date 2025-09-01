import Image from "next/image";
import coupleOne from "@/public/images/couple1.jpg";
import coupleTwo from "@/public/images/storie.jpg";

const StorySection = () => {
  const stories = [
    {
      title: "25 Years and Counting: The Mehtas' Journey",
      description:
        "From their first meeting at a temple to celebrating their silver jubilee, Raj and Pinga Mehta share how their arranged match turned into a lifetime of love.",
      imageUrl: coupleOne,
      alt: "Mehtas Journey",
    },
    {
      title: "When North Met South: The Kumar-Iyer Story",
      description:
        "Despite cultural differences, the families of Amit Kumar and Anjali Iyer found common ground through Chaturvarnam's guidance.",
      imageUrl: coupleTwo,
      alt: "Kumar Iyer Story",
    },
  ];

  return (
    <section className="py-10 2xl:py-[100px]">
      <div className="flex flex-col gap-8 sm:gap-12 md:gap-16 lg:gap-20 xl:gap-[120px]">
        {stories.map((story, index) => (
          <div
            key={index}
            className={`flex flex-col gap-6 sm:gap-8 items-center ${
              index % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"
            } md:justify-between md:items-center md:gap-8 lg:gap-12 xl:gap-[50px]`}
          >
            {/* Image Container */}
            <div
              className="relative w-full md:w-3/5 h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px]"
              data-aos={index % 2 === 0 ? "fade-left" : "fade-right"}
              data-aos-duration="1000"
            >
              <Image
                src={story.imageUrl}
                alt={story.alt}
                className={`object-cover ${
                  index % 2 === 0
                    ? "rounded-tl-[300px] rounded-bl-[300px]"
                    : "rounded-tr-[300px] rounded-br-[300px]"
                }`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 60vw, 60vw"
                priority
              />
            </div>

            {/* Content Container */}
            <div
              className="w-full md:w-1/2 text-center md:text-left px-10"
              data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
              data-aos-duration="1000"
            >
              <h3 className="BRCobane48400 text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl leading-tight">
                {story.title}
              </h3>
              <p className="mt-3 sm:mt-4 md:mt-5 BRCobane18400 text-[#222] text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
                {story.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StorySection;
