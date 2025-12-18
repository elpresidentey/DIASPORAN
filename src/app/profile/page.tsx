"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { EmptyState } from "@/components/ui/EmptyState"
import { ErrorDisplay } from "@/components/ui/ErrorDisplay"
import { User, Settings, Calendar, Heart, LogOut, Ticket, Clock } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

interface UserProfile {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    phone: string | null;
    bio: string | null;
    created_at: string;
}

interface Booking {
    id: string;
    booking_type: string;
    start_date: string;
    status: string;
    total_price: number;
    currency: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const { user, loading: authLoading, signOut } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    // Note: Real-time bookings disabled to prevent connection delays when Supabase not configured

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        } else if (user) {
            // Use auth context data directly - no API calls needed
            setProfile({
                id: user.id || '',
                email: user.email || '',
                full_name: user.user_metadata?.full_name || user.user_metadata?.name || 'User',
                avatar_url: user.user_metadata?.avatar_url || null,
                phone: user.phone || null,
                bio: null,
                created_at: user.created_at || new Date().toISOString(),
            });
            setIsLoadingData(false);
        }
    }, [user, authLoading, router]);

    const handleLogout = async () => {
        await signOut();
        router.push('/');
    };

    if (authLoading || isLoadingData) {
        return (
            <div className="min-h-screen bg-background pb-20 pt-24 px-4">
                <div className="container mx-auto max-w-4xl">
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="w-12 h-12 border-4 border-gray-300 dark:border-gray-700 border-t-gray-900 dark:border-t-white rounded-full animate-spin"></div>
                        <p className="text-muted-foreground animate-pulse">Loading usage profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return null; // Redirect handled in useEffect
    }

    // Ensure we have a profile object before rendering
    if (!profile) return null;

    const getInitials = () => {
        if (profile.full_name) {
            const names = profile.full_name.split(' ');
            return names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
        }
        return profile.email[0].toUpperCase();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getBookingIcon = (type: string) => {
        switch (type) {
            case 'event': return Ticket;
            case 'flight': return Calendar;
            default: return Calendar;
        }
    };

    return (
        <div className="min-h-screen bg-background pb-20 pt-24 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Sidebar */}
                    <div className="md:col-span-1 space-y-6">
                        <Card className="bg-card border-border text-center p-6">
                            {profile.avatar_url ? (
                                <Image
                                    src={profile.avatar_url}
                                    alt={profile.full_name || 'Profile'}
                                    width={96}
                                    height={96}
                                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                                />
                            ) : (
                                <div className="w-24 h-24 bg-gray-900 dark:bg-white rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold text-white dark:text-gray-900">
                                    {getInitials()}
                                </div>
                            )}
                            <h2 className="text-xl font-bold text-foreground">{profile.full_name || 'User'}</h2>
                            <p className="text-muted-foreground text-sm mb-4">{profile.email}</p>
                            <Badge variant="outline" className="border-gray-400 dark:border-gray-600 text-gray-600 dark:text-gray-400">
                                Member since {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </Badge>
                        </Card>

                        <nav className="space-y-2">
                            <Button variant="ghost" className="w-full justify-start text-foreground hover:bg-muted">
                                <User className="w-4 h-4 mr-2" /> Personal Info
                            </Button>
                            <Button variant="ghost" className="w-full justify-start text-foreground hover:bg-muted">
                                <Ticket className="w-4 h-4 mr-2" /> My Tickets
                            </Button>
                            <Button variant="ghost" className="w-full justify-start text-foreground hover:bg-muted">
                                <Heart className="w-4 h-4 mr-2" /> Saved Items
                            </Button>
                            <Button variant="ghost" className="w-full justify-start text-foreground hover:bg-muted">
                                <Settings className="w-4 h-4 mr-2" /> Settings
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-red-400 hover:bg-red-500/10 hover:text-red-500"
                                onClick={handleLogout}
                            >
                                <LogOut className="w-4 h-4 mr-2" /> Sign Out
                            </Button>
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle>Upcoming Plans</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {bookings.length === 0 ? (
                                    <EmptyState
                                        title="No Upcoming Plans"
                                        message="You don't have any upcoming bookings or events. Start planning your Detty December adventure!"
                                        illustration={
                                            <div className="mb-6 flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800">
                                                <Calendar className="w-10 h-10 text-gray-600 dark:text-gray-400" />
                                            </div>
                                        }
                                        action={{
                                            label: "Browse Events",
                                            onClick: () => router.push("/events"),
                                        }}
                                        className="py-8"
                                    />
                                ) : (
                                    bookings.map((booking) => {
                                        const Icon = getBookingIcon(booking.booking_type);
                                        return (
                                            <div key={booking.id} className="flex items-center gap-4 p-4 bg-muted rounded-lg border border-border hover:border-border/80 transition-colors">
                                                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-gray-600 dark:text-gray-400">
                                                    <Icon className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-foreground capitalize">{booking.booking_type} Booking</h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        {formatDate(booking.start_date)} • {booking.currency === 'NGN' ? '₦' : booking.currency}{booking.total_price.toLocaleString()}
                                                    </p>
                                                </div>
                                                <Button size="sm" variant="outline" className="border-border" aria-label="View booking details">
                                                    View Details
                                                </Button>
                                            </div>
                                        );
                                    })
                                )}
                            </CardContent>
                        </Card>

                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <EmptyState
                                    title="No Recent Activity"
                                    message="Your recent bookings and interactions will appear here."
                                    illustration={
                                        <div className="mb-6 flex items-center justify-center w-20 h-20 rounded-full bg-gray-800/50">
                                            <Clock className="w-10 h-10 text-gray-500" />
                                        </div>
                                    }
                                    className="py-8"
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
