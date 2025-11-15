import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Home from "@/pages/Home";

const App = () => {
  return (
    <>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <Toaster />
      </div>
    </>
  );
};

export default App;
