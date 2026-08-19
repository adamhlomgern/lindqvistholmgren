import { Search } from "lucide-react";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function SearchInput({ value, onChange, placeholder = "Sök…" }: SearchInputProps) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-demo-text-faint" size={16} />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-demo-border bg-demo-surface py-2 pl-9 pr-4 text-sm text-demo-text placeholder:text-demo-text-faint outline-none transition-colors focus:border-demo-primary focus:ring-1 focus:ring-demo-primary"
      />
    </div>
  );
}
