import LayoutProvider from "@/components/LayoutProvider";
import "./globals.css";
import "@/stylessheets/commonClasses.css";
import "@/stylessheets/customClasses.css";
import ReduxStoreProvider from "@/components/ReduxStoreProvider";

export const metadata = {
  title: "RentCar",
  description: "Rent A Car",
};

export default function RootLayout({ children }: any) {
  return (
    <ReduxStoreProvider>
      <LayoutProvider>{children}</LayoutProvider>
    </ReduxStoreProvider>
  );
}