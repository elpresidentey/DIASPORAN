"use client";

import { motion } from "framer-motion";
import { Shield, Calendar, Lock, Eye, Database, UserCheck, Globe, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function PrivacyPage() {
  const lastUpdated = "December 17, 2024";

  const privacySections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: `We collect information you provide directly to us, such as when you create an account, make a booking, or contact us. This includes your name, email address, phone number, payment information, and travel preferences. We also automatically collect certain information about your device and how you interact with our service.`
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: `We use your information to provide, maintain, and improve our services, process transactions, send you confirmations and updates, provide customer support, and communicate with you about our services. We may also use your information for security purposes and to comply with legal obligations.`
    },
    {
      icon: Globe,
      title: "Information Sharing",
      content: `We share your information with service providers (airlines, hotels, event organizers) to fulfill your bookings, with payment processors to handle transactions, and with trusted third-party service providers who assist us in operating our platform. We do not sell your personal information to third parties.`
    },
    {
      icon: Lock,
      title: "Data Security",
      content: `We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption of sensitive data, secure servers, and regular security assessments.`
    },
    {
      icon: UserCheck,
      title: "Your Rights and Choices",
      content: `You have the right to access, update, or delete your personal information. You can manage your communication preferences, opt out of marketing emails, and request a copy of your data. You may also have additional rights depending on your location and applicable privacy laws.`
    }
  ];

  const dataTypes = [
    {
      category: "Account Information",
      details: "Name, email address, phone number, password, profile picture"
    },
    {
      category: "Booking Information",
      details: "Travel dates, destinations, passenger details, payment information"
    },
    {
      category: "Usage Information",
      details: "Pages visited, search queries, booking history, preferences"
    },
    {
      category: "Device Information",
      details: "IP address, browser type, operating system, device identifiers"
    },
    {
      category: "Communication Data",
      details: "Support messages, feedback, survey responses, marketing preferences"
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
              Privacy{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-400 dark:to-blue-400 bg-clip-text text-transparent">
                Policy
              </span>
            </h1>
          </motion.div>
          <motion.p
            className="text-xl text-muted-foreground mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </motion.p>
          <motion.div
            className="flex items-center justify-center gap-2 text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Calendar className="w-4 h-4" />
            <span>Last updated: {lastUpdated}</span>
          </motion.div>
        </div>
      </section>

      {/* Privacy Commitment */}
      <section className="container mx-auto px-4 py-8">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-4">Our Privacy Commitment</h2>
              <p className="text-emerald-700 dark:text-emerald-300 leading-relaxed max-w-3xl mx-auto">
                At Diasporan, we are committed to protecting your privacy and ensuring the security of your personal information. 
                We believe in transparency about how we collect, use, and share your data, and we give you control over your information.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Main Privacy Sections */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {privacySections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <section.icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Data Types We Collect */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">Types of Information We Collect</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dataTypes.map((type, index) => (
              <motion.div
                key={type.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-3 text-emerald-600 dark:text-emerald-400">
                      {type.category}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{type.details}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Your Rights */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-center mb-8">Your Privacy Rights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Access Your Data</h4>
                      <p className="text-muted-foreground text-sm">Request a copy of the personal information we have about you.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Update Information</h4>
                      <p className="text-muted-foreground text-sm">Correct or update your personal information at any time.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Delete Your Account</h4>
                      <p className="text-muted-foreground text-sm">Request deletion of your account and associated data.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Control Communications</h4>
                      <p className="text-muted-foreground text-sm">Manage your email preferences and opt out of marketing.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Data Portability</h4>
                      <p className="text-muted-foreground text-sm">Export your data in a commonly used format.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Object to Processing</h4>
                      <p className="text-muted-foreground text-sm">Object to certain uses of your personal information.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl p-8 text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Mail className="w-16 h-16 mx-auto mb-6 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-3xl font-bold mb-4">Questions About Your Privacy?</h2>
          <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
            If you have any questions about this Privacy Policy or how we handle your personal information, please don&apos;t hesitate to contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.open('mailto:privacy@diasporan.com?subject=Privacy Policy Inquiry', '_blank')}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
            >
              Contact Privacy Team
            </button>
            <button
              onClick={() => window.location.href = '/contact'}
              className="px-6 py-3 border border-border hover:bg-muted rounded-lg font-semibold transition-colors"
            >
              General Contact
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}