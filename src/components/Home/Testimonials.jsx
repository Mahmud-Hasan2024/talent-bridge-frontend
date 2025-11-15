const testimonials = [
  {
    id: 1,
    name: "Nabila Hasan",
    role: "HR Manager",
    quote:
      "We found amazing candidates through Talent Bridge. It’s now our go-to hiring platform!",

    image: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    id: 2,
    name: " Ahsan Shakib",
    role: "Software Engineer",
    quote:
      "Talent Bridge helped me land my dream job in just two weeks! Highly professional and user-friendly platform.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 3,
    name: "Ayesha Karim",
    role: "UI/UX Designer",
    quote:
      "A platform that truly values both employers and applicants. Great design and smooth experience!",

    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

const Testimonials = () => {
  return (
    <section id="reviews" className="py-16 bg-emerald-50">
      <div className="container mx-auto px-6 md:px-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-emerald-700 mb-12">
          What Our Users Say 💬
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="card bg-white shadow-md p-6 hover:shadow-lg transition border-t-4 border-lime-400"
            >
              <div className="flex flex-col items-center text-center">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-20 h-20 rounded-full mb-4 border-2 border-emerald-500 object-cover"
                />
                <p className="italic text-gray-600 mb-4">"{t.quote}"</p>
                <h3 className="font-semibold text-lg text-emerald-700">
                  {t.name}
                </h3>
                <p className="text-sm text-gray-500">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
