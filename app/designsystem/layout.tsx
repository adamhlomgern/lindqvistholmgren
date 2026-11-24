import { Poppins } from "next/font/google";

// Rubriktypsnitt för designsystemets utkast. Laddas bara under /designsystem
// och exponeras som --font-poppins, som --font-heading i globals.css pekar på.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export default function DesignSystemLayout({ children }: LayoutProps<"/designsystem">) {
  return <div className={poppins.variable}>{children}</div>;
}
