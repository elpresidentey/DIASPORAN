"use client"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { EmptyState } from "@/components/ui/EmptyState"
import { ErrorDisplay } from "@/components/ui/ErrorDisplay"
import { ListSkeleton } from "@/components/ui/ListingSkeleton"
import { PaymentDialog } from "@/components/ui/PaymentDialog"
import { Search, MapPin, Calendar, Star, Wifi, Car, Coffee, ShieldCheck, Home } from "lucide-react"
import { motion } from "framer-motion"
import { fadeInUp, staggerContainer } from "@/lib/animations"
import { useState } from "react"
import { useCachedFetch } from "@/lib/hooks/useCachedFetch"

interface Accommodation {
    id: string;
    name: string;
    description: string;
    property_type: string;
    city: string;
    country: string;
    bedrooms: number;
    bathrooms: number;
    max_guests: number;
    price_per_night: number;
    currency: string;
    amenities: string[];
    images: string[];
    average_rating: number;
    total_reviews: number;
}

export default function StaysPage() {
    const [searchParams, setSearchParams] = useState({
        city: '',
        checkIn: '',
        checkOut: '',
    });
    const [activeSearch, setActiveSearch] = useState(false);
    const [selectedStay, setSelectedStay] = useState<Accommodation | null>(null);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);

    // Use React Query for cached, instant loading
    const { data: stays = [], isLoading, error, refetch } = useCachedFetch<Accommodation[]>({
        endpoint: '/api/stays',
        params: {
            limit: '20',
            ...(activeSearch && searchParams.city && { city: searchParams.city }),
            ...(activeSearch && searchParams.checkIn && { startDate: searchParams.checkIn }),
            ...(activeSearch && searchParams.checkOut && { endDate: searchParams.checkOut }),
        },
        queryKey: ['stays', searchParams.city, searchParams.checkIn, searchParams.checkOut],
    });

    const handleSearch = () => {
        setActiveSearch(true);
        refetch();
    };

    const handleBookStay = (stay: Accommodation) => {
        setSelectedStay(stay);
        setIsPaymentOpen(true);
    };

    if (error) {
        return (
            <div className="min-h-screen bg-background pb-20">
                <section className="relative py-20 px-4">
                    <div className="container mx-auto max-w-5xl">
                        <ErrorDisplay
                            type="network"
                            title="Failed to Load Accommodations"
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
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 dark:opacity-10 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background pointer-events-none" />

                <div className="relative z-10 container mx-auto max-w-5xl">
                    <motion.div
                        className="text-center mb-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">
                            Find Your <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Sanctuary</span>
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Discover verified apartments, hotels, and shortlets for your stay.
                        </p>
                    </motion.div>

                    {/* Search Box */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="glass-strong rounded-[2rem] border border-white/10 max-w-5xl mx-auto overflow-hidden shadow-2xl shadow-black/20">
                            <div className="md:flex items-stretch">
                                {/* Location Input */}
                                <div className="flex-1 p-6 md:p-8 md:border-r border-white/5 relative group transition-colors hover:bg-white/5 cursor-pointer">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-pink-500" /> Location
                                    </label>
                                    <Input
                                        placeholder="Where are you going?"
                                        value={searchParams.city}
                                        onChange={(e) => setSearchParams(prev => ({ ...prev, city: e.target.value }))}
                                        className="h-12 text-xl bg-transparent border-0 px-0 placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none w-full text-foreground font-medium"
                                    />
                                </div>

                                {/* Check-in Input */}
                                <div className="flex-1 p-6 md:p-8 md:border-r border-white/5 relative group transition-colors hover:bg-white/5 cursor-pointer">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-pink-500" /> Check-in
                                    </label>
                                    <Input
                                        type="date"
                                        className="h-12 text-xl bg-transparent border-0 px-0 text-muted-foreground/80 focus:text-foreground focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none w-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer font-medium"
                                        value={searchParams.checkIn}
                                        onChange={(e) => setSearchParams(prev => ({ ...prev, checkIn: e.target.value }))}
                                        placeholder="Add dates"
                                    />
                                    {!searchParams.checkIn && <div className="absolute top-[3.5rem] pointer-events-none text-xl text-muted-foreground/50 font-medium">Add dates</div>}
                                </div>

                                {/* Check-out Input */}
                                <div className="flex-1 p-6 md:p-8 relative group transition-colors hover:bg-white/5 cursor-pointer">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-pink-500" /> Check-out
                                    </label>
                                    <Input
                                        type="date"
                                        className="h-12 text-xl bg-transparent border-0 px-0 text-muted-foreground/80 focus:text-foreground focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none w-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer font-medium"
                                        value={searchParams.checkOut}
                                        onChange={(e) => setSearchParams(prev => ({ ...prev, checkOut: e.target.value }))}
                                        placeholder="Add dates"
                                    />
                                    {!searchParams.checkOut && <div className="absolute top-[3.5rem] pointer-events-none text-xl text-muted-foreground/50 font-medium">Add dates</div>}
                                </div>

                                {/* Search Button */}
                                <div className="p-4 md:p-6 flex items-center justify-center bg-white/5 md:bg-transparent min-w-[140px]">
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full h-full">
                                        <Button
                                            className="w-full h-full min-h-[4rem] rounded-2xl bg-gradient-to-br from-pink-600 to-purple-700 hover:from-pink-500 hover:to-purple-600 text-white shadow-lg shadow-pink-500/25 border-0 flex items-center justify-center gap-2 text-lg font-bold"
                                            onClick={handleSearch}
                                            aria-label="Search"
                                        >
                                            <Search className="w-6 h-6" /> <span className="hidden md:inline">Search</span>
                                        </Button>
                                    </motion.div>
                                </div>
                            </div>
                        </div>

                        <motion.div
                            className="mt-6 flex flex-wrap justify-center gap-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            {["Entire Place", "Private Room", "Hotel", "Verified Host"].map((filter, i) => (
                                <motion.div key={filter} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Badge
                                        variant="outline"
                                        className={`px-4 py-2 rounded-full text-sm cursor-pointer transition-all ${i === 0
                                            ? "bg-pink-500/10 text-pink-500 border-pink-500/50 hover:bg-pink-500/20"
                                            : "bg-secondary/50 text-muted-foreground border-transparent hover:bg-secondary hover:text-foreground"
                                            }`}
                                    >
                                        {filter}
                                    </Badge>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Featured Stays */}
            <section className="container mx-auto px-4 py-10">
                <motion.h2
                    className="text-2xl font-bold mb-6 flex items-center gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <Star className="w-6 h-6 text-yellow-500" />
                    Top Rated Stays
                </motion.h2>

                {isLoading ? (
                    <ListSkeleton count={6} type="accommodation" />
                ) : stays.length === 0 ? (
                    <EmptyState
                        title="No Accommodations Found"
                        message="We couldn't find any stays matching your search. Try different dates or locations."
                        illustration={
                            <div className="mb-6 flex items-center justify-center w-24 h-24 rounded-full bg-pink-500/10">
                                <Home className="w-12 h-12 text-pink-500" />
                            </div>
                        }
                        action={{
                            label: "Browse All Stays",
                            onClick: () => refetch(),
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
                        {stays.map((stay) => (
                            <StayCard key={stay.id} stay={stay} onClick={() => handleBookStay(stay)} />
                        ))}
                    </motion.div>
                )}
            </section>

            {/* Payment Dialog */}
            <PaymentDialog
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                itemType="stay"
                itemName={selectedStay?.name || ""}
                itemPrice={selectedStay?.price_per_night || 0}
                itemCurrency={selectedStay?.currency}
                itemImage={selectedStay?.images?.[0]}
                itemDetails={{
                    location: selectedStay ? `${selectedStay.city}, ${selectedStay.country}` : "",
                    guests: selectedStay?.max_guests,
                    duration: searchParams.checkIn && searchParams.checkOut
                        ? `${searchParams.checkIn} - ${searchParams.checkOut}`
                        : undefined,
                }}
            />
        </div>
    )
}

function StayCard({ stay, onClick }: { stay: Accommodation; onClick: () => void }) {
    const image = stay.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop";

    return (
        <motion.div
            variants={fadeInUp}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="h-full"
        >
            <Card
                onClick={onClick}
                className="overflow-hidden hover:border-pink-500/50 transition-all duration-300 group cursor-pointer glass h-full flex flex-col"
            >
                <div className="relative h-64 overflow-hidden flex-shrink-0">
                    <motion.img
                        src={image}
                        alt={stay.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                        <Badge variant="success" className="backdrop-blur-md bg-green-500/20 text-green-400 border-0">
                            <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                        </Badge>
                    </div>
                </div>
                <CardContent className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex-grow min-w-0">
                            <h3 className="text-xl font-bold text-foreground group-hover:text-pink-400 transition-colors truncate">{stay.name}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{stay.city}, {stay.country}</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-1 text-sm font-medium flex-shrink-0 ml-2">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            {stay.average_rating.toFixed(1)} <span className="text-muted-foreground">({stay.total_reviews})</span>
                        </div>
                    </div>

                    <div className="flex gap-4 my-4 text-muted-foreground text-xs h-5">
                        {stay.amenities.includes('wifi') && <div className="flex items-center gap-1"><Wifi className="w-3 h-3" /> Fast Wifi</div>}
                        {stay.amenities.includes('parking') && <div className="flex items-center gap-1"><Car className="w-3 h-3" /> Parking</div>}
                        {stay.amenities.includes('breakfast') && <div className="flex items-center gap-1"><Coffee className="w-3 h-3" /> Breakfast</div>}
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                        <div>
                            <motion.span
                                className="text-2xl font-bold text-foreground"
                                whileHover={{ scale: 1.1 }}
                            >
                                {stay.currency === 'NGN' ? '₦' : stay.currency}{stay.price_per_night.toLocaleString()}
                            </motion.span>
                            <span className="text-sm text-muted-foreground"> / night</span>
                        </div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button size="sm" className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white border-0">
                                Book Now
                            </Button>
                        </motion.div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
