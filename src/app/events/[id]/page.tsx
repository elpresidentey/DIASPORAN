import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Calendar, MapPin, Clock, Share2, Ticket, ArrowLeft, Users } from "lucide-react"
import Link from "next/link"

export default function EventDetailsPage({ params }: { params: { id: string } }) {
    // Mock data - in a real app, fetch based on params.id
    const event = {
        title: "AfroNation Festival 2025",
        description: "The world's biggest Afrobeats festival returns to Lagos for an unforgettable 3-day experience. Featuring top artists from across the continent and beyond.",
        date: "Dec 28 - 30, 2025",
        time: "4:00 PM - 2:00 AM Daily",
        location: "Tafawa Balewa Square, Lagos Island",
        price: "₦25,000 - ₦150,000",
        image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop",
        lineup: ["Burna Boy", "Wizkid", "Davido", "Tiwa Savage", "Rema", "Asake"],
        attendees: 12500
    }

    return (
        <div className="min-h-screen bg-black pb-20">
            {/* Hero Image */}
            <div className="relative h-[50vh] w-full">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <Link href="/events" className="absolute top-8 left-4 md:left-8 z-10">
                    <Button variant="secondary" size="sm" className="backdrop-blur-md bg-black/50 text-white border-white/10 hover:bg-black/70">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Events
                    </Button>
                </Link>
            </div>

            <div className="container mx-auto px-4 -mt-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">{event.title}</h1>
                            <div className="flex flex-wrap gap-4 text-gray-300">
                                <Badge variant="outline" className="border-gray-500/50 text-gray-400">Festival</Badge>
                                <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {event.date}</div>
                                <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> {event.time}</div>
                                <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {event.location}</div>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
                            <h2 className="text-2xl font-bold mb-4">About the Event</h2>
                            <p className="text-gray-300 leading-relaxed mb-6">
                                {event.description}
                            </p>

                            <h3 className="text-xl font-semibold mb-3 text-orange-400">Lineup</h3>
                            <div className="flex flex-wrap gap-2">
                                {event.lineup.map((artist) => (
                                    <Badge key={artist} variant="secondary" className="bg-white/10 hover:bg-white/20 text-white px-3 py-1">
                                        {artist}
                                    </Badge>
                                ))}
                                <Badge variant="outline" className="border-white/20 text-gray-400">+ More TBA</Badge>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Ticket Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-gray-400">Starting from</span>
                                <span className="text-3xl font-bold text-white">{event.price.split(' - ')[0]}</span>
                            </div>

                            <Button size="lg" className="w-full bg-orange-600 hover:bg-orange-700 text-white mb-4">
                                <Ticket className="w-5 h-5 mr-2" /> Buy Tickets
                            </Button>

                            <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 mb-6">
                                <Share2 className="w-4 h-4 mr-2" /> Share Event
                            </Button>

                            <div className="flex items-center justify-center gap-2 text-sm text-gray-400 border-t border-white/10 pt-4">
                                <Users className="w-4 h-4 text-green-500" />
                                <span className="text-green-500 font-medium">{event.attendees.toLocaleString()}</span> people are going
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
