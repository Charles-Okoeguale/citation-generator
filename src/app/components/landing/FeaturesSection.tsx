'use client';

const features = [
  {
    title: '200+ Citation Styles',
    description: 'Support for all major academic citation styles and formats',
    icon: '📚'
  },
  {
    title: 'In-text & Full Citations',
    description: 'Generate both in-text citations and complete bibliographies',
    icon: '📝'
  },
  {
    title: 'Save & Organize',
    description: 'Store your citations and organize them by project',
    icon: '💾'
  },
  {
    title: 'Smart Detection',
    description: 'Automatically extract citation information from URLs and DOIs',
    icon: '🔍'
  }
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          Everything You Need for Perfect Citations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}