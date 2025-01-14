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
      alt: "Mehtas Journey",
    },
    {
      title: "Video Calling Arrangement",
      description:
        "Modernizing the matchmaking experience, Video Calling Arrangements allow users to connect virtually, fostering a sense of familiarity and comfort before in-person meetings.",
      imageUrl: servicesfeature2,
      alt: "Kumar Iyer Story",
    },
    {
      title: "Messaging and Notification",
      description:
        "Users communicate seamlessly through the Messaging feature. Real-time notifications keep users informed about new messages, profile views, and other activities, ensuring an engaged experience.",
      imageUrl: servicesfeature3,
      alt: "Kumar Iyer Story",
    },
  ];
  return (
    <section className="md:pt-[120px]">
      <div className="flex flex-col gap-[120px]">
        {stories.map((story, index) => (
          <div
            key={index}
            className={`flex justify-between items-center md:gap-[50px] ${
              index % 2 === 0
                ? "flex-row-reverse md:pl-[100px]"
                : "flex-row md:pr-[100px]"
            }`}
          >
            <div className="relative md:w-3/5 h-full servicesfeatureimage overflow-hidden">
              <Image
                src={story.imageUrl}
                alt={story.alt}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:w-1/2">
              <h3 className="BRCobane48600">{story.title}</h3>
              <p className="mt-5 BRCobane18400">{story.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;

// import Image from "next/image";
// import storyimage from "@/public/images/storyimage.png";

//   return (
//     <section className="">
//       <div className="flex flex-col gap-8">
//         {stories.map((story, index) => (
//           <div
//             key={index}
//             className={`flex justify-between ${
//               index % 2 === 0 ? "flex-row-reverse" : "flex-row"
//             }`}
//           >
//             <div className="relative">
//               <Image
//                 src={story.imageUrl}
//                 alt={story.alt}
//                 className="w-full h-64 object-cover"
//                 width={600}
//                 height={400}
//               />
//             </div>
//             <div className="p-6">
//               <h3 className="text-xl font-semibold text-gray-800">
//                 {story.title}
//               </h3>
//               <p className="mt-2 text-gray-600">{story.description}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default Features;
