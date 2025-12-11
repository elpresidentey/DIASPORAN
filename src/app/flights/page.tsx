"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";
import { ListSkeleton } from "@/components/ui/ListingSkeleton";
import { PaymentDialog } from "@/components/ui/PaymentDialog";
import { Plane, Calendar, MapPin, Search } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { useState } from "react";
import { useCachedFetch } from "@/lib/hooks/useCachedFetch";

interface Flight {
  id: string;
  airline: string;
  flight_number: string;
  origin_airport: string;
  destination_airport: string;
  departure_time: string;
  arrival_time: string;
  duration_minutes: number;
  price: number;
  currency: string;
  class_type: string;
  available_seats: number;
  stops?: number;
}

export default function FlightsPage() {
  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
  });
  const [activeSearch, setActiveSearch] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  // Use React Query for cached, instant loading
  const { data: flights = [], isLoading, error, refetch } = useCachedFetch<Flight[]>({
    endpoint: '/api/flights',
    params: {
      limit: '20',
      ...(activeSearch && searchParams.origin && { origin: searchParams.origin }),
      ...(activeSearch && searchParams.destination && { destination: searchParams.destination }),
      ...(activeSearch && searchParams.departureDate && { departureDate: searchParams.departureDate }),
    },
    queryKey: ['flights', searchParams.origin, searchParams.destination, searchParams.departureDate],
  });

  const handleSearch = () => {
    setActiveSearch(true);
    refetch();
  };

  const handleBookFlight = (flight: Flight) => {
    setSelectedFlight(flight);
    setIsPaymentOpen(true);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <section className="relative py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <ErrorDisplay
              type="network"
              title="Failed to Load Flights"
              message={error instanceof Error ? error.message : 'An error occurred'}
              action={{
                label: "Retry",
                onClick: () => refetch(),
              }}
            />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Search Section */}
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center opacity-20 dark:opacity-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background pointer-events-none" />

        <div className="relative z-10 container mx-auto max-w-5xl">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Find Your Way{" "}
              <span className="bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
                Home
              </span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Compare prices across major airlines for Detty December.
            </p>
          </motion.div>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="glass-strong border-white/10 max-w-4xl mx-auto">
              <CardContent className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                  <div className="md:col-span-3 space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground flex items-center justify-center md:justify-start gap-1">
                      <Plane className="w-3 h-3 rotate-45" /> From
                    </label>
                    <Input
                      placeholder="London (LHR)"
                      value={searchParams.origin}
                      onChange={(e) => setSearchParams(prev => ({ ...prev, origin: e.target.value }))}
                      className="h-10 text-center md:text-left"
                    />
                  </div>
                  <div className="md:col-span-3 space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground flex items-center justify-center md:justify-start gap-1">
                      <MapPin className="w-3 h-3" /> To
                    </label>
                    <Input
                      placeholder="Lagos (LOS)"
                      value={searchParams.destination}
                      onChange={(e) => setSearchParams(prev => ({ ...prev, destination: e.target.value }))}
                      className="h-10 text-center md:text-left"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground flex items-center justify-center md:justify-start gap-1">
                      <Calendar className="w-3 h-3" /> Depart
                    </label>
                    <Input
                      type="date"
                      className="h-10 text-center md:text-left [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                      value={searchParams.departureDate}
                      onChange={(e) => setSearchParams(prev => ({ ...prev, departureDate: e.target.value }))}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground flex items-center justify-center md:justify-start gap-1">
                      <Calendar className="w-3 h-3" /> Return
                    </label>
                    <Input
                      type="date"
                      className="h-10 text-center md:text-left [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                      value={searchParams.returnDate}
                      onChange={(e) => setSearchParams(prev => ({ ...prev, returnDate: e.target.value }))}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        className="w-full h-10 bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-lg shadow-purple-500/30"
                        onClick={handleSearch}
                        aria-label="Search for flights"
                      >
                        <Search className="w-4 h-4 mr-2" /> Search
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Featured Deals */}
      <section className="container mx-auto px-4 py-10">
        <motion.h2
          className="text-2xl font-bold mb-6 flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <Plane className="w-6 h-6 text-purple-500" />
          Popular Flight Deals
        </motion.h2>

        {isLoading ? (
          <ListSkeleton count={6} type="flight" />
        ) : flights.length === 0 ? (
          <EmptyState
            title="No Flights Available"
            message="We couldn't find any flights for your search criteria. Try adjusting your dates or destinations."
            illustration={
              <div className="mb-6 flex items-center justify-center w-24 h-24 rounded-full bg-purple-500/10">
                <Plane className="w-12 h-12 text-purple-500" />
              </div>
            }
            action={{
              label: "Refresh",
              onClick: () => refetch(),
            }}
          />
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {flights.map((flight) => (
              <FlightCard key={flight.id} flight={flight} onClick={() => handleBookFlight(flight)} />
            ))}
          </motion.div>
        )}
      </section>

      {/* Payment Dialog */}
      <PaymentDialog
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        itemType="flight"
        itemName={`${selectedFlight?.airline} - ${selectedFlight?.flight_number}`}
        itemPrice={selectedFlight?.price || 0}
        itemCurrency={selectedFlight?.currency}
        itemDetails={{
          location: selectedFlight ? `${selectedFlight.origin_airport} → ${selectedFlight.destination_airport}` : "",
          date: selectedFlight?.departure_time ? new Date(selectedFlight.departure_time).toLocaleDateString() : "",
          duration: selectedFlight ? `${Math.floor(selectedFlight.duration_minutes / 60)}h ${selectedFlight.duration_minutes % 60}m` : "",
        }}
        // Flight images are usually airline logos, but we can pass a generic flight image if needed
        itemImage="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop"
      />
    </div>
  );
}

