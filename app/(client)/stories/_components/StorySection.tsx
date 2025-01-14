import Image from "next/image";
import storyimage from "@/public/images/storyimage.png";

const StorySection = () => {
  const stories = [
    {
      title: "25 Years and Counting: The Mehtas' Journey",
      description:
        "From their first meeting at a temple to celebrating their silver jubilee, Raj and Pinga Mehta share how their arranged match turned into a lifetime of love.",
      imageUrl: storyimage,
      alt: "Mehtas Journey",
    },
    {
      title: "When North Met South: The Kumar-Iyer Story",
      description:
        "Despite cultural differences, the families of Amit Kumar and Anjali Iyer found common ground through Chaturvarnam's guidance.",
      imageUrl: storyimage,
      alt: "Kumar Iyer Story",
    },
  ];
  return (
    <section className="md:p-[100px_100px]">
      <div className="flex flex-col gap-[120px]">
        {stories.map((story, index) => (
          <div
            key={index}
            className={`flex justify-between items-center md:gap-[50px] ${
              index % 2 === 0 ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div className="relative md:w-3/5 h-full">
              <Image
                src={story.imageUrl}
                alt={story.alt}
                className="w-full h-full stories-image rounded-[20px]"
              />
            </div>
            <div className="md:w-1/2">
              <h3 className="BRCobane48400">{story.title}</h3>
              <p className="mt-5 BRCobane18400">{story.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StorySection;
