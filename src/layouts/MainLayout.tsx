import Header from "../shared/components/Header";
import Footer from "../shared/components/Footer";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 pt-[80px]">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}