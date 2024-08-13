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
      <h1 className="text-4xl font-bold dark:text-white" >Your Own File Converter</h1>
      <p> Host your own file converter locally or on the cloud to make sure your files are secure.</p>

    </div>
  )
}

export default App
