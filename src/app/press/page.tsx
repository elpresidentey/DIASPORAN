"use client";

import { motion } from "framer-motion";
import { Calendar, Download, ExternalLink, Award, Users, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function PressPage() {
  const pressReleases = [
    {
      date: "December 15, 2024",
      title: "Diasporan Raises $10M Series A to Revolutionize African Travel",
      excerpt: "Leading travel platform for the African diaspora secures funding to expand across 15 new countries and enhance safety features.",
      category: "Funding"
    },
    {
      date: "November 28, 2024",
      title: "Detty December 2024: Record-Breaking Bookings as Diaspora Returns Home",
      excerpt: "Platform reports 300% increase in bookings for December travel, highlighting growing trend of heritage tourism.",
      category: "Industry News"
    },
    {
      date: "October 10, 2024",
      title: "Diasporan Partners with Major African Airlines for Exclusive Deals",
      excerpt: "Strategic partnerships with Ethiopian Airlines, Kenya Airways, and South African Airways bring exclusive discounts to users.",
      category: "Partnership"
    },
    {
      date: "September 5, 2024",
      title: "New Safety Features Launch: Real-Time Travel Alerts and Emergency Support",
      excerpt: "Enhanced safety dashboard provides 24/7 support and real-time updates for travelers across Africa.",
      category: "Product"
    },
    {
      date: "August 20, 2024",
      title: "Diasporan Wins 'Best Travel Innovation' at African Tech Awards",
      excerpt: "Recognition for outstanding contribution to connecting diaspora communities with their heritage through technology.",
      category: "Awards"
    }
  ];

  const mediaKit = [
    {
      title: "Company Logo Pack",
      description: "High-resolution logos in various formats (PNG, SVG, EPS)",
      size: "2.5 MB"
    },
    {
      title: "Brand Guidelines",
      description: "Complete brand identity guidelines and usage instructions",
      size: "8.1 MB"
    },
    {
      title: "Executive Photos",
      description: "Professional headshots of leadership team",
      size: "15.3 MB"
    },
    {
      title: "Product Screenshots",
      description: "High-quality screenshots of platform features",
      size: "12.7 MB"
    }
  ];

  const stats = [
    {
      icon: Users,
      value: "500K+",
      label: "Active Users",
      description: "Diaspora travelers using our platform"
    },
    {
      icon: TrendingUp,
      value: "300%",
      label: "YoY Growth",
      description: "Year-over-year booking growth"
    },
    {
      icon: Award,
      value: "25+",
      label: "Countries",
      description: "African destinations covered"
    }
  ];

  const coverage = [
    {
      outlet: "TechCrunch",
      title: "How Diasporan is Making African Travel Accessible",
      date: "Dec 2024",
      logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=100&auto=format&fit=crop"
    },
    {
      outlet: "Forbes Africa",
      title: "The Rise of Heritage Tourism in Africa",
      date: "Nov 2024",
      logo: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?q=80&w=100&auto=format&fit=crop"
    },
    {
      outlet: "CNN Travel",
      title: "Detty December: Africa's Biggest Travel Season",
      date: "Nov 2024",
      logo: "https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?q=80&w=100&auto=format&fit=crop"
    },
    {
      outlet: "BBC Africa",
      title: "Tech Startups Connecting Diaspora to Home",
      date: "Oct 2024",
      logo: "https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?q=80&w=100&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-blue-500/5 to-purple-500/10" />
        <div className="relative z-10 container mx-auto max-w-4xl text-center">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Press &{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-400 dark:to-blue-400 bg-clip-text text-transparent">
              Media
            </span>
          </motion.h1>
          <motion.p
            className="text-xl text-muted-foreground mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Latest news, press releases, and media resources about Diasporan&apos;s mission to connect the African diaspora.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Download Media Kit
            </Button>
            <Button size="lg" variant="outline">
              Contact Press Team
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">{stat.value}</div>
                <div className="font-semibold mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Press Releases Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4">Latest Press Releases</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Stay updated with our latest announcements, partnerships, and company milestones.
          </p>
        </motion.div>

        <div className="space-y-6">
          {pressReleases.map((release, index) => (
            <motion.div
              key={release.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-sm font-medium">
                          {release.category}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {release.date}
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{release.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{release.excerpt}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Read More
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Media Coverage Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4">Media Coverage</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            See what leading publications are saying about Diasporan and the future of African travel.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coverage.map((article, index) => (
            <motion.div
              key={article.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={article.logo}
                      alt={article.outlet}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-emerald-600 dark:text-emerald-400 mb-1">{article.outlet}</div>
                      <h3 className="font-semibold mb-2 leading-tight">{article.title}</h3>
                      <div className="text-sm text-muted-foreground">{article.date}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Media Kit Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4">Media Kit</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Download our complete media kit with logos, brand guidelines, and high-resolution assets.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mediaKit.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground text-sm mb-2">{item.description}</p>
                      <span className="text-xs text-muted-foreground">{item.size}</span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4">Press Inquiries</h2>
          <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
            For press inquiries, interview requests, or additional information, please contact our media team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              press@diasporan.com
            </Button>
            <Button size="lg" variant="outline">
              +234 123 456 7890
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}