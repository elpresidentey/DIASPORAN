"use client";

import { motion } from "framer-motion";
import { Handshake, Globe, Users, Award, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { mockActions } from "@/lib/mockActions";

export default function PartnersPage() {
  const partnerTypes = [
    {
      icon: Globe,
      title: "Travel Partners",
      description: "Airlines, hotels, and local tour operators providing authentic African travel experiences and accommodations.",
      benefits: ["Exclusive rates", "Priority booking", "Marketing support"]
    },
    {
      icon: Users,
      title: "Community Partners", 
      description: "Diaspora organizations and cultural groups connecting communities worldwide through shared heritage and experiences.",
      benefits: ["Event partnerships", "Community discounts", "Cultural exchange programs"]
    },
    {
      icon: Handshake,
      title: "Business Partners",
      description: "Financial services, insurance providers, and technology companies supporting seamless travel operations and growth.",
      benefits: ["Revenue sharing", "Co-marketing opportunities", "Technical integration"]
    },
    {
      icon: Award,
      title: "Government Partners",
      description: "Tourism boards and government agencies promoting African destinations while ensuring traveler safety and compliance.",
      benefits: ["Policy collaboration", "Destination marketing", "Safety partnerships"]
    }
  ];

  const currentPartners = [
    {
      name: "Ethiopian Airlines",
      logo: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?q=80&w=100&auto=format&fit=crop",
      category: "Airline Partner",
      description: "Exclusive flight deals and priority booking services for diaspora travelers across Africa and beyond."
    },
    {
      name: "Kempinski Hotels",
      logo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=100&auto=format&fit=crop",
      category: "Hospitality Partner", 
      description: "Luxury accommodations and premium hospitality services across major African cities and destinations."
    },
    {
      name: "Ghana Tourism Authority",
      logo: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=80&w=100&auto=format&fit=crop",
      category: "Government Partner",
      description: "Official partnership promoting Ghana as a premier heritage destination for diaspora tourism and cultural exploration."
    },
    {
      name: "Flutterwave",
      logo: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=100&auto=format&fit=crop",
      category: "Fintech Partner",
      description: "Secure payment processing and financial services enabling seamless transactions across African markets and currencies."
    }
  ];

  const benefits = [
    "Access to 500K+ active diaspora travelers",
    "Marketing support and co-branded campaigns", 
    "Technical integration and API access",
    "Dedicated partner success manager",
    "Performance analytics and insights",
    "Priority customer support"
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
            Partner with{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-400 dark:to-blue-400 bg-clip-text text-transparent">
              Diasporan
            </span>
          </motion.h1>
          <motion.p
            className="text-xl text-muted-foreground mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Join us in connecting the African diaspora with their heritage through meaningful travel experiences.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Become a Partner
            </Button>
          </motion.div>
        </div>
      </section>
      {/* Partnership Types Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4">Partnership Opportunities</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We work with various types of partners to create comprehensive travel experiences for the African diaspora.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {partnerTypes.map((type, index) => (
            <motion.div
              key={type.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6">
                    <type.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{type.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4 min-h-[4rem] text-sm">{type.description}</p>
                  <div className="space-y-2">
                    {type.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Current Partners Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4">Our Partners</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We&apos;re proud to work with leading organizations across Africa and the diaspora.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentPartners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{partner.name}</h3>
                        <span className="px-2 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded text-xs">
                          {partner.category}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">{partner.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6">Why Partner with Us?</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Join a growing ecosystem of partners serving the African diaspora market. 
              Our platform connects you with engaged travelers seeking authentic African experiences.
            </p>
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop"
              alt="Partnership collaboration"
              className="rounded-2xl shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Partner?</h2>
          <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
            Let&apos;s discuss how we can work together to create amazing experiences for the African diaspora.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={mockActions.applyToPartner}
            >
              <Handshake className="w-5 h-5 mr-2" />
              Apply to Partner
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={mockActions.downloadPartnershipGuide}
            >
              Download Partnership Guide
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}