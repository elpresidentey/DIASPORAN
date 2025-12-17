"use client";

import { motion } from "framer-motion";
import { Shield, AlertTriangle, Phone, MapPin, Heart, Users, FileText, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { mockActions } from "@/lib/mockActions";

export default function SafetyPage() {
  const safetyTips = [
    {
      icon: FileText,
      title: "Travel Documentation",
      tips: [
        "Ensure your passport is valid for at least 6 months",
        "Check visa requirements for your destination",
        "Keep digital and physical copies of important documents",
        "Register with your embassy or consulate"
      ]
    },
    {
      icon: Heart,
      title: "Health & Medical",
      tips: [
        "Get required vaccinations 4-6 weeks before travel",
        "Pack a comprehensive first aid kit",
        "Research local healthcare facilities",
        "Consider travel health insurance"
      ]
    },
    {
      icon: Users,
      title: "Personal Safety",
      tips: [
        "Stay aware of your surroundings at all times",
        "Avoid displaying expensive items publicly",
        "Use reputable transportation services",
        "Share your itinerary with trusted contacts"
      ]
    },
    {
      icon: Globe,
      title: "Cultural Awareness",
      tips: [
        "Research local customs and traditions",
        "Dress appropriately for the culture",
        "Learn basic phrases in the local language",
        "Respect religious and cultural sites"
      ]
    }
  ];

  const emergencyContacts = [
    {
      country: "Nigeria",
      police: "199",
      medical: "199",
      fire: "199",
      tourist: "+234 1 460 5500"
    },
    {
      country: "Ghana",
      police: "191",
      medical: "193",
      fire: "192",
      tourist: "+233 302 682 681"
    },
    {
      country: "Kenya",
      police: "999",
      medical: "999",
      fire: "999",
      tourist: "+254 20 271 1262"
    },
    {
      country: "South Africa",
      police: "10111",
      medical: "10177",
      fire: "10177",
      tourist: "+27 12 444 6000"
    }
  ];

  const safetyResources = [
    {
      title: "Travel Advisories",
      description: "Check current travel advisories and safety alerts for your destination",
      action: () => mockActions.externalLink("https://travel.state.gov", "Travel Advisories")
    },
    {
      title: "Embassy Locator",
      description: "Find your nearest embassy or consulate for assistance",
      action: () => mockActions.comingSoon("Embassy locator")
    },
    {
      title: "Travel Insurance",
      description: "Protect yourself with comprehensive travel insurance coverage",
      action: () => mockActions.comingSoon("Travel insurance")
    },
    {
      title: "Safety Checklist",
      description: "Download our comprehensive pre-travel safety checklist",
      action: () => mockActions.downloadMediaAsset("Safety Checklist PDF")
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-blue-500/5 to-purple-500/10" />
        <div className="relative z-10 container mx-auto max-w-4xl text-center">
          <motion.div
            className="flex items-center justify-center gap-3 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Shield className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-4xl md:text-6xl font-bold">
              Travel{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-400 dark:to-blue-400 bg-clip-text text-transparent">
                Safety
              </span>
            </h1>
          </motion.div>
          <motion.p
            className="text-xl text-muted-foreground mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Your safety is our priority. Get essential tips and resources for safe travel across Africa.
          </motion.p>
        </div>
      </section>

      {/* Safety Tips */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4">Essential Safety Tips</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Follow these guidelines to ensure a safe and enjoyable travel experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {safetyTips.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <category.icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {category.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 mt-2" />
                        <span className="text-muted-foreground text-sm leading-relaxed">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4">Emergency Contacts</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Important emergency numbers for popular African destinations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {emergencyContacts.map((country, index) => (
            <motion.div
              key={country.country}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="text-center h-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    {country.country}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <div className="font-semibold text-red-600 dark:text-red-400">Police</div>
                    <div className="text-muted-foreground">{country.police}</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-blue-600 dark:text-blue-400">Medical</div>
                    <div className="text-muted-foreground">{country.medical}</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-orange-600 dark:text-orange-400">Fire</div>
                    <div className="text-muted-foreground">{country.fire}</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-emerald-600 dark:text-emerald-400">Tourist Help</div>
                    <div className="text-muted-foreground text-xs">{country.tourist}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Safety Resources */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4">Safety Resources</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Access helpful resources to plan and prepare for safe travel.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {safetyResources.map((resource, index) => (
            <motion.div
              key={resource.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer" onClick={resource.action}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3">{resource.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{resource.description}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Access Resource
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Emergency Alert */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          className="bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-2xl p-8 text-center max-w-4xl mx-auto border border-red-200 dark:border-red-800"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <AlertTriangle className="w-16 h-16 mx-auto mb-6 text-red-600 dark:text-red-400" />
          <h2 className="text-3xl font-bold mb-4 text-red-800 dark:text-red-200">In Case of Emergency</h2>
          <p className="text-red-700 dark:text-red-300 text-lg mb-6 max-w-2xl mx-auto">
            If you're in immediate danger or need urgent assistance while traveling, contact local emergency services first, 
            then reach out to your embassy or consulate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => mockActions.callPhone("911")}
            >
              <Phone className="w-4 h-4 mr-2" />
              Emergency Services
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-950"
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