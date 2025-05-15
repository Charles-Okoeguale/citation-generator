'use client';

const benefits = [
  {
    title: 'Save Time',
    description: 'Generate citations in seconds instead of minutes',
    icon: '⚡'
  },
  {
    title: 'Ensure Accuracy',
    description: 'Eliminate manual formatting errors and inconsistencies',
    icon: '✅'
  },
  {
    title: 'Stay Organized',
    description: 'Keep all your citations in one place, organized by project',
    icon: '📋'
  },
  {
    title: 'Maintain Integrity',
    description: 'Properly credit sources and avoid plagiarism',
    icon: '🎓'
  }
];

export function BenefitsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          Why Use Our Citation Generator?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="text-center"
            >
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}