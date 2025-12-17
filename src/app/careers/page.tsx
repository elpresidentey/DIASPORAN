"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, Users, Briefcase, Heart, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { mockActions } from "@/lib/mockActions";

export default function CareersPage() {
  const benefits = [
    {
      icon: Globe,
      title: "Remote-First Culture",
      description: "Work from anywhere in the world while building the future of African travel."
    },
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health insurance and wellness programs for you and your family."
    },
    {
      icon: Users,
      title: "Learning & Growth",
      description: "Continuous learning opportunities, mentorship programs, and conference attendance."
    },
    {
      icon: Briefcase,
      title: "Equity & Ownership",
      description: "Be part of our success with competitive equity packages for all team members."
    }
  ];

  const openings = [
    {
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Build beautiful, responsive user interfaces for our travel platform using React, Next.js, and TypeScript."
    },
    {
      title: "Product Marketing Manager",
      department: "Marketing",
      location: "Lagos, Nigeria",
      type: "Full-time",
      description: "Drive product adoption and growth through strategic marketing campaigns and partnerships."
    },
    {
      title: "Customer Success Specialist",
      department: "Customer Success",
      location: "Remote",
      type: "Full-time",
      description: "Ensure our travelers have amazing experiences and help them discover the best of Africa."
    },
    {
      title: "Business Development Lead",
      department: "Business Development",
      location: "Accra, Ghana",
      type: "Full-time",
      description: "Build strategic partnerships with hotels, airlines, and local businesses across Africa."
    },
    {
      title: "Data Analyst",
      department: "Analytics",
      location: "Remote",
      type: "Full-time",
      description: "Turn data into insights that drive product decisions and improve user experiences."
    },
    {
      title: "Content Creator",
      department: "Marketing",
      location: "Remote",
      type: "Contract",
      description: "Create engaging content about African destinations, culture, and travel experiences."
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
            Join Our{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-400 dark:to-blue-400 bg-clip-text text-transparent">
              Mission
            </span>
          </motion.h1>
          <motion.p
            className="text-xl text-muted-foreground mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Help us revolutionize travel for the African diaspora and build meaningful connections across continents.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              View Open Positions
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4">Why Join Diasporan?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Be part of a mission-driven team that&apos;s making a real impact on how people connect with their heritage.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Open Positions Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4">Open Positions</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find your next opportunity and help us build the future of African travel.
          </p>
        </motion.div>

        <div className="space-y-6">
          {openings.map((job, index) => (
            <motion.div
              key={job.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                      <p className="text-muted-foreground mb-3 leading-relaxed">{job.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {job.department}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.type}
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <Button 
                        variant="outline" 
                        className="w-full md:w-auto"
                        onClick={() => mockActions.applyForJob(job.title)}
                      >
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Culture Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6">Our Culture</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              We&apos;re building more than just a company – we&apos;re creating a community of passionate individuals 
              who believe in the power of travel to transform lives and connect cultures.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Our team spans across continents, bringing diverse perspectives and experiences that make 
              our platform truly global while staying rooted in African values of ubuntu and community.
            </p>
            <Button 
              variant="outline" 
              size="lg"
              onClick={mockActions.learnAboutValues}
            >
              Learn About Our Values
            </Button>
          </motion.div>
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop"
              alt="Team collaboration"
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
          <h2 className="text-3xl font-bold mb-4">Don&apos;t See Your Role?</h2>
          <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
            We&apos;re always looking for talented individuals who share our passion. 
            Send us your resume and tell us how you&apos;d like to contribute.
          </p>
          <Button 
            size="lg" 
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={mockActions.sendResume}
          >
            Send Us Your Resume
          </Button>
        </motion.div>
      </section>
    </div>
  );
}