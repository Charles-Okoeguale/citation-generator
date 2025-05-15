'use client';

interface DateFieldProps {
  value: string | null;
  onChange: (date: string | null) => void;
  required?: boolean;
}

export function DateField({ value, onChange, required }: DateFieldProps) {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    onChange(date || null);
  };

  const handleMonthYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value: selectedValue } = e.target;
    const currentDate = value ? new Date(value) : new Date();
    
    if (name === 'month') {
      currentDate.setMonth(parseInt(selectedValue));
    } else if (name === 'year') {
      currentDate.setFullYear(parseInt(selectedValue));
    }
    
    onChange(currentDate.toISOString().split('T')[0]);
  };

  // Generate year options (100 years back from current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 101 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-2">
      <div className="flex gap-4">
        <select
          name="month"
          onChange={handleMonthYearChange}
          value={value ? new Date(value).getMonth() : ''}
          className="flex-1 px-3 py-2 border rounded-md"
        >
          <option value="">Select Month</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i}>
              {new Date(2000, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>

        <select
          name="year"
          onChange={handleMonthYearChange}
          value={value ? new Date(value).getFullYear() : ''}
          className="flex-1 px-3 py-2 border rounded-md"
        >
          <option value="">Select Year</option>
          {years.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <input
        type="date"
        value={value || ''}
        onChange={handleDateChange}
        className="w-full px-3 py-2 border rounded-md"
        required={required}
      />
    </div>
  );
}