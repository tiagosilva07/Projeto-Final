import { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Category } from "@/types/categoy";

interface MultiSelectProps {
  options: Category[];
  selected?: number[];
  onChange: (value: number[]) => void;
}

export function MultiSelect({ options, selected = [], onChange }: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  function toggle(id: number) {
    if (selected.includes(id)) {
      onChange(selected.filter((x) => x !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  function remove(id: number) {
    onChange(selected.filter((x) => x !== id));
  }

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            {selected.length === 0
              ? "Select categories"
              : `${selected.length} selected`}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] max-h-80 overflow-y-auto"
          align="start"
        >
          <Command>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem key={opt.id} onSelect={() => toggle(opt.id)}>
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      selected.includes(opt.id) ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {opt.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <div className="flex flex-wrap gap-2">
        {selected.map((id) => {
          const category = options.find((o) => o.id === id);
          if (!category) return null;

          return (
            <Badge
              key={id}
              variant="secondary"
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => remove(id)}
            >
              {category.name}
              <X className="h-3 w-3" />
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
