'use client';

const citationStyles = [
  {
    name: 'APA',
    example: 'Smith, J. (2023). The art of citation. Journal of Academic Writing, 12(3), 45-67.',
    icon: '📝'
  },
  {
    name: 'MLA',
    example: 'Smith, John. "The Art of Citation." Journal of Academic Writing, vol. 12, no. 3, 2023, pp. 45-67.',
    icon: '📚'
  },
  {
    name: 'Chicago',
    example: 'Smith, John. 2023. "The Art of Citation." Journal of Academic Writing 12 (3): 45-67.',
    icon: '📖'
  }
];

export function StylesShowcase() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          Popular Citation Styles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {citationStyles.map((style) => (
            <div 
              key={style.name}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <div className="text-3xl mb-4">{style.icon}</div>
              <h3 className="text-xl font-semibold mb-4">{style.name}</h3>
              <p className="text-sm text-gray-600 font-mono">{style.example}</p>
            </div>
          ))}
        </div>
        <p className="text-center mt-8 text-gray-600">
          Plus 200+ more citation styles available
        </p>
      </div>
    </section>
  );
}