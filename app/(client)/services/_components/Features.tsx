import Image from "next/image";
import servicesfeature1 from "@/public/images/servicesfeature1.png";
import servicesfeature2 from "@/public/images/servicesfeature2.png";
import servicesfeature3 from "@/public/images/servicesfeature3.png";

const Features = () => {
  const stories = [
    {
      title: "Background Check",
      description:
        "Prioritizing safety, the Background Check feature verifies users' education, employment, relationship, family, criminal, financial, and medical backgrounds, enhancing the authenticity of the platform.",
      imageUrl: servicesfeature1,
      alt: "Background Check feature illustration",
    },
    {
      title: "Video Calling Arrangement",
      description:
        "Modernizing the matchmaking experience, Video Calling Arrangements allow users to connect virtually, fostering a sense of familiarity and comfort before in-person meetings.",
      imageUrl: servicesfeature2,
      alt: "Video Calling Arrangement feature illustration",
    },
    {
      title: "Messaging and Notification",
      description:
        "Users communicate seamlessly through the Messaging feature. Real-time notifications keep users informed about new messages, profile views, and other activities, ensuring an engaged experience.",
      imageUrl: servicesfeature3,
      alt: "Messaging and Notification feature illustration",
    },
  ];

  return (
    <section className="pt-12 px-4 sm:pt-16 sm:px-6 md:pt-20 md:px-8 lg:pt-24 lg:px-0 xl:pt-[120px]">
      <div className="flex flex-col gap-12 sm:gap-16 md:gap-20 lg:gap-24 xl:gap-[120px]">
        {stories.map((story, index) => (
          <div
            key={index}
            className={`flex flex-col gap-6 sm:gap-8 items-center ${
              index % 2 === 0
                ? "md:flex-row-reverse md:pl-0 lg:pl-12 xl:pl-[100px]"
                : "md:flex-row md:pr-0 lg:pr-12 xl:pr-[100px]"
            } md:justify-between md:items-center md:gap-8 lg:gap-12 xl:gap-[50px]`}
          >
            {/* Image Container */}
            <div className="relative w-full md:w-3/5 h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] xl:h-[450px] servicesfeatureimage overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Image
                src={story.imageUrl}
                alt={story.alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 ease-out"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 60vw, 60vw"
                priority={index === 0}
                quality={85}
                data-aos={index % 3 === 0 ? "fade-left" : "fade-right"}
                data-aos-duration="1000"
              />
            </div>

            {/* Content Container */}
            <div
              data-aos={index % 3 === 0 ? "fade-right" : "fade-left"}
              data-aos-duration="1000"
              className="w-full md:w-1/2 text-center md:text-left px-2 sm:px-4 md:px-0"
            >
              <h3 className="BRCobane48600 text-4xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-tight sm:leading-tight md:leading-snug mb-3 sm:mb-4 md:mb-5 text-gray-900">
                {story.title}
              </h3>
              <p className="BRCobane18400  text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-gray-600 max-w-prose mx-auto md:mx-0">
                {story.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
