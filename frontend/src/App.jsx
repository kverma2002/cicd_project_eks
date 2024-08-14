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

function App() {
  

  return (
    <div className="w-screen h-screen flex items-center justify-center flex-col dark:bg-slate-950 dark:text-white">
      <NavigationMenu className="dark:text-white absolute top-10">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Components</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[400px] lg:w-[400px] ">
                {components.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink className={navigationMenuTriggerStyle()} href="https://github.com/radix-ui">
              Documentation
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/converter" element={<Converter/>} />
      </Routes>

    </div>
  )
}

export default App
