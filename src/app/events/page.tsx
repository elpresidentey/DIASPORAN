"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";
import { Calendar, MapPin, Search, Ticket, Clock, Music } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { useState, useEffect } from "react";
import { useRealtimeListings } from "@/lib/hooks";

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  start_date: string;
  end_date: string;
  location: string;
  city: string;
  country: string;
  capacity: number;
  available_spots: number;
  ticket_types: any[];
  images: string[];
  average_rating: number;
  total_reviews: number;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Set up real-time subscription for events
  useRealtimeListings({
    listingType: 'events',
    onInsert: (listing) => {
      setEvents(prev => [listing as Event, ...prev]);
    },
    onUpdate: (listing) => {
      setEvents(prev => prev.map(e => e.id === listing.id ? listing as Event : e));
    },
    onDelete: (listing) => {
      setEvents(prev => prev.filter(e => e.id !== listing.id));
    },
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setError(null);
      
      const params = new URLSearchParams({ limit: '20' });
      if (searchQuery) params.append('search', searchQuery);
      
      const url = `/api/events?${params}`;
      console.log('[Events Page] Fetching from:', url);
      
      const response = await fetch(url);
      
      console.log('[Events Page] Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      const data = await response.json();
      
      console.log('[Events Page] Response data:', {
        success: data.success,
        hasData: !!data.data,
        dataType: typeof data.data,
        isArray: Array.isArray(data.data),
        dataLength: Array.isArray(data.data) ? data.data.length : 'N/A',
        nestedDataLength: data.data?.data?.length || 'N/A'
      });
      
      if (data.success) {
        // Handle both direct array and paginated response
        const eventsArray = Array.isArray(data.data) ? data.data : (data.data?.data || []);
        console.log('[Events Page] Setting events:', eventsArray.length, 'items');
        setEvents(eventsArray);
      } else {
        throw new Error(data.error?.message || 'Failed to load events');
      }
    } catch (err) {
      console.error('[Events Page] Error fetching events:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleSearch = () => {
    fetchEvents();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <section className="relative py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <ErrorDisplay
              type="network"
              title="Failed to Load Events"
              message={error}
              action={{
                label: "Retry",
                onClick: fetchEvents,
              }}
            />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 dark:opacity-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background pointer-events-none" />

        <div className="relative z-10 container mx-auto max-w-5xl text-center">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Detty December{" "}
            <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              Vibes
            </span>
          </motion.h1>
          <motion.p
            className="text-muted-foreground text-lg mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            The ultimate guide to concerts, beach parties, and cultural
            festivals.
          </motion.p>

          {/* Search & Filter */}
          <motion.div
            className="max-w-3xl mx-auto flex gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                className="pl-10 h-10 glass border-white/10 text-center md:text-left"
                placeholder="Search events, artists, or venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                className="h-10 bg-orange-700 hover:bg-orange-800 text-white font-semibold shadow-lg shadow-orange-500/30"
                onClick={handleSearch}
              >
                Find Events
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-6 flex flex-wrap justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {[
              "All Events",
              "Concerts",
              "Beach Parties",
              "Festivals",
              "Arts & Culture",
            ].map((category, i) => (
              <motion.div
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={i === 0 ? "outline" : "ghost"}
                  size="sm"
                  className={`rounded-full ${i === 0 ? "border-border hover:bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                >
                  {category}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="container mx-auto px-4 py-10">
        {events.length === 0 ? (
          <EmptyState
            title="No Events Found"
            message="We couldn't find any events matching your criteria. Try adjusting your search or check back later for new events."
            illustration={
              <div className="mb-6 flex items-center justify-center w-24 h-24 rounded-full bg-orange-500/10">
                <Music className="w-12 h-12 text-orange-500" />
              </div>
            }
            action={{
              label: "Browse All Events",
              onClick: fetchEvents,
            }}
          />
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
}

function EventCard({ event }: { event: Event }) {
  const image = event.images[0] || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop";
  const startDate = new Date(event.start_date);
  const formattedDate = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const formattedTime = startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const minPrice = event.ticket_types.length > 0 
    ? Math.min(...event.ticket_types.map((t: any) => t.price))
    : 0;

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/events/${event.id}`}>
        <Card className="overflow-hidden hover:border-orange-500/50 transition-all duration-300 group h-full glass">
          <div className="relative h-48 overflow-hidden">
            <motion.img
              src={image}
              alt={event.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.5 }}
            />
            <div className="absolute top-4 left-4">
              <Badge className="bg-orange-500 text-white border-0 hover:bg-orange-600">
                {event.category}
              </Badge>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
              <div className="flex items-center gap-2 text-white font-bold">
                <Calendar className="w-4 h-4 text-orange-500" /> {formattedDate}
              </div>
            </div>
          </div>
          <CardContent className="p-5">
            <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-orange-400 transition-colors line-clamp-1">
              {event.title}
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" /> {formattedTime}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {event.city}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <div className="text-foreground font-bold">
                {minPrice > 0 ? `From ₦${minPrice.toLocaleString()}` : 'Free'}
              </div>
              <motion.div whileHover={{ x: 5 }}>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 p-0"
                >
                  Get Tickets <Ticket className="w-4 h-4 ml-1" />
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
