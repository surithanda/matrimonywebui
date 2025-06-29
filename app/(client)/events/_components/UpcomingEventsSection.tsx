import Image from "next/image";
import event1 from "@/public/images/event1.png";
import event2 from "@/public/images/event2.png";
import event3 from "@/public/images/event3.png";

const events = [
  {
    title: "Bay Area South Indian Meet",
    location: "San Jose Convention Center, CA",
    date: "December 28 2024, 11:00 AM PST",
    ticketsLeft: 49,
    price: "$75",
    imageUrl: event1, // Replace with actual image paths
    alt: "Bay Area South Indian Meet",
  },
  {
    title: "NYC Gujarati Connect",
    location: "Edison Banquet Hall, New Jersey",
    date: "December 30 2024, 4:00 PM EST",
    ticketsLeft: 49,
    price: "$75",
    imageUrl: event2, // Replace with actual image paths
    alt: "NYC Gujarati Connect",
  },
  {
    title: "Dallas Multi-Cultural Mixer",
    location: "Westin Galleria, Dallas TX",
    date: "January 5 2025, 3:00 PM CST",
    ticketsLeft: 49,
    price: "$75",
    imageUrl: event3, // Replace with actual image paths
    alt: "Dallas Multi-Cultural Mixer",
  },
];

const UpcomingEventsSection = () => {
  return (
    <section className="md:pb-[120px] md:px-[120px]">
      <h2 className="md:mb-[50px] BRCobane56600 text-center">
        Upcoming Events
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-6">
        {events.map((event, index) => (
          <div key={index} className="relative">
            <Image
              src={event.imageUrl}
              alt={event.alt}
              className="w-full h-auto object-cover"
              width={1200}
              height={800}
              loading="lazy"
              placeholder="blur"
              quality={90}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="p-[2px_12px] rounded-[10px] flex gap-1 border border-1 w-fit items-center absolute top-2.5 left-2.5 bg-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="21"
                viewBox="0 0 20 21"
                fill="none"
              >
                <path
                  opacity="0.3"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14.1668 2.1665C14.8299 2.1665 15.4658 2.4299 15.9346 2.89874C16.4034 3.36758 16.6668 4.00346 16.6668 4.6665V17.9998C16.6667 18.1568 16.6223 18.3105 16.5387 18.4433C16.455 18.5762 16.3356 18.6827 16.1941 18.7506C16.0526 18.8185 15.8948 18.8451 15.7389 18.8273C15.5829 18.8094 15.4352 18.7479 15.3127 18.6498L13.7502 17.3998L12.1877 18.6498C12.0276 18.7781 11.8258 18.8428 11.621 18.8316C11.4162 18.8203 11.2228 18.734 11.0777 18.589L10.0002 17.5115L8.92266 18.589C8.77767 18.7341 8.58425 18.8206 8.37945 18.832C8.17464 18.8434 7.97284 18.7788 7.81266 18.6507L6.25016 17.3998L4.68766 18.6498C4.56514 18.7479 4.4174 18.8094 4.26146 18.8273C4.10552 18.8451 3.94772 18.8185 3.80622 18.7506C3.66472 18.6827 3.54528 18.5762 3.46165 18.4433C3.37802 18.3105 3.33359 18.1568 3.3335 17.9998V4.6665C3.3335 4.00346 3.59689 3.36758 4.06573 2.89874C4.53457 2.4299 5.17045 2.1665 5.8335 2.1665H14.1668Z"
                  fill="#FEAC14"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.4998 7.1665H7.49984C7.28744 7.16674 7.08314 7.24807 6.9287 7.39388C6.77425 7.53969 6.68131 7.73896 6.66886 7.951C6.65641 8.16303 6.7254 8.37182 6.86172 8.5347C6.99805 8.69758 7.19142 8.80225 7.40234 8.82734L7.49984 8.83317H12.4998C12.7122 8.83293 12.9165 8.7516 13.071 8.6058C13.2254 8.45999 13.3184 8.26071 13.3308 8.04867C13.3433 7.83664 13.2743 7.62785 13.138 7.46498C13.0016 7.3021 12.8083 7.19742 12.5973 7.17234L12.4998 7.1665ZM9.99984 10.4998H7.49984C7.27882 10.4998 7.06686 10.5876 6.91058 10.7439C6.7543 10.9002 6.6665 11.1122 6.6665 11.3332C6.6665 11.5542 6.7543 11.7661 6.91058 11.9224C7.06686 12.0787 7.27882 12.1665 7.49984 12.1665H9.99984C10.2209 12.1665 10.4328 12.0787 10.5891 11.9224C10.7454 11.7661 10.8332 11.5542 10.8332 11.3332C10.8332 11.1122 10.7454 10.9002 10.5891 10.7439C10.4328 10.5876 10.2209 10.4998 9.99984 10.4998Z"
                  fill="#FEAC14"
                />
              </svg>
              <span className="text-sm text-gray-500">
                {event.ticketsLeft} Tickets left
              </span>
            </div>
            <div className="">
              <div className="flex w-full justify-between items-center md:mt-[15px]">
                <h3 className="BRCobane24400">{event.title}</h3>
                <div className="p-[2px_12px] rounded-[10px] bg-[#FEAC00]">
                  {event.price}
                </div>
              </div>
              <p className="BRCobane16400 space-x-5 flex items-center md:my-[15px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M6.72 16.64C6.97461 16.5657 7.24829 16.5957 7.48083 16.7232C7.71338 16.8507 7.88574 17.0654 7.96 17.32C8.03426 17.5746 8.00434 17.8483 7.87681 18.0808C7.74929 18.3134 7.53461 18.4857 7.28 18.56C6.78 18.706 6.42 18.86 6.189 19C6.427 19.143 6.803 19.303 7.325 19.452C8.48 19.782 10.133 20 12 20C13.867 20 15.52 19.782 16.675 19.452C17.198 19.303 17.573 19.143 17.811 19C17.581 18.86 17.221 18.706 16.721 18.56C16.4704 18.4825 16.2603 18.3096 16.136 18.0786C16.0117 17.8476 15.9831 17.577 16.0564 17.3251C16.1298 17.0733 16.2991 16.8603 16.528 16.7321C16.7569 16.604 17.0269 16.5709 17.28 16.64C17.948 16.835 18.56 17.085 19.03 17.406C19.465 17.705 20 18.226 20 19C20 19.783 19.452 20.308 19.01 20.607C18.532 20.929 17.907 21.18 17.224 21.375C15.846 21.77 14 22 12 22C10 22 8.154 21.77 6.776 21.375C6.093 21.18 5.468 20.929 4.99 20.607C4.548 20.307 4 19.783 4 19C4 18.226 4.535 17.705 4.97 17.406C5.44 17.085 6.052 16.835 6.72 16.64ZM12 7.5C10.46 7.5 9.498 9.167 10.268 10.5C10.625 11.119 11.285 11.5 12 11.5C13.54 11.5 14.502 9.833 13.732 8.5C13.5565 8.19597 13.304 7.9435 13 7.76796C12.6959 7.59243 12.3511 7.50001 12 7.5Z"
                    fill="#111111"
                  />
                  <path
                    opacity="0.3"
                    d="M12 2C13.9891 2 15.8968 2.79018 17.3033 4.1967C18.7098 5.60322 19.5 7.51088 19.5 9.5C19.5 12.068 18.1 14.156 16.65 15.64C16.0736 16.2239 15.4542 16.7638 14.797 17.255C14.203 17.701 12.845 18.537 12.845 18.537C12.5874 18.6834 12.2963 18.7604 12 18.7604C11.7037 18.7604 11.4126 18.6834 11.155 18.537C10.4811 18.1462 9.82938 17.7182 9.203 17.255C8.5458 16.7638 7.9264 16.2239 7.35 15.64C5.9 14.156 4.5 12.068 4.5 9.5C4.5 7.51088 5.29018 5.60322 6.6967 4.1967C8.10322 2.79018 10.0109 2 12 2Z"
                    fill="#111111"
                  />
                </svg>
                {event.location}
              </p>
              <p className="BRCobane16400 space-x-5 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    opacity="0.3"
                    d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V12H21Z"
                    fill="#111111"
                  />
                  <path
                    d="M16 3C16.2652 3 16.5196 3.10536 16.7071 3.29289C16.8946 3.48043 17 3.73478 17 4V5H19C19.5304 5 20.0391 5.21071 20.4142 5.58579C20.7893 5.96086 21 6.46957 21 7V10H3V7C3 6.46957 3.21071 5.96086 3.58579 5.58579C3.96086 5.21071 4.46957 5 5 5H7V4C7 3.73478 7.10536 3.48043 7.29289 3.29289C7.48043 3.10536 7.73478 3 8 3C8.26522 3 8.51957 3.10536 8.70711 3.29289C8.89464 3.48043 9 3.73478 9 4V5H15V4C15 3.73478 15.1054 3.48043 15.2929 3.29289C15.4804 3.10536 15.7348 3 16 3Z"
                    fill="#111111"
                  />
                </svg>
                {event.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UpcomingEventsSection;
