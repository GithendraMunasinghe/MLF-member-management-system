"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Props {
  label: string;
  onChange?: (date: string) => void;
}

export default function DatePickerInput({ label, onChange }: Props) {
  const [date, setDate] = useState<Date | undefined>();

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);

    if (selectedDate) {
      onChange?.(format(selectedDate, "yyyy-MM-dd"));
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-500 font-medium">
        {label}
      </label>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />

            {date ? (
              format(date, "yyyy-MM-dd")
            ) : (
              <span className="text-gray-400">Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}