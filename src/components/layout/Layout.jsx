import Header from "./Header";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";
import { InteractiveDotBackground } from "@/pages/Home/InteractiveDotBackground";
import { ROUTES } from "@/constants/routes";

const Layout = () => {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">

      {(pathname === ROUTES.HOME) && (<InteractiveDotBackground />)}

      <div className="relative z-10">
        <Header />
        <main className="pt-4 pb-16">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
