'use client';

interface PageRangeFieldProps {
  value: { start: string; end?: string } | null;
  onChange: (value: { start: string; end?: string } | null) => void;
  required?: boolean;
}

export function PageRangeField({ value, onChange, required }: PageRangeFieldProps) {
  const handleChange = (field: 'start' | 'end', fieldValue: string) => {
    const newValue = value || { start: '', end: '' };
    onChange({
      ...newValue,
      [field]: fieldValue
    });
  };

  const validate = () => {
    if (!value) return !required;
    if (!value.start) return false;
    if (value.end && parseInt(value.end) < parseInt(value.start)) return false;
    return true;
  };

  const isValid = validate();

  return (
    <div className="space-y-2">
      <div className="flex gap-4 items-center">
        <input
          type="number"
          value={value?.start || ''}
          onChange={(e) => handleChange('start', e.target.value)}
          placeholder="Start page"
          className={`flex-1 px-3 py-2 border rounded-md ${
            !isValid ? 'border-red-500' : ''
          }`}
          required={required}
          min="1"
        />
        <span>-</span>
        <input
          type="number"
          value={value?.end || ''}
          onChange={(e) => handleChange('end', e.target.value)}
          placeholder="End page (optional)"
          className="flex-1 px-3 py-2 border rounded-md"
          min={value?.start || '1'}
        />
      </div>

      {!isValid && (
        <p className="text-red-500 text-sm">
          {required && !value?.start
            ? 'Start page is required'
            : 'End page must be greater than start page'}
        </p>
      )}
    </div>
  );
}