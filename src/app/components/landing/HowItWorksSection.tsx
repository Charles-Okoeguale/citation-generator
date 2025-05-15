'use client';

const steps = [
  {
    number: 1,
    title: 'Choose Your Source',
    description: 'Select the type of source you\'re citing (book, article, website, etc.)'
  },
  {
    number: 2,
    title: 'Enter Details',
    description: 'Input the source information or let us extract it automatically'
  },
  {
    number: 3,
    title: 'Select Style',
    description: 'Choose from 200+ citation styles including APA, MLA, and Chicago'
  },
  {
    number: 4,
    title: 'Generate & Copy',
    description: 'Get your perfectly formatted citation ready to use'
  }
];

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {step.number}
                </div>
                {step.number < steps.length && (
                  <div className="hidden lg:block w-full h-0.5 bg-blue-200 ml-4" />
                )}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}