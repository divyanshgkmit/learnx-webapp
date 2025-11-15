import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <>
      <div className="min-h-screen bg-slate-950 text-white">
        <Button
          asChild
          size="lg"
          className="min-w-2xs bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg border-0"
        >
          <Link to="/login" className="flex items-center gap-2">
            Click Me
          </Link>
        </Button>
      </div>
    </>
  );
};

export default Home;
