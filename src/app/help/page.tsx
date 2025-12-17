"use client";

import { motion } from "framer-motion";
import { Search, MessageCircle, Book, Phone, Mail, ChevronRight, HelpCircle, Users, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState } from "react";
import { mockActions } from "@/lib/mockActions";

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const helpCategories = [
    {
      icon: Book,
      title: "Getting Started",
      description: "Learn the basics of using Diasporan for your African travel needs",
      articles: [
        "How to create an account",
        "Booking your first flight",
        "Finding the perfect accommodation",
        "Discovering local events"
      ]
    },
    {
      icon: Users,
      title: "Account & Profile",
      description: "Manage your account settings and personal information",
      articles: [
        "Update your profile information",
        "Change your password",
        "Manage payment methods",
        "Privacy settings"
      ]
    },
    {
      icon: Clock,
      title: "Bookings & Reservations",
      description: "Everything about managing your travel bookings",
      articles: [
        "How to modify a booking",
        "Cancellation policies",
        "Refund process",
        "Travel insurance options"
      ]
    }
  ];

  const quickActions = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help from our support team",
      action: () => mockActions.contactSupport()
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "+234 123 456 7890",
      action: () => mockActions.callPhone("+2341234567890")
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "hello@diasporan.com",
      action: () => mockActions.sendEmail("hello@diasporan.com")
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    mockActions.comingSoon("Help search");
  };

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
            Help{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-400 dark:to-blue-400 bg-clip-text text-transparent">
              Center
            </span>
          </motion.h1>
          <motion.p
            className="text-xl text-muted-foreground mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Find answers to your questions and get the support you need for your African travel journey.
          </motion.p>

          {/* Search Bar */}
          <motion.form
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto flex gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                className="pl-10 h-10"
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" className="h-10">
              Search
            </Button>
          </motion.form>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4">Need Immediate Help?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get in touch with our support team through your preferred channel.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="text-center h-full hover:shadow-lg transition-shadow cursor-pointer" onClick={action.action}>
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                    <action.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{action.title}</h3>
                  <p className="text-muted-foreground text-sm">{action.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Help Categories */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4">Browse Help Topics</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find detailed guides and tutorials organized by category.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {helpCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                    <category.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <CardTitle className="mb-2">{category.title}</CardTitle>
                  <p className="text-muted-foreground text-sm">{category.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.articles.map((article, i) => (
                      <li key={i}>
                        <button
                          onClick={() => mockActions.comingSoon("Help article")}
                          className="flex items-center justify-between w-full text-left text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                        >
                          <span>{article}</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <HelpCircle className="w-16 h-16 mx-auto mb-6 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
            Check out our frequently asked questions or contact our support team for personalized assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => mockActions.comingSoon("FAQ page")}
            >
              View FAQs
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => mockActions.contactSupport()}
            >
              Contact Support
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}