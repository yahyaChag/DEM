"use client";

import React from 'react';
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon, Users } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from 'next/navigation';

export function BookingSearch({ className }: { className?: string }) {
  const router = useRouter();
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 2)),
  });
  const [guests, setGuests] = React.useState("2");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (date?.from) params.set('checkin', format(date.from, 'yyyy-MM-dd'));
    if (date?.to) params.set('checkout', format(date.to, 'yyyy-MM-dd'));
    if (guests) params.set('guests', guests);
    
    router.push(`/chambres?${params.toString()}`);
  };

  return (
    <div className={cn("bg-white p-4 rounded-lg shadow-xl lantern-glow flex flex-col md:flex-row gap-4 items-end", className)}>
      <div className="flex-1 w-full flex flex-col gap-2">
        <label className="text-sm font-medium text-mahogany">Dates du séjour</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal border-terracotta/30",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-terracotta" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "d MMM yyyy", { locale: fr })} -{" "}
                    {format(date.to, "d MMM yyyy", { locale: fr })}
                  </>
                ) : (
                  format(date.from, "d MMM yyyy", { locale: fr })
                )
              ) : (
                <span>Sélectionner vos dates</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
              locale={fr}
              disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex-1 w-full flex flex-col gap-2">
        <label className="text-sm font-medium text-mahogany">Personnes</label>
        <Select value={guests} onValueChange={setGuests}>
          <SelectTrigger className="w-full border-terracotta/30">
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4 text-terracotta" />
              <SelectValue placeholder="Personnes" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 Personne</SelectItem>
            <SelectItem value="2">2 Personnes</SelectItem>
            <SelectItem value="3">3 Personnes</SelectItem>
            <SelectItem value="4">4 Personnes</SelectItem>
            <SelectItem value="5">5+ Personnes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleSearch} className="w-full md:w-auto bg-terracotta hover:bg-mahogany text-white h-10 px-8">
        Rechercher
      </Button>
    </div>
  );
}
