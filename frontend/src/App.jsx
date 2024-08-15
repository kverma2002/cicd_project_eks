import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

import ListItem from "@/components/ui/list-item"
import { components } from "@/constants/components"
import { Route, Routes } from "react-router-dom"
import Home from "./pages/home"
import Converter from "./pages/converter"
import NavMenu from "./components/ui/NavMenu"

function App() {
  
  return (
    <div className="w-screen h-screen dark:bg-slate-950 dark:text-white flex flex-col">
      <NavMenu />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/converter" element={<Converter/>} />
      </Routes>

    </div>
  )
}

export default App
