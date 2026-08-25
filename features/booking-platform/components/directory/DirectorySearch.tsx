import { SearchInput } from "@/components/demo/SearchInput";

export function DirectorySearch({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <SearchInput value={value} onChange={onChange} placeholder="Sök salong, ort eller behandling…" />;
}
