"use client"

import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Car, MapPin, Shield, Users, Clock, ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
import { ErrorDisplay } from "@/components/ui/ErrorDisplay"
import { EmptyState } from "@/components/ui/EmptyState"

interface TransportOption {
    id: string;
    provider: string;
    transport_type: string;
    route_name: string;
    origin: string;
    destination: string;
    price: number;
    currency: string;
    available_seats: number;
}

export default function TransportPage() {
    const [transportOptions, setTransportOptions] = useState<TransportOption[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTransportOptions();
    }, []);

    const fetchTransportOptions = async () => {
        try {
            setError(null);
            
            const url = '/api/transport?limit=10';
            console.log('[Transport Page] Fetching from:', url);
            
            const response = await fetch(url);
            
            console.log('[Transport Page] Response status:', response.status, response.statusText);
            
            if (!response.ok) {
                throw new Error('Failed to fetch transport options');
            }
            
            const data = await response.json();
            
            console.log('[Transport Page] Response data:', {
                success: data.success,
                hasData: !!data.data,
                dataType: typeof data.data,
                isArray: Array.isArray(data.data),
                dataLength: Array.isArray(data.data) ? data.data.length : 'N/A',
                nestedDataLength: data.data?.data?.length || 'N/A'
            });
            
            if (data.success && data.data) {
                // Handle both direct array and paginated response
                const transportArray = Array.isArray(data.data) ? data.data : (data.data?.data || []);
                console.log('[Transport Page] Setting transport options:', transportArray.length, 'items');
                setTransportOptions(transportArray);
            } else {
                throw new Error(data.error?.message || 'Failed to load transport options');
            }
        } catch (err) {
            console.error('[Transport Page] Error fetching transport:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    if (error) {
        return (
            <div className="min-h-screen bg-black pb-20">
                <section className="relative py-20 px-4">
                    <div className="container mx-auto max-w-5xl">
                        <ErrorDisplay
                            type="network"
                            title="Failed to Load Transport Options"
                            message={error}
                            action={{
                                label: "Retry",
                                onClick: fetchTransportOptions,
                            }}
                        />
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black pb-20">
            {/* Hero Section */}
            <section className="relative py-20 px-4">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black pointer-events-none" />

                <div className="relative z-10 container mx-auto max-w-5xl text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        Move Around <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Safely</span>
                    </h1>
                    <p className="text-gray-400 text-lg mb-8">
                        Reliable transportation options for your daily commute and airport pickups.
                    </p>
                </div>
            </section>

            {/* Transport Options */}
            <section className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Ride Hailing */}
                    <Card className="bg-black/40 border-white/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Car className="w-6 h-6 text-green-500" /> Ride Hailing
                            </CardTitle>
                            <CardDescription>Request a ride instantly from top providers.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:border-green-500/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center font-bold text-white border border-white/10">UB</div>
                                    <div>
                                        <div className="font-bold text-white">Uber</div>
                                        <div className="text-xs text-gray-400">Reliable rides</div>
                                    </div>
                                </div>
                                <Button size="sm" className="bg-white text-black hover:bg-gray-200">Open App</Button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:border-green-500/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center font-bold text-white">B</div>
                                    <div>
                                        <div className="font-bold text-white">Bolt</div>
                                        <div className="text-xs text-gray-400">Fast & affordable</div>
                                    </div>
                                </div>
                                <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white border-0">Open App</Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Airport Pickup */}
                    <Card className="bg-black/40 border-white/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-6 h-6 text-blue-500" /> Airport Pickup
                            </CardTitle>
                            <CardDescription>Schedule a verified driver for your arrival.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="p-6 bg-blue-500/10 rounded-xl border border-blue-500/20 mb-6">
                                <div className="flex items-start gap-3">
                                    <Shield className="w-5 h-5 text-blue-400 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-blue-400 mb-1">Verified Drivers</h4>
                                        <p className="text-sm text-gray-400">All our airport pickup partners are vetted for safety and reliability.</p>
                                    </div>
                                </div>
                            </div>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                Schedule Pickup <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Available Transport Routes */}
                {transportOptions.length > 0 ? (
                    <Card className="bg-black/40 border-white/10">
                        <CardHeader>
                            <CardTitle>Available Routes</CardTitle>
                            <CardDescription>Pre-scheduled transport services</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {transportOptions.map((option) => (
                                <div key={option.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:border-blue-500/30 transition-colors">
                                    <div className="flex-1">
                                        <div className="font-bold text-white">{option.route_name}</div>
                                        <div className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                                            <MapPin className="w-3 h-3" />
                                            {option.origin} → {option.destination}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {option.transport_type} • {option.available_seats} seats available
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-white">{option.currency === 'NGN' ? '₦' : option.currency}{option.price.toLocaleString()}</div>
                                        <Button size="sm" variant="outline" className="mt-2 border-white/10">
                                            Book Now
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ) : (
                    <EmptyState
                        title="No Routes Available"
                        message="There are currently no scheduled transport routes. Check back later or use ride-hailing services."
                        illustration={
                            <div className="mb-6 flex items-center justify-center w-24 h-24 rounded-full bg-blue-500/10">
                                <Car className="w-12 h-12 text-blue-500" />
                            </div>
                        }
                    />
                )}
            </section>
        </div>
    )
}
