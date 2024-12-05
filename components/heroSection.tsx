
import Image from 'next/image'

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <picture>
        {/* Mobile image */}
        <source
          media="(max-width: 640px)"
          srcSet="/uploads/resp2.png?height=1080&width=640 640w"
          sizes="100vw"
        />
        {/* Tablet image */}
        <source
          media="(max-width: 1128px)"
          srcSet="/uploads/resp1.png?height=1080&width=1024 1024w"
          sizes="100vw"
        />
        {/* Desktop image */}
        <source
          media="(min-width: 1129px)"
          srcSet="/uploads/tryhero.png?height=1080&width=1920 1920w"
          sizes="100vw"
        />
        <Image
          src="/placeholder.svg?height=1080&width=1920"
          alt="Hero Image"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </picture>
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to Our Site</h1>
          <p className="text-xl md:text-2xl">Discover amazing content and experiences</p>
        </div>
      </div>
    </section>
  )
}
