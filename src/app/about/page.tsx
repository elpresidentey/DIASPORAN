"use client";

import { motion } from "framer-motion";
import { Users, Globe, Heart, Award, Target, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Community First",
      description: "We believe in connecting the African diaspora and creating meaningful experiences that bring people together."
    },
    {
      icon: Globe,
      title: "Cultural Bridge",
      description: "Bridging the gap between diaspora communities and their homeland through authentic travel experiences."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We strive for excellence in every service we provide, ensuring memorable and safe travel experiences."
    },
    {
      icon: Target,
      title: "Purpose-Driven",
      description: "Our mission is to make African travel accessible, safe, and enjoyable for everyone in the diaspora."
    }
  ];

  const team = [
    {
      name: "Adaora Okafor",
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=400&auto=format&fit=crop",
      bio: "Former Goldman Sachs analyst with a passion for connecting diaspora communities."
    },
    {
      name: "Kwame Asante",
      role: "CTO",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
      bio: "Tech entrepreneur with 10+ years building scalable travel platforms."
    },
    {
      name: "Fatima Hassan",
      role: "Head of Operations",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop",
      bio: "Operations expert ensuring seamless travel experiences across Africa."
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
            About{" "}
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
            Connecting the African diaspora with their roots through unforgettable travel experiences.
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Diasporan was born from a simple yet powerful idea: every member of the African diaspora 
              should have easy, safe, and affordable access to explore their heritage and connect with 
              their roots.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              We&apos;re more than just a travel platform – we&apos;re a bridge between cultures, a facilitator 
              of connections, and a guardian of authentic African experiences.
            </p>
          </motion.div>
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img
              src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=800&auto=format&fit=crop"
              alt="African landscape"
              className="rounded-2xl shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4">Our Values</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            These core values guide everything we do and shape the experiences we create.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <value.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Passionate individuals dedicated to revolutionizing African travel experiences.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-emerald-600 dark:text-emerald-400 font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">50K+</div>
              <div className="text-muted-foreground">Happy Travelers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">25+</div>
              <div className="text-muted-foreground">African Countries</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">1M+</div>
              <div className="text-muted-foreground">Bookings Made</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">99%</div>
              <div className="text-muted-foreground">Satisfaction Rate</div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}