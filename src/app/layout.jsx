'use client'
import { Inter } from "next/font/google";
import "./globals.css";
import { Provider } from "react-redux";
import { store } from "./_lib/redux/store";

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 dark:bg-[#121212]`}>
        <Provider store={store}>
          <main>{children}</main>
        </Provider>
      </body>
    </html>
  );
}
