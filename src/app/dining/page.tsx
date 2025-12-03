"use client"

import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { EmptyState } from "@/components/ui/EmptyState"
import { ErrorDisplay } from "@/components/ui/ErrorDisplay"
import { Utensils, MapPin, Star, ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
import { useRealtimeListings } from "@/lib/hooks"

interface DiningVenue {
    id: string;
    name: string;
    description: string;
    cuisine_type: string[];
    price_range: number;
    address: string;
    city: string;
    country: string;
    images: string[];
    amenities: string[];
    average_rating: number;
    total_reviews: number;
}

export default function DiningPage() {
    const [restaurants, setRestaurants] = useState<DiningVenue[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Set up real-time subscription for dining venues
    useRealtimeListings({
        listingType: 'dining_venues',
        onInsert: (listing) => {
            setRestaurants(prev => [listing as DiningVenue, ...prev]);
        },
        onUpdate: (listing) => {
            setRestaurants(prev => prev.map(r => r.id === listing.id ? listing as DiningVenue : r));
        },
        onDelete: (listing) => {
            setRestaurants(prev => prev.filter(r => r.id !== listing.id));
        },
    });

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            setError(null);
            
            const url = '/api/dining?limit=20';
            console.log('[Dining Page] Fetching from:', url);
            
            const response = await fetch(url);
            
            console.log('[Dining Page] Response status:', response.status, response.statusText);
            
            if (!response.ok) {
                throw new Error('Failed to fetch restaurants');
            }
            
            const data = await response.json();
            
            console.log('[Dining Page] Response data:', {
                success: data.success,
                hasData: !!data.data,
                dataType: typeof data.data,
                isArray: Array.isArray(data.data),
                dataLength: Array.isArray(data.data) ? data.data.length : 'N/A',
                nestedDataLength: data.data?.data?.length || 'N/A'
            });
            
            if (data.success && data.data) {
                // Handle both direct array and paginated response
                const restaurantsArray = Array.isArray(data.data) ? data.data : (data.data?.data || []);
                console.log('[Dining Page] Setting restaurants:', restaurantsArray.length, 'items');
                setRestaurants(restaurantsArray);
            } else {
                throw new Error(data.error?.message || 'Failed to load restaurants');
            }
        } catch (err) {
            console.error('[Dining Page] Error fetching restaurants:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    if (error) {
        return (
            <div className="min-h-screen bg-background pb-20">
                <section className="relative py-20 px-4">
                    <div className="container mx-auto max-w-5xl">
                        <ErrorDisplay
                            type="network"
                            title="Failed to Load Restaurants"
                            message={error}
                            action={{
                                label: "Retry",
                                onClick: fetchRestaurants,
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
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 dark:opacity-10 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background pointer-events-none" />

                <div className="relative z-10 container mx-auto max-w-5xl text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        Taste of <span className="bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent">Home</span>
                    </h1>
                    <p className="text-muted-foreground text-lg mb-8">
                        Curated list of top restaurants and local delicacies.
                    </p>
                </div>
            </section>

            {/* Restaurant Listings */}
            <section className="container mx-auto px-4">
                {restaurants.length === 0 ? (
                    <EmptyState
                        title="No Restaurants Found"
                        message="We couldn't find any restaurants in this area. Try searching in a different location."
                        illustration={
                            <div className="mb-6 flex items-center justify-center w-24 h-24 rounded-full bg-yellow-500/10">
                                <Utensils className="w-12 h-12 text-yellow-500" />
                            </div>
                        }
                        action={{
                            label: "Refresh",
                            onClick: fetchRestaurants,
                        }}
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {restaurants.map((restaurant) => (
                            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}

function RestaurantCard({ restaurant }: { restaurant: DiningVenue }) {
    const priceSymbol = '$'.repeat(restaurant.price_range);
    const image = restaurant.images[0] || "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070&auto=format&fit=crop";
    
    return (
        <Card className="overflow-hidden hover:border-yellow-500/50 transition-all duration-300 group cursor-pointer bg-card border-border" clickable ariaLabel={`View details for ${restaurant.name}`}>
            <div className="relative h-56 overflow-hidden">
                <img src={image} alt={restaurant.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-4 right-4">
                    <Badge className="bg-background/60 backdrop-blur-md text-foreground border-border">
                        {priceSymbol}
                    </Badge>
                </div>
            </div>
            <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-yellow-400 transition-colors">{restaurant.name}</h3>
                        <p className="text-sm text-muted-foreground">{restaurant.cuisine_type.join(', ')}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium bg-yellow-500/10 px-2 py-1 rounded text-yellow-500">
                        <Star className="w-3 h-3 fill-yellow-500" /> {restaurant.average_rating.toFixed(1)}
                    </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <MapPin className="w-4 h-4" /> {restaurant.city}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    {restaurant.amenities.slice(0, 2).map(amenity => (
                        <Badge key={amenity} variant="outline" className="text-xs border-border text-muted-foreground">
                            {amenity}
                        </Badge>
                    ))}
                </div>

                <Button size="sm" className="w-full bg-muted hover:bg-muted/80 text-foreground border-0" aria-label={`Reserve table at ${restaurant.name}`}>
                    Reserve Table <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </CardContent>
        </Card>
    )
}
