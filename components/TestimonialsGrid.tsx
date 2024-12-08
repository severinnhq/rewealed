import Image from 'next/image'

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Fashion Blogger",
    quote: "This brand's attention to detail and quality is unmatched. Every piece feels like a statement.",
    image: "/placeholder.svg?height=100&width=100"
  },
  {
    name: "Sam Lee",
    role: "Stylist",
    quote: "I always recommend these clothes to my clients. The fit is perfect, and the styles are timeless.",
    image: "/placeholder.svg?height=100&width=100"
  },
  {
    name: "Taylor Swift",
    role: "Customer",
    quote: "I've never felt more confident and comfortable. These clothes are a game-changer!",
    image: "/placeholder.svg?height=100&width=100"
  },
  {
    name: "Jordan Patel",
    role: "Fashion Photographer",
    quote: "The colors and textures photograph beautifully. It's a joy to work with this brand.",
    image: "/placeholder.svg?height=100&width=100"
  }
]

export default function TestimonialsGrid() {
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className={`bg-white p-6 rounded-lg shadow-lg ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
              <div className="flex items-center mb-4">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={50}
                  height={50}
                  className="rounded-full mr-4"
                />
                <div>
                  <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-800 italic">&ldquo;{testimonial.quote}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

