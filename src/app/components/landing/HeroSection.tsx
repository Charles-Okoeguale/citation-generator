'use client';

export function HeroSection() {
  return (
    <section className="relative py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center">
          <div className="w-full lg:w-6/12 px-4">
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Create Perfect Citations in Seconds
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Generate accurate citations in 200+ styles including APA, MLA, and Chicago. 
              Save time and ensure academic integrity with our powerful citation tool.
            </p>
            <div className="flex gap-4">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Create Citation Now
              </button>
              <button className="border border-gray-300 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Learn More
              </button>
            </div>
          </div>
          {/* <div className="w-full lg:w-6/12 px-4 mt-12 lg:mt-0">
            <img 
              src="/hero-illustration.svg" 
              alt="Citation Generator Interface" 
              className="w-full"
            />
          </div> */}
        </div>
      </div>
    </section>
  );
}