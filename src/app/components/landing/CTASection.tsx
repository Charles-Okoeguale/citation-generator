'use client';

export function CTASection() {
  return (
    <section className="py-20 bg-blue-600">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Create Perfect Citations?
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Join thousands of students and researchers who trust our citation generator
        </p>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
          Get Started Now - It's Free
        </button>
      </div>
    </section>
  );
}