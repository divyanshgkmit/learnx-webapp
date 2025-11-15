import { Routes, Route } from 'react-router-dom'
import { Toaster } from "@/components/ui/sonner"
import Home from '@/pages/Home'

function App() {
  return (
    <>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <Toaster />
      </div>
    </>
  )
}

export default App