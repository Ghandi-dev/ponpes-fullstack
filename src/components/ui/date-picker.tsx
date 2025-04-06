"use client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
}

const DatePicker = ({ selected, onSelect }: DatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start text-left font-normal border-primary-foreground hover:bg-color-foreground", !selected && "text-muted-foreground")}
        >
          {selected ? format(selected, "dd MMMM yyyy") : "Pilih Tanggal"}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-primary">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={onSelect}
          initialFocus
          captionLayout="dropdown"
          fromYear={1950}
          toYear={new Date().getFullYear()}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
