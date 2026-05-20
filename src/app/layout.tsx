import "./globals.css"; // Ensure standard Tailwind directives inside this target file
import Providers from "@/components/providers/Providers";

export const metadata = {
  title: "Bento Market - Modular Infrastructure Network",
  description: "Next Generation Asset Management Core Index Flow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#030014] antialiased selection:bg-purple-500/30 selection:text-purple-200">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
