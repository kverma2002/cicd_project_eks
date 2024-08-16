import { Route, Routes } from "react-router-dom"
import Converter from "./pages/converter"
import Header from "./components/ui/Header"

function App() {
  
  return (
    <div className="w-screen min-h-screen dark:bg-slate-950 dark:text-white flex flex-col">
      <Header />
      <Routes>
        <Route path="/" element={<Converter/>} />
      </Routes>

    </div>
  )
}

export default App
