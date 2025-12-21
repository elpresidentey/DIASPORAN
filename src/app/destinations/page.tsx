"use client"

import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { PaymentDialog } from "@/components/ui/PaymentDialog"
import { MapPin, Star, Camera, Users, Clock, ArrowRight, Plane, Calendar } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  highlights: string[];
  bestTime: string;
  currency: string;
  language: string;
  flightPrice: number;
}

const destinations: Destination[] = [
  {
    id: "lagos",
    name: "Lagos",
    country: "Nigeria",
    description: "The commercial capital of Nigeria, known for its vibrant culture, bustling markets, and beautiful beaches.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop",
    rating: 4.5,
    reviews: 1250,
    highlights: ["Victoria Island", "Lekki Beach", "National Theatre", "Balogun Market"],
    bestTime: "Nov - Mar",
    currency: "NGN",
    language: "English, Yoruba",
    flightPrice: 85000
  },
  {
    id: "accra",
    name: "Accra",
    country: "Ghana",
    description: "Ghana's capital city, rich in history with beautiful colonial architecture and vibrant nightlife.",
    image: "https://images.unsplash.com/photo-1580654712603-eb43273aff33?q=80&w=2070&auto=format&fit=crop",
    rating: 4.3,
    reviews: 890,
    highlights: ["Independence Square", "Labadi Beach", "Makola Market", "National Museum"],
    bestTime: "Dec - Mar",
    currency: "GHS",
    language: "English, Twi",
    flightPrice: 120000
  },
  {
    id: "cape-town",
    name: "Cape Town",
    country: "South Africa",
    description: "One of the world's most beautiful cities, nestled between mountains and ocean.",
    image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=2070&auto=format&fit=crop",
    rating: 4.8,
    reviews: 2100,
    highlights: ["Table Mountain", "V&A Waterfront", "Robben Island", "Cape Point"],
    bestTime: "Oct - Apr",
    currency: "ZAR",
    language: "English, Afrikaans",
    flightPrice: 180000
  },
  {
    id: "nairobi",
    name: "Nairobi",
    country: "Kenya",
    description: "The safari capital of Africa, offering urban sophistication and wildlife adventures.",
    image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?q=80&w=2070&auto=format&fit=crop",
    rating: 4.4,
    reviews: 1560,
    highlights: ["Nairobi National Park", "Karen Blixen Museum", "Giraffe Centre", "Maasai Market"],
    bestTime: "Jun - Oct",
    currency: "KES",
    language: "English, Swahili",
    flightPrice: 150000
  },
  {
    id: "marrakech",
    name: "Marrakech",
    country: "Morocco",
    description: "The red city with stunning architecture, bustling souks, and rich cultural heritage.",
    image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?q=80&w=2070&auto=format&fit=crop",
    rating: 4.6,
    reviews: 1890,
    highlights: ["Jemaa el-Fnaa", "Majorelle Garden", "Bahia Palace", "Atlas Mountains"],
    bestTime: "Mar - May, Sep - Nov",
    currency: "MAD",
    language: "Arabic, French",
    flightPrice: 200000
  },
  {
    id: "addis-ababa",
    name: "Addis Ababa",
    country: "Ethiopia",
    description: "The diplomatic capital of Africa, known for its coffee culture and historical significance.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop",
    rating: 4.2,
    reviews: 720,
    highlights: ["Holy Trinity Cathedral", "National Museum", "Merkato Market", "Mount Entoto"],
    bestTime: "Oct - Mar",
    currency: "ETB",
    language: "Amharic, English",
    flightPrice: 140000
  }
];

export default function DestinationsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [bookingType, setBookingType] = useState<"flight" | "stay">("stay");

  const categories = [
    { id: "all", label: "All Destinations" },
    { id: "west-africa", label: "West Africa" },
    { id: "east-africa", label: "East Africa" },
    { id: "southern-africa", label: "Southern Africa" },
    { id: "north-africa", label: "North Africa" }
  ];

  const handleBookFlight = (destination: Destination) => {
    setSelectedDestination(destination);
    setBookingType("flight");
    setIsPaymentOpen(true);
  };

  const handleBookStay = (destination: Destination) => {
    setSelectedDestination(destination);
    setBookingType("stay");
    setIsPaymentOpen(true);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
        
        <div className="relative z-10 container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Discover <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Africa</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-3xl mx-auto">
            Explore the most beautiful destinations across the African continent. From bustling cities to serene landscapes, 
            find your next adventure with our curated travel guides.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "primary" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="text-sm"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination) => (
            <Card key={destination.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={destination.image}
                  alt={destination.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded-full text-sm flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  {destination.rating}
                </div>
              </div>
              
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{destination.name}</CardTitle>
                  <span className="text-sm text-muted-foreground">{destination.country}</span>
                </div>
                <CardDescription className="line-clamp-2">
                  {destination.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {destination.reviews} reviews
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {destination.bestTime}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Top Highlights:</h4>
                  <div className="flex flex-wrap gap-1">
                    {destination.highlights.slice(0, 3).map((highlight, index) => (
                      <span key={index} className="bg-muted px-2 py-1 rounded-full text-xs">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <div className="text-sm text-muted-foreground">From</div>
                    <div className="font-bold text-lg">₦{destination.flightPrice.toLocaleString()}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="gap-1"
                      onClick={() => handleBookFlight(destination)}
                    >
                      <Plane className="w-3 h-3" />
                      Book Flight
                    </Button>
                    <Button 
                      size="sm" 
                      variant="primary" 
                      className="gap-1"
                      onClick={() => handleBookStay(destination)}
                    >
                      <Calendar className="w-3 h-3" />
                      Book Stay
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Travel Tips Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Travel Tips & Guides</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get the most out of your African adventure with our expert travel tips and cultural insights.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center h-full hover:shadow-lg transition-shadow">
              <CardHeader className="p-6">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-6">
                  <Camera className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="mb-3">Photography Guide</CardTitle>
                <CardDescription className="min-h-[4rem] text-sm leading-relaxed">
                  Best spots and times for capturing stunning African landscapes and culture.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center h-full hover:shadow-lg transition-shadow">
              <CardHeader className="p-6">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                  <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="mb-3">Cultural Etiquette</CardTitle>
                <CardDescription className="min-h-[4rem] text-sm leading-relaxed">
                  Learn about local customs, traditions, and respectful travel practices.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center h-full hover:shadow-lg transition-shadow">
              <CardHeader className="p-6">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="mb-3">Hidden Gems</CardTitle>
                <CardDescription className="min-h-[4rem] text-sm leading-relaxed">
                  Discover off-the-beaten-path destinations known only to locals.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
          
          <div className="text-center mt-8">
            <Link href="/blog">
              <Button className="gap-2">
                Read More Tips <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Payment Dialog */}
      <PaymentDialog
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        itemType={bookingType}
        itemId={selectedDestination?.id || "demo-destination"}
        itemName={selectedDestination?.name || ""}
        itemPrice={bookingType === "flight" ? selectedDestination?.flightPrice || 0 : (selectedDestination?.flightPrice || 0) * 0.6} // Stay price is roughly 60% of flight price
        itemCurrency="NGN"
        itemImage={selectedDestination?.image}
        itemDetails={{
          location: selectedDestination ? `${selectedDestination.name}, ${selectedDestination.country}` : "",
          duration: selectedDestination?.bestTime,
        }}
      />
    </div>
  )
}