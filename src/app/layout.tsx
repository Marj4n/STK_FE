import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "Menu App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col md:flex-row font-[Plus_Jakarta_Sans] relative">
        <Sidebar />
        <main className="flex-1 bg-white rounded-t-[2rem] md:rounded-l-[2rem] overflow-y-auto p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
