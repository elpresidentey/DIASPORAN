"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { EmptyState } from "@/components/ui/EmptyState"
import { ErrorDisplay } from "@/components/ui/ErrorDisplay"
import { User, Settings, Calendar, Heart, LogOut, Ticket, Clock, Plane, Building, Music, Car, UtensilsCrossed, MapPin, CheckCircle, XCircle, AlertCircle, Edit2, Save, X, Trash2, Camera } from "lucide-react"
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
    booking_type: 'flight' | 'accommodation' | 'event' | 'transport' | 'dining';
    reference_id: string;
    start_date: string;
    end_date?: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    guests: number;
    total_price: number;
    currency: string;
    special_requests?: string;
    metadata?: any;
    created_at: string;
    updated_at: string;
    cancelled_at?: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const { user, loading: authLoading, signOut } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [allBookings, setAllBookings] = useState<Booking[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isLoadingBookings, setIsLoadingBookings] = useState(false);
    const [bookingsError, setBookingsError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
    const [bookingFilter, setBookingFilter] = useState<'all' | 'flight' | 'accommodation' | 'event' | 'transport' | 'dining'>('all');
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        full_name: '',
        phone: '',
        bio: '',
        avatar_url: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    // Fetch user bookings
    const fetchBookings = async () => {
        if (!user?.id) return;
        
        setIsLoadingBookings(true);
        setBookingsError(null);
        
        try {
            const response = await fetch('/api/bookings', {
                headers: {
                    'Authorization': `Bearer ${(user as any).access_token || 'mock-token'}`,
                },
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch bookings');
            }
            
            const result = await response.json();
            
            if (result.success && result.data?.data) {
                const bookingsData = result.data.data;
                setAllBookings(bookingsData);
                
                // Filter upcoming bookings (confirmed and not past)
                const now = new Date();
                const upcomingBookings = bookingsData.filter((booking: Booking) => 
                    booking.status === 'confirmed' && 
                    new Date(booking.start_date) > now
                );
                setBookings(upcomingBookings);
            } else {
                setBookingsError(result.error?.message || 'Failed to load bookings');
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setBookingsError(error instanceof Error ? error.message : 'Failed to load bookings');
        } finally {
            setIsLoadingBookings(false);
        }
    };

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        } else if (user) {
            // Use auth context data directly - no API calls needed
            const profileData = {
                id: user.id || '',
                email: user.email || '',
                full_name: user.user_metadata?.full_name || user.user_metadata?.name || 'User',
                avatar_url: user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
                phone: user.phone || null,
                bio: user.user_metadata?.bio || null,
                created_at: user.created_at || new Date().toISOString(),
            };
            
            setProfile(profileData);
            
            // Initialize edit form with current data
            setEditForm({
                full_name: profileData.full_name || '',
                phone: profileData.phone || '',
                bio: profileData.bio || '',
                avatar_url: profileData.avatar_url || ''
            });
            
            setIsLoadingData(false);
            
            // Fetch bookings
            fetchBookings();
        }
    }, [user, authLoading, router]);

    const handleLogout = async () => {
        await signOut();
        router.push('/');
    };

    const handleEditToggle = () => {
        if (isEditing) {
            // Cancel editing - reset form to current profile data
            setEditForm({
                full_name: profile?.full_name || '',
                phone: profile?.phone || '',
                bio: profile?.bio || '',
                avatar_url: profile?.avatar_url || ''
            });
            setSaveError(null);
        }
        setIsEditing(!isEditing);
    };

    const handleSaveProfile = async () => {
        if (!user || !profile) return;
        
        setIsSaving(true);
        setSaveError(null);
        
        try {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${(user as any).access_token || 'mock-token'}`,
                },
                body: JSON.stringify(editForm)
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Update local profile state
                const updatedProfile = {
                    ...profile,
                    full_name: editForm.full_name,
                    phone: editForm.phone,
                    bio: editForm.bio,
                    avatar_url: editForm.avatar_url
                };
                
                setProfile(updatedProfile);
                setIsEditing(false);
            } else {
                setSaveError(result.error?.message || 'Failed to save profile');
            }
            
        } catch (error) {
            setSaveError(error instanceof Error ? error.message : 'Failed to save profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            return;
        }
        
        try {
            const response = await fetch('/api/profile', { 
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${(user as any)?.access_token || 'mock-token'}`,
                },
            });
            
            const result = await response.json();
            
            if (result.success) {
                await signOut();
                router.push('/');
            } else {
                alert(result.error?.message || 'Failed to delete account');
            }
        } catch (error) {
            alert('Failed to delete account');
        }
    };

    const handleImageUpload = () => {
        // TODO: Implement image upload functionality
        // For now, we'll use a random Unsplash image
        const randomId = Math.floor(Math.random() * 1000);
        const newAvatarUrl = `https://images.unsplash.com/photo-${1472099645785 + randomId}?w=400&h=400&fit=crop&crop=face`;
        setEditForm(prev => ({ ...prev, avatar_url: newAvatarUrl }));
    };

    const handleCancelBooking = async (bookingId: string) => {
        if (!confirm('Are you sure you want to cancel this booking?')) {
            return;
        }
        
        try {
            const response = await fetch(`/api/bookings/${bookingId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${(user as any)?.access_token || 'mock-token'}`,
                },
            });
            
            if (response.ok) {
                // Remove the booking from local state
                setAllBookings(prev => prev.filter(b => b.id !== bookingId));
                // Refresh bookings to get updated data
                fetchBookings();
            } else {
                alert('Failed to cancel booking');
            }
        } catch (error) {
            console.error('Error cancelling booking:', error);
            alert('Failed to cancel booking');
        }
    };

    const handleViewBookingDetails = (booking: Booking) => {
        // TODO: Implement booking details modal or navigation
        alert(`Booking Details:\n\nType: ${getBookingTypeLabel(booking.booking_type)}\nDate: ${formatDate(booking.start_date)}\nGuests: ${booking.guests}\nTotal: ${booking.currency === 'NGN' ? '₦' : booking.currency}${booking.total_price.toLocaleString()}\nStatus: ${booking.status}`);
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
            case 'flight': return Plane;
            case 'accommodation': return Building;
            case 'event': return Music;
            case 'transport': return Car;
            case 'dining': return UtensilsCrossed;
            default: return Calendar;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'confirmed': return CheckCircle;
            case 'cancelled': return XCircle;
            case 'pending': return AlertCircle;
            case 'completed': return CheckCircle;
            default: return AlertCircle;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'text-green-600 dark:text-green-400';
            case 'cancelled': return 'text-gray-500 dark:text-gray-400';
            case 'pending': return 'text-yellow-600 dark:text-yellow-400';
            case 'completed': return 'text-blue-600 dark:text-blue-400';
            default: return 'text-gray-500 dark:text-gray-400';
        }
    };

    const getBookingTypeLabel = (type: string) => {
        switch (type) {
            case 'flight': return 'Flight';
            case 'accommodation': return 'Stay';
            case 'event': return 'Event';
            case 'transport': return 'Transport';
            case 'dining': return 'Dining';
            default: return type;
        }
    };

    // Get bookings based on active tab and filter
    const getDisplayBookings = () => {
        const now = new Date();
        
        let filteredBookings = allBookings;
        
        // Filter by tab (upcoming/history)
        if (activeTab === 'upcoming') {
            filteredBookings = filteredBookings.filter(booking => 
                booking.status === 'confirmed' && 
                new Date(booking.start_date) > now
            );
        } else {
            filteredBookings = filteredBookings.filter(booking => 
                booking.status === 'completed' || 
                booking.status === 'cancelled' ||
                (booking.status === 'confirmed' && new Date(booking.start_date) <= now)
            );
        }
        
        // Filter by booking type
        if (bookingFilter !== 'all') {
            filteredBookings = filteredBookings.filter(booking => 
                booking.booking_type === bookingFilter
            );
        }
        
        return filteredBookings;
    };

    const displayBookings = getDisplayBookings();

    // Calculate booking statistics
    const bookingStats = {
        total: allBookings.length,
        flights: allBookings.filter(b => b.booking_type === 'flight').length,
        stays: allBookings.filter(b => b.booking_type === 'accommodation').length,
        events: allBookings.filter(b => b.booking_type === 'event').length,
        transport: allBookings.filter(b => b.booking_type === 'transport').length,
        dining: allBookings.filter(b => b.booking_type === 'dining').length,
        totalSpent: allBookings
            .filter(b => b.status !== 'cancelled')
            .reduce((sum, b) => sum + b.total_price, 0)
    };

    return (
        <div className="min-h-screen bg-background pb-20 pt-24 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Sidebar */}
                    <div className="md:col-span-1 space-y-6">
                        <Card className="bg-card border-border p-6">
                            <div className="text-center">
                                {/* Profile Image */}
                                <div className="relative inline-block mb-4">
                                    {isEditing ? (
                                        <div className="relative">
                                            <Image
                                                src={editForm.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'}
                                                alt={editForm.full_name || 'Profile'}
                                                width={96}
                                                height={96}
                                                className="w-24 h-24 rounded-full object-cover"
                                            />
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0 bg-background border-border"
                                                onClick={handleImageUpload}
                                            >
                                                <Camera className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ) : profile.avatar_url ? (
                                        <Image
                                            src={profile.avatar_url}
                                            alt={profile.full_name || 'Profile'}
                                            width={96}
                                            height={96}
                                            className="w-24 h-24 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center text-4xl font-bold text-white dark:text-gray-900">
                                            {getInitials()}
                                        </div>
                                    )}
                                </div>

                                {/* Profile Info */}
                                {isEditing ? (
                                    <div className="space-y-3 text-left">
                                        <div>
                                            <label className="text-sm font-medium text-foreground mb-1 block">Full Name</label>
                                            <Input
                                                value={editForm.full_name}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                                                placeholder="Enter your full name"
                                                className="text-center"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-foreground mb-1 block">Phone</label>
                                            <Input
                                                value={editForm.phone}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                                                placeholder="Enter your phone number"
                                                className="text-center"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-foreground mb-1 block">Bio</label>
                                            <Input
                                                value={editForm.bio}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                                                placeholder="Tell us about yourself"
                                                className="text-center"
                                            />
                                        </div>
                                        {saveError && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{saveError}</p>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-xl font-bold text-foreground">{profile.full_name || 'User'}</h2>
                                        <p className="text-muted-foreground text-sm mb-2">{profile.email}</p>
                                        {profile.phone && (
                                            <p className="text-muted-foreground text-sm mb-2">{profile.phone}</p>
                                        )}
                                        {profile.bio && (
                                            <p className="text-muted-foreground text-sm mb-4 italic">&ldquo;{profile.bio}&rdquo;</p>
                                        )}
                                        <Badge variant="outline" className="border-gray-400 dark:border-gray-600 text-gray-600 dark:text-gray-400">
                                            Member since {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                        </Badge>
                                    </>
                                )}

                                {/* Edit/Save Buttons */}
                                <div className="mt-4 flex gap-2 justify-center">
                                    {isEditing ? (
                                        <>
                                            <Button
                                                size="sm"
                                                onClick={handleSaveProfile}
                                                disabled={isSaving}
                                                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
                                            >
                                                {isSaving ? (
                                                    <div className="w-4 h-4 border-2 border-white dark:border-gray-900 border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <Save className="w-4 h-4" />
                                                )}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={handleEditToggle}
                                                disabled={isSaving}
                                                className="border-border"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={handleEditToggle}
                                            className="border-border"
                                        >
                                            <Edit2 className="w-4 h-4 mr-1" />
                                            Edit Profile
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>

                        <nav className="space-y-2">
                            <Button variant="ghost" className="w-full justify-start text-foreground hover:bg-muted">
                                <User className="w-4 h-4 mr-2" /> Personal Info
                            </Button>
                            <Button variant="ghost" className="w-full justify-start text-foreground hover:bg-muted">
                                <Ticket className="w-4 h-4 mr-2" /> My Bookings
                            </Button>
                            <Button variant="ghost" className="w-full justify-start text-foreground hover:bg-muted">
                                <Heart className="w-4 h-4 mr-2" /> Saved Items
                            </Button>
                            <Button variant="ghost" className="w-full justify-start text-foreground hover:bg-muted">
                                <Settings className="w-4 h-4 mr-2" /> Settings
                            </Button>
                            <div className="border-t border-border pt-2 mt-4">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-gray-400 hover:bg-gray-500/10 hover:text-gray-500"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="w-4 h-4 mr-2" /> Sign Out
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-gray-400 hover:bg-gray-500/10 hover:text-gray-500"
                                    onClick={handleDeleteAccount}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" /> Delete Account
                                </Button>
                            </div>
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Booking Statistics */}
                        {allBookings.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Card className="bg-card border-border p-4 text-center">
                                    <div className="text-2xl font-bold text-foreground">{bookingStats.total}</div>
                                    <div className="text-sm text-muted-foreground">Total Bookings</div>
                                </Card>
                                <Card className="bg-card border-border p-4 text-center">
                                    <div className="text-2xl font-bold text-foreground">{bookingStats.events}</div>
                                    <div className="text-sm text-muted-foreground">Events</div>
                                </Card>
                                <Card className="bg-card border-border p-4 text-center">
                                    <div className="text-2xl font-bold text-foreground">{bookingStats.flights}</div>
                                    <div className="text-sm text-muted-foreground">Flights</div>
                                </Card>
                                <Card className="bg-card border-border p-4 text-center">
                                    <div className="text-2xl font-bold text-foreground">₦{bookingStats.totalSpent.toLocaleString()}</div>
                                    <div className="text-sm text-muted-foreground">Total Spent</div>
                                </Card>
                            </div>
                        )}

                        {/* Booking History Tabs */}
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <CardTitle>My Bookings</CardTitle>
                                        <div className="flex gap-2">
                                            <Button
                                                variant={activeTab === 'upcoming' ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => setActiveTab('upcoming')}
                                                className={activeTab === 'upcoming' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'border-border'}
                                            >
                                                Upcoming
                                            </Button>
                                            <Button
                                                variant={activeTab === 'history' ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => setActiveTab('history')}
                                                className={activeTab === 'history' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'border-border'}
                                            >
                                                History
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    {/* Booking Type Filters */}
                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            variant={bookingFilter === 'all' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setBookingFilter('all')}
                                            className={bookingFilter === 'all' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'border-border text-xs'}
                                        >
                                            All Types
                                        </Button>
                                        <Button
                                            variant={bookingFilter === 'flight' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setBookingFilter('flight')}
                                            className={bookingFilter === 'flight' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'border-border text-xs'}
                                        >
                                            Flights
                                        </Button>
                                        <Button
                                            variant={bookingFilter === 'accommodation' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setBookingFilter('accommodation')}
                                            className={bookingFilter === 'accommodation' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'border-border text-xs'}
                                        >
                                            Stays
                                        </Button>
                                        <Button
                                            variant={bookingFilter === 'event' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setBookingFilter('event')}
                                            className={bookingFilter === 'event' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'border-border text-xs'}
                                        >
                                            Events
                                        </Button>
                                        <Button
                                            variant={bookingFilter === 'transport' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setBookingFilter('transport')}
                                            className={bookingFilter === 'transport' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'border-border text-xs'}
                                        >
                                            Transport
                                        </Button>
                                        <Button
                                            variant={bookingFilter === 'dining' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setBookingFilter('dining')}
                                            className={bookingFilter === 'dining' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'border-border text-xs'}
                                        >
                                            Dining
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {isLoadingBookings ? (
                                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                                        <div className="w-8 h-8 border-4 border-gray-300 dark:border-gray-700 border-t-gray-900 dark:border-t-white rounded-full animate-spin"></div>
                                        <p className="text-muted-foreground">Loading bookings...</p>
                                    </div>
                                ) : bookingsError ? (
                                    <ErrorDisplay
                                        type="network"
                                        title="Failed to Load Bookings"
                                        message={bookingsError}
                                        action={{
                                            label: "Retry",
                                            onClick: fetchBookings,
                                        }}
                                    />
                                ) : displayBookings.length === 0 ? (
                                    <EmptyState
                                        title={activeTab === 'upcoming' ? "No Upcoming Plans" : "No Booking History"}
                                        message={activeTab === 'upcoming' 
                                            ? "You don't have any upcoming bookings or events. Start planning your Detty December adventure!"
                                            : "You haven't made any bookings yet. Start exploring flights, stays, and events!"
                                        }
                                        illustration={
                                            <div className="mb-6 flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800">
                                                <Calendar className="w-10 h-10 text-gray-600 dark:text-gray-400" />
                                            </div>
                                        }
                                        action={{
                                            label: activeTab === 'upcoming' ? "Browse Events" : "Start Booking",
                                            onClick: () => router.push("/events"),
                                        }}
                                        className="py-8"
                                    />
                                ) : (
                                    displayBookings.map((booking) => {
                                        const Icon = getBookingIcon(booking.booking_type);
                                        const StatusIcon = getStatusIcon(booking.status);
                                        const statusColor = getStatusColor(booking.status);
                                        
                                        return (
                                            <div key={booking.id} className="flex items-center gap-4 p-4 bg-muted rounded-lg border border-border hover:border-border/80 transition-colors">
                                                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-gray-600 dark:text-gray-400">
                                                    <Icon className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="font-bold text-foreground">{getBookingTypeLabel(booking.booking_type)} Booking</h4>
                                                        <div className={`flex items-center gap-1 ${statusColor}`}>
                                                            <StatusIcon className="w-4 h-4" />
                                                            <span className="text-xs font-medium capitalize">{booking.status}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            {formatDate(booking.start_date)}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <User className="w-4 h-4" />
                                                            {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
                                                        </div>
                                                        <div className="font-medium text-foreground">
                                                            {booking.currency === 'NGN' ? '₦' : booking.currency}{booking.total_price.toLocaleString()}
                                                        </div>
                                                    </div>
                                                    {booking.special_requests && (
                                                        <p className="text-xs text-muted-foreground mt-1 italic">
                                                            &ldquo;{booking.special_requests}&rdquo;
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <Button 
                                                        size="sm" 
                                                        variant="outline" 
                                                        className="border-border" 
                                                        onClick={() => handleViewBookingDetails(booking)}
                                                        aria-label="View booking details"
                                                    >
                                                        View Details
                                                    </Button>
                                                    {booking.status === 'confirmed' && activeTab === 'upcoming' && (
                                                        <Button 
                                                            size="sm" 
                                                            variant="ghost" 
                                                            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" 
                                                            onClick={() => handleCancelBooking(booking.id)}
                                                            aria-label="Cancel booking"
                                                        >
                                                            Cancel
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <Button
                                        variant="outline"
                                        className="h-24 flex items-center justify-center border-border hover:bg-muted p-4 transition-all duration-200 hover:scale-105"
                                        onClick={() => router.push('/flights')}
                                    >
                                        <span className="text-sm font-medium text-center">Book Flight</span>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="h-24 flex items-center justify-center border-border hover:bg-muted p-4 transition-all duration-200 hover:scale-105"
                                        onClick={() => router.push('/stays')}
                                    >
                                        <span className="text-sm font-medium text-center">Find Stay</span>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="h-24 flex items-center justify-center border-border hover:bg-muted p-4 transition-all duration-200 hover:scale-105"
                                        onClick={() => router.push('/events')}
                                    >
                                        <span className="text-sm font-medium text-center">Browse Events</span>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="h-24 flex items-center justify-center border-border hover:bg-muted p-4 transition-all duration-200 hover:scale-105"
                                        onClick={() => router.push('/transport')}
                                    >
                                        <span className="text-sm font-medium text-center">Get Transport</span>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}