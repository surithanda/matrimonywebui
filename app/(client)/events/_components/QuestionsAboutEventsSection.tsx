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
    question: "What if I couldn’t attend an event I registered for?",
    answer:
      "Please inform us at least 24 hours before the event if you're unable to attend. We can either reschedule your participation or offer you a refund, depending on the situation.",
  },
];

const QuestionsAboutEventsSection = () => {
  return (
    <section className="md:px-[100px] md:pb-[100px]">
      <div className="text-center md:mb-[50px]">
        <h2 className="BRCobane56600">Questions about our Events</h2>
      </div>

      <div className="flex flex-col items-start md:h-[771px] flex-wrap md:gap-6">
        {faqData.map((faq, index) => (
          <div key={index} className="events-box md:w-1/2">
            <h3 className="BRCobane24600 text-left w-full">{faq.question}</h3>
            <p className="BRCobane18400 mt-3">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default QuestionsAboutEventsSection;
