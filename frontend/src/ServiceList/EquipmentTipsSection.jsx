export default function TipsSection() {
  const tips = [
    {
      text: "Always perform a pre-operational walkaround inspection before starting heavy excavators or generators on site.",
      author: "Metro Heavy Hub",
      avatar: "https://via.placeholder.com/40x40.png?text=M",
    },
    {
      text: "Verify voltage and KVA load requirements before connecting sensitive cinema lights or sound systems to silent generators.",
      author: "PowerGrid Rentals",
      avatar: "https://via.placeholder.com/40x40.png?text=P",
    },
    {
      text: "Ensure zero-liability insurance coverage and proper rigging certificates when booking mobile cranes for high-rise steel lifting.",
      author: "Apex Crane Services",
      avatar: "https://via.placeholder.com/40x40.png?text=A",
    },
    {
      text: "Sanitize camera sensors and pack lenses in weather-sealed hard cases during field production shoots.",
      author: "CineGears Pro",
      avatar: "https://via.placeholder.com/40x40.png?text=C",
    },
    {
      text: "Regular hydraulic fluid checks prevent line pressure drops and machine overheating on long project shifts.",
      author: "South Machinery Depot",
      avatar: "https://via.placeholder.com/40x40.png?text=S",
    },
    {
      text: "Store cordless power tool batteries in temperature-controlled cases to maintain maximum runtime.",
      author: "DeWalt Pro Outlets",
      avatar: "https://via.placeholder.com/40x40.png?text=D",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-2xl font-semibold mb-8">
        Equipment Rental & Operation tips from top-tier suppliers
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tips.map((tip, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col justify-between"
          >
            <p className="text-gray-700 mb-6">{tip.text}</p>
            <div className="flex items-center gap-3">
              <img
                src={tip.avatar}
                alt={tip.author}
                className="w-8 h-8 rounded-full border"
              />
              <span className="font-medium text-gray-900">{tip.author}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
