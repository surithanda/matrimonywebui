const statisticsData = [
  { title: "Profiles Reviewed", value: "1,280" },
  { title: "Profiles Shortlisted", value: "14" },
  { title: "Profile Views", value: "91" },
  { title: "Profiles Saved", value: "42" },
];

const StatisticsCards = () => {
  return (
    <section className="md:px-[120px] -mt-10 -z-10">
      <div className="mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statisticsData.map((stat, index) => (
            <div key={index} className="stats-card">
              <h3 className="BRCobane18500">{stat.title}</h3>
              <p className="dmserif30400 text-[#f74946]">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatisticsCards;