function FlightCard({ flight, onClick }: { flight: Flight; onClick: () => void }) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card
        className="h-full overflow-hidden hover:border-purple-500/50 transition-all duration-300 group cursor-pointer border-white/5 bg-black/40 backdrop-blur-md flex flex-col"
        onClick={onClick}
      >
        {/* Card Header - Airline & Price */}
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-xs">
              {flight.airline.charAt(0)}
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">{flight.airline}</h3>
              <p className="text-xs text-muted-foreground">{flight.flight_number}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {flight.currency === 'NGN' ? '₦' : flight.currency}{flight.price.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Flight Path Visual */}
        <div className="p-6 flex-grow flex flex-col justify-center">
          <div className="flex items-center justify-between">
            {/* Origin */}
            <div className="text-center w-1/4">
              <div className="text-3xl font-black text-foreground tracking-tight">{flight.origin_airport}</div>
              <div className="text-sm font-medium text-white/90">{getTime(flight.departure_time)}</div>
              <div className="text-xs text-muted-foreground">{getDate(flight.departure_time)}</div>
            </div>

            {/* Path */}
            <div className="flex-1 flex flex-col items-center px-2">
              <div className="text-xs font-medium text-muted-foreground mb-1">{formatDuration(flight.duration_minutes)}</div>
              <div className="w-full flex items-center relative">
                <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
                <Plane className="w-5 h-5 text-purple-400 absolute left-1/2 -translate-x-1/2 rotate-90 stroke-[2.5px] drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
              </div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1 font-medium">
                {flight.stops === 0 || !flight.stops ? 'Direct' : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}`}
              </div>
            </div>

            {/* Destination */}
            <div className="text-center w-1/4">
              <div className="text-3xl font-black text-foreground tracking-tight">{flight.destination_airport}</div>
              <div className="text-sm font-medium text-white/90">{getTime(flight.arrival_time)}</div>
              <div className="text-xs text-muted-foreground">{getDate(flight.arrival_time)}</div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="px-5 pb-5 pt-0 mt-auto">
          <div className="w-full h-px bg-white/5 mb-4"></div>

          <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
            <Badge variant="outline" className="border-purple-500/30 text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 px-3 py-0.5 h-6">
              {flight.class_type}
            </Badge>
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${flight.available_seats < 5 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
              <span>{flight.available_seats} seats left</span>
            </div>
          </div>

          <Button className="w-full bg-white text-black hover:bg-gray-100 font-bold border-0 h-10 shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-transform active:scale-[0.98]">
            Select Flight
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
