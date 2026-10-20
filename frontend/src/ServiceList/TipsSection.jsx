export default function TipsSection() {
  const tips = [
    {
      text: "Ensure a good user experience on all devices with a responsive webpage – your key to captivating every screen size.",
      author: "WebGenesis",
      avatar: "https://via.placeholder.com/40x40.png?text=W",
    },
    {
      text: "Careful planning and testing ensure a smooth transition in website migration, minimizing risks like data loss and downtime.",
      author: "Riz",
      avatar: "https://via.placeholder.com/40x40.png?text=R",
    },
    {
      text: "Always back up your site before making direct changes to theme files.",
      author: "Sumon",
      avatar: "https://via.placeholder.com/40x40.png?text=S",
    },
    {
      text: "WooCommerce offers a powerful, flexible, and cost-effective solution for building and managing online stores, making it a top choice for businesses of all sizes.",
      author: "Mithun",
      avatar: "https://via.placeholder.com/40x40.png?text=M",
    },
    {
      text: "For those serious about building a website that fits their exact vision, WordPress.org is ideal. It's the best option for long-term growth and success.",
      author: "Ayesha K",
      avatar: "https://via.placeholder.com/40x40.png?text=A",
    },
    {
      text: "Regular database optimization ensures your WordPress site performs well and loads faster, key to a great user experience and improved SEO rankings.",
      author: "The Dot Dev",
      avatar: "https://via.placeholder.com/40x40.png?text=D",
    },
    {
      text: "Webflow CMS is the no code visual website builder, ideal for beginners and designers looking to create websites quickly without worrying about technical details.",
      author: "Gvrdenu",
      avatar: "https://via.placeholder.com/40x40.png?text=G",
    },
    {
      text: "A mobile-friendly site is essential for user retention, search engine ranking, and overall business success.",
      author: "Usama Afzal",
      avatar: "https://via.placeholder.com/40x40.png?text=U",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-2xl font-semibold mb-8">
        Website Development tips from top-tier talent
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
