"use client"

import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Calendar, User, Clock, ArrowRight, BookOpen, Camera, MapPin, Heart } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  readTime: number;
  category: string;
  image: string;
  tags: string[];
}

const blogPosts: BlogPost[] = [
  {
    id: "lagos-food-guide",
    title: "The Ultimate Lagos Food Guide: 10 Must-Try Local Dishes",
    excerpt: "Discover the vibrant culinary scene of Lagos with our comprehensive guide to the city's most delicious local dishes and where to find them.",
    content: "Lagos is a food lover's paradise...",
    author: "Adunni Okafor",
    publishDate: "2024-12-10",
    readTime: 8,
    category: "Food & Culture",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop",
    tags: ["Lagos", "Food", "Culture", "Nigeria"]
  },
  {
    id: "safari-photography-tips",
    title: "Safari Photography: Capturing Africa's Wildlife",
    excerpt: "Learn professional techniques for photographing Africa's incredible wildlife, from the Big Five to beautiful birds.",
    content: "Safari photography requires patience...",
    author: "James Mwangi",
    publishDate: "2024-12-08",
    readTime: 12,
    category: "Photography",
    image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?q=80&w=2070&auto=format&fit=crop",
    tags: ["Safari", "Photography", "Wildlife", "Kenya"]
  },
  {
    id: "cape-town-budget-travel",
    title: "Cape Town on a Budget: 7 Days for Under $500",
    excerpt: "Explore the Mother City without breaking the bank. Our detailed itinerary shows you how to experience Cape Town's best for less.",
    content: "Cape Town doesn't have to be expensive...",
    author: "Sarah van der Merwe",
    publishDate: "2024-12-05",
    readTime: 10,
    category: "Budget Travel",
    image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=2070&auto=format&fit=crop",
    tags: ["Cape Town", "Budget", "South Africa", "Itinerary"]
  },
  {
    id: "ghana-cultural-festivals",
    title: "Ghana's Colorful Festivals: A Cultural Calendar",
    excerpt: "From Homowo to Aboakyir, discover Ghana's rich festival traditions and the best times to experience authentic Ghanaian culture.",
    content: "Ghana's festivals are windows into the soul...",
    author: "Kwame Asante",
    publishDate: "2024-12-03",
    readTime: 6,
    category: "Culture",
    image: "https://images.unsplash.com/photo-1580654712603-eb43273aff33?q=80&w=2070&auto=format&fit=crop",
    tags: ["Ghana", "Festivals", "Culture", "Traditions"]
  },
  {
    id: "morocco-travel-safety",
    title: "Solo Female Travel in Morocco: Safety Tips & Insights",
    excerpt: "Essential safety tips and cultural insights for women traveling alone in Morocco, from Marrakech to the Atlas Mountains.",
    content: "Morocco is generally safe for solo female travelers...",
    author: "Fatima El Mansouri",
    publishDate: "2024-12-01",
    readTime: 9,
    category: "Safety & Tips",
    image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?q=80&w=2070&auto=format&fit=crop",
    tags: ["Morocco", "Solo Travel", "Safety", "Women"]
  },
  {
    id: "ethiopian-coffee-culture",
    title: "Ethiopian Coffee Culture: From Bean to Ceremony",
    excerpt: "Dive deep into Ethiopia's coffee culture, from the birthplace of coffee to the traditional coffee ceremony that brings communities together.",
    content: "Ethiopia is the birthplace of coffee...",
    author: "Hanan Tadesse",
    publishDate: "2024-11-28",
    readTime: 7,
    category: "Culture",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop",
    tags: ["Ethiopia", "Coffee", "Culture", "Traditions"]
  }
];

const categories = [
  { id: "all", label: "All Posts" },
  { id: "culture", label: "Culture" },
  { id: "food", label: "Food & Dining" },
  { id: "photography", label: "Photography" },
  { id: "budget", label: "Budget Travel" },
  { id: "safety", label: "Safety & Tips" }
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const filteredPosts = selectedCategory === "all" 
    ? blogPosts 
    : blogPosts.filter(post => post.category.toLowerCase().includes(selectedCategory));

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-background">
        {/* Article Header */}
        <div className="relative h-96 overflow-hidden">
          <img
            src={selectedPost.image}
            alt={selectedPost.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 pb-8">
              <Button
                variant="outline"
                onClick={() => setSelectedPost(null)}
                className="mb-4 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                ← Back to Blog
              </Button>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 max-w-4xl">
                {selectedPost.title}
              </h1>
              <div className="flex items-center gap-6 text-white/80">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {selectedPost.author}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(selectedPost.publishDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {selectedPost.readTime} min read
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-muted-foreground mb-8">{selectedPost.excerpt}</p>
            <div className="space-y-6 text-foreground">
              <p>
                This is where the full article content would go. In a real implementation, 
                you would fetch the complete article content from your CMS or database.
              </p>
              <p>
                The article would include detailed information, tips, and insights about 
                {selectedPost.title.toLowerCase()}, providing valuable information for travelers 
                interested in exploring Africa.
              </p>
              <p>
                You could include sections like practical tips, personal experiences, 
                recommendations, and beautiful imagery to make the content engaging and useful.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t">
              {selectedPost.tags.map((tag) => (
                <span key={tag} className="bg-muted px-3 py-1 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
        
        <div className="relative z-10 container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Travel <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Stories</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-3xl mx-auto">
            Discover Africa through the eyes of fellow travelers. Get insider tips, cultural insights, 
            and inspiration for your next African adventure.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
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

      {/* Featured Post */}
      {filteredPosts.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold mb-8">Featured Story</h2>
          <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={filteredPosts[0].image}
                  alt={filteredPosts[0].title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {filteredPosts[0].category}
                  </span>
                  <span className="text-muted-foreground text-sm">Featured</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">{filteredPosts[0].title}</h3>
                <p className="text-muted-foreground mb-6 line-clamp-3">
                  {filteredPosts[0].excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {filteredPosts[0].author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {filteredPosts[0].readTime} min
                    </div>
                  </div>
                  <Button onClick={() => setSelectedPost(filteredPosts[0])} className="gap-2">
                    Read More <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="container mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold mb-8">Latest Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.slice(1).map((post) => (
            <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                  onClick={() => setSelectedPost(post)}>
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-primary/90 text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                  {post.category}
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime} min
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mt-4">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="bg-muted px-2 py-1 rounded-full text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4 text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-6 text-primary" />
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get the latest travel stories, tips, and destination guides delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-md border border-border bg-background"
            />
            <Button className="gap-2">
              Subscribe <Heart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}