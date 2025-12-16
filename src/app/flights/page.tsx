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
              <span className="text-gray-700 dark:text-gray-300">
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
                        className="w-full h-10 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 font-semibold"
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
          <Plane className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          Popular Flight Deals
        </motion.h2>

        {isLoading ? (
          <ListSkeleton count={6} type="flight" />
        ) : flights.length === 0 ? (
          <EmptyState
            title="No Flights Available"
            message="We couldn't find any flights for your search criteria. Try adjusting your dates or destinations."
            illustration={
              <div className="mb-6 flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800">
                <Plane className="w-12 h-12 text-gray-600 dark:text-gray-400" />
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="hover:border-gray-400 dark:hover:border-gray-600 transition-colors group cursor-pointer glass"
        onClick={onClick}
      >
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-muted px-3 py-1 rounded text-xs font-medium text-gray-600 dark:text-gray-400">
              {flight.airline}
            </div>
            <motion.span
              className="text-xl font-bold text-foreground"
              whileHover={{ scale: 1.1 }}
            >
              {flight.currency === 'NGN' ? '₦' : flight.currency}{flight.price.toLocaleString()}
            </motion.span>
          </div>

          <div className="flex items-center justify-between mb-4 mt-2">
            <div>
              <div className="text-2xl font-bold">
                {flight.origin_airport}
              </div>
              <div className="text-xs text-muted-foreground">{formatDate(flight.departure_time)}</div>
            </div>
            <div className="flex flex-col items-center px-4 flex-1">
              <div className="text-xs text-muted-foreground mb-1">{formatDuration(flight.duration_minutes)}</div>
              <div className="w-full h-[1px] bg-border relative flex items-center justify-center">
                <Plane className="w-4 h-4 text-muted-foreground absolute rotate-90" />
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{flight.class_type}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {flight.destination_airport}
              </div>
              <div className="text-xs text-muted-foreground">{formatDate(flight.arrival_time)}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-2 rounded mb-4">
            <Calendar className="w-4 h-4" />
            {flight.available_seats} seats available
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 border-0">
              Book Ticket
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
