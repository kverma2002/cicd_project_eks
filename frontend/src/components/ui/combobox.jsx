"use client"

import * as React from "react"
import { Check, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { formats_image, formats_video } from "@/constants/components"

export function Combobox({ currentFormat, onFormatChange }) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  React.useEffect(() => {
    setValue(currentFormat);
  }, [currentFormat]);

  const formatsList = (currentFormat === "image") ? formats_image : formats_video;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[128px] justify-between flex"
        >
          <span className="">
            {value
              ? formatsList.find((format) => format.value === value)?.label
              : "Select format..."}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          {/* <CommandInput placeholder="Search formats..." /> */}
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              <div className="grid grid-cols-3 gap-2">
              {formatsList.map((format) => (
                <CommandItem
                  key={format.value}
                  value={format.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue);
                    onFormatChange(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === format.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {format.label}
                </CommandItem>
              ))}
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
