"use client";

import { motion } from "framer-motion";
import { FileText, Calendar, Shield, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function TermsPage() {
  const lastUpdated = "December 17, 2024";

  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: `By accessing and using Diasporan's services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`
    },
    {
      title: "2. Service Description",
      content: `Diasporan is a travel platform that connects users with flights, accommodations, events, and transportation services across Africa. We act as an intermediary between you and service providers, facilitating bookings and providing travel-related information.`
    },
    {
      title: "3. User Accounts",
      content: `To access certain features of our service, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.`
    },
    {
      title: "4. Booking and Payment Terms",
      content: `All bookings are subject to availability and confirmation by the service provider. Prices are displayed in Nigerian Naira (NGN) and may be subject to change until payment is completed. Payment must be made in full at the time of booking unless otherwise specified.`
    },
    {
      title: "5. Cancellation and Refund Policy",
      content: `Cancellation and refund policies vary by service provider and booking type. Specific terms will be clearly displayed during the booking process. Refunds, when applicable, will be processed within 5-10 business days to the original payment method.`
    },
    {
      title: "6. Travel Documentation",
      content: `You are responsible for ensuring you have all necessary travel documents, including valid passports, visas, and health certificates. Diasporan is not responsible for any issues arising from inadequate or incorrect travel documentation.`
    },
    {
      title: "7. Limitation of Liability",
      content: `Diasporan acts as an intermediary and is not liable for the actions, errors, omissions, representations, warranties, breaches, or negligence of service providers. Our liability is limited to the amount paid for the specific service in question.`
    },
    {
      title: "8. User Conduct",
      content: `You agree not to use our service for any unlawful purpose or in any way that could damage, disable, overburden, or impair our service. You must not attempt to gain unauthorized access to any part of our service or systems.`
    },
    {
      title: "9. Intellectual Property",
      content: `All content on Diasporan, including text, graphics, logos, images, and software, is the property of Diasporan or its licensors and is protected by copyright and other intellectual property laws.`
    },
    {
      title: "10. Privacy Policy",
      content: `Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices regarding the collection and use of your personal information.`
    },
    {
      title: "11. Modifications to Terms",
      content: `We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of the service after changes are posted constitutes acceptance of the modified terms.`
    },
    {
      title: "12. Governing Law",
      content: `These terms are governed by the laws of Nigeria. Any disputes arising from these terms or your use of our service will be subject to the exclusive jurisdiction of Nigerian courts.`
    },
    {
      title: "13. Contact Information",
      content: `If you have any questions about these Terms of Service, please contact us at legal@diasporan.com or through our contact page.`
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
            <FileText className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-4xl md:text-6xl font-bold">
              Terms of{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-400 dark:to-blue-400 bg-clip-text text-transparent">
                Service
              </span>
            </h1>
          </motion.div>
          <motion.p
            className="text-xl text-muted-foreground mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Please read these terms carefully before using Diasporan's services.
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

      {/* Important Notice */}
      <section className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 max-w-4xl mx-auto">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Important Notice</h3>
                  <p className="text-amber-700 dark:text-amber-300 text-sm leading-relaxed">
                    These Terms of Service constitute a legally binding agreement between you and Diasporan. 
                    By using our services, you acknowledge that you have read, understood, and agree to be bound by these terms.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Terms Content */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
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
          <Shield className="w-16 h-16 mx-auto mb-6 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-3xl font-bold mb-4">Questions About Our Terms?</h2>
          <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
            If you have any questions or concerns about these Terms of Service, our legal team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.open('mailto:legal@diasporan.com?subject=Terms of Service Inquiry', '_blank')}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
            >
              Contact Legal Team
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