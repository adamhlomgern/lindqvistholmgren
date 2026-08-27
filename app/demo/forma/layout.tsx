import { Inter } from "next/font/google";
import { FormaProvider } from "@/features/forma/state/FormaProvider";
import { FormaShell } from "@/features/forma/components/FormaShell";

// Forma gets its own typeface — loaded here (not in the root layout) so it
// stays scoped to /demo/forma and doesn't touch the rest of the site, same
// reasoning as the --color-forma-* tokens in globals.css. See the "font-forma"
// theme token below, which points at this variable.
const inter = Inter({
  variable: "--font-forma-inter",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export default function FormaDemoLayout({ children }: LayoutProps<"/demo/forma">) {
  return (
    <div className={inter.variable}>
      <FormaProvider>
        <FormaShell>{children}</FormaShell>
      </FormaProvider>
    </div>
  );
}
