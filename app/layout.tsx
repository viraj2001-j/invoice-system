import { Inter, Poppins } from "next/font/google"
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
   <html lang="en" className={`${poppins.variable} ${inter.variable}`}>

      <body  className="font-sans">
        <Providers>
          {children}
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
