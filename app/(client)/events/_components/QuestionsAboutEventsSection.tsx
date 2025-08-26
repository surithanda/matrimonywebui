const faqData = [
  {
    question: "What should I wear to these events?",
    answer:
      "Wear ceremonial dress code or business casual attire for formal events. For outdoor events, traditional Indian attire is welcome and encouraged.",
  },
  {
    question: "How is the event structured?",
    answer:
      "The event will start with introductions, followed by planned networking activities. Each registered participant can bring up to two family members. Please check the event itinerary for more details.",
  },
  {
    question: "Can my parents/family members accompany me?",
    answer:
      "Yes! Most of our events are family-friendly. Each registered participant can bring up to two family members. Please indicate any additional guests during registration.",
  },
  {
    question: "Can I exchange contact information during the event?",
    answer:
      "Yes, you are encouraged to exchange contact information. Each registered participant can bring up to two family members. Please indicate any additional guests during registration.",
  },
  {
    question: "Are meals provided?",
    answer:
      "Meals will be provided at the event, including vegetarian and non-vegetarian options. Special dietary restrictions can be accommodated by informing the organizer before the event.",
  },
  {
    question: "How do I follow up with someone I met?",
    answer:
      "If you met someone at the event and would like to follow up, please use the contact details shared during the event. Feel free to reach out for any connections you'd like to pursue further.",
  },
  {
    question: "What if I feel uncomfortable during the event?",
    answer:
      "If you feel uncomfortable or need any assistance during the event, please approach one of our event coordinators or staff members. We are here to ensure everyone has a positive experience.",
  },
  {
    question: "What if I couldn't attend an event I registered for?",
    answer:
      "Please inform us at least 24 hours before the event if you're unable to attend. We can either reschedule your participation or offer you a refund, depending on the situation.",
  },
];

const QuestionsAboutEventsSection = () => {
  return (
    <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[100px] pb-12 sm:pb-16 md:pb-20 lg:pb-24 xl:pb-[100px]">
      {/* Section Heading */}
      <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16 xl:mb-[50px]">
        <h2 className="BRCobane56600 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight max-w-4xl mx-auto">
          Questions about our Events
        </h2>
      </div>

      {/* FAQ Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-8 xl:gap-12 max-w-7xl mx-auto">
        {faqData.map((faq, index) => (
          <div 
            key={index} 
            className="events-box bg-white p-4 sm:p-5 md:p-6 lg:p-6 xl:p-8 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
          >
            <h3 className="BRCobane24600 text-lg sm:text-xl md:text-xl lg:text-2xl text-left w-full mb-3 sm:mb-4 leading-tight text-gray-900">
              {faq.question}
            </h3>
            <p className="BRCobane18400 text-sm sm:text-base md:text-base lg:text-lg leading-relaxed text-gray-600">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default QuestionsAboutEventsSection;