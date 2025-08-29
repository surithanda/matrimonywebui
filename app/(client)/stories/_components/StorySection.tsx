import Image from "next/image";
import storyimage from "@/public/images/storyimage.png";
import coupleOne from "@/public/images/affectionate-indian-couple-celebrating-propose-day-together.jpg";
import coupleTwo from "@/public/images/indian-couple-celebrating-propose-day-by-being-romantic-with-each-other.jpg";

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
    <section className="p-4 sm:p-6 md:p-12 lg:p-16 xl:p-[100px]">
      <div className="flex flex-col gap-8 sm:gap-12 md:gap-16 lg:gap-20 xl:gap-[120px]">
        {stories.map((story, index) => (
          <div
            key={index}
            className={`flex flex-col gap-6 sm:gap-8 items-center ${
              index % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"
            } md:justify-between md:items-center md:gap-8 lg:gap-12 xl:gap-[50px]`}
          >
            {/* Image Container */}
            <div className="relative w-full md:w-3/5 h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px]">
              <Image
                src={story.imageUrl}
                alt={story.alt}
                className="object-cover rounded-[12px] sm:rounded-[16px] md:rounded-[20px]"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 60vw, 60vw"
                priority
              />
            </div>

            {/* Content Container */}
            <div className="w-full md:w-1/2 text-center md:text-left">
              <h3 className="BRCobane48400 text-4xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-tight sm:leading-tight md:leading-snug">
                {story.title}
              </h3>
              <p className="mt-3 sm:mt-4 md:mt-5 BRCobane18400 text-sm sm:text-base md:text-lg leading-relaxed">
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
