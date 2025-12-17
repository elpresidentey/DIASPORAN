"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, MessageCircle, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState } from "react";
import { mockActions } from "@/lib/mockActions";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Get a response within 24 hours",
      contact: "hello@diasporan.com",
      action: () => mockActions.sendEmail("hello@diasporan.com")
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Mon-Fri, 9AM-6PM WAT",
      contact: "+234 123 456 7890",
      action: () => mockActions.callPhone("+2341234567890")
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Available 24/7 for urgent matters",
      contact: "Start Chat",
      action: () => mockActions.contactSupport()
    }
  ];

  const offices = [
    {
      city: "Lagos",
      country: "Nigeria",
      address: "123 Victoria Island, Lagos, Nigeria",
      phone: "+234 123 456 7890",
      email: "lagos@diasporan.com"
    },
    {
      city: "Accra",
      country: "Ghana",
      address: "456 Airport City, Accra, Ghana",
      phone: "+233 123 456 789",
      email: "accra@diasporan.com"
    },
    {
      city: "London",
      country: "United Kingdom",
      address: "789 Canary Wharf, London, UK",
      phone: "+44 20 1234 5678",
      email: "london@diasporan.com"
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      mockActions.subscribeNewsletter("invalid"); // This will show error
      return;
    }
    mockActions.contactSupport();
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
            Contact{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-400 dark:to-blue-400 bg-clip-text text-transparent">
              Us
            </span>
          </motion.h1>
          <motion.p
            className="text-xl text-muted-foreground mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            We&apos;re here to help make your African travel experience unforgettable. Get in touch with our team.
          </motion.p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose your preferred way to reach us. We&apos;re committed to providing excellent support.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {contactMethods.map((method, index) => (
            <motion.div
              key={method.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="text-center h-full hover:shadow-lg transition-shadow cursor-pointer" onClick={method.action}>
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                    <method.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{method.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{method.description}</p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-medium">{method.contact}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      name="email"
                      type="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <Input
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                  />
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Office Locations */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold mb-6">Our Offices</h3>
            <div className="space-y-6">
              {offices.map((office, index) => (
                <Card key={office.city} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-1">{office.city}, {office.country}</h4>
                        <p className="text-muted-foreground text-sm mb-2">{office.address}</p>
                        <div className="space-y-1">
                          <button
                            onClick={() => mockActions.callPhone(office.phone)}
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Phone className="w-4 h-4" />
                            {office.phone}
                          </button>
                          <button
                            onClick={() => mockActions.sendEmail(office.email)}
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Mail className="w-4 h-4" />
                            {office.email}
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Business Hours */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Clock className="w-16 h-16 mx-auto mb-6 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-3xl font-bold mb-4">Business Hours</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div>
              <h3 className="font-semibold mb-2">Customer Support</h3>
              <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM WAT</p>
              <p className="text-muted-foreground">Saturday: 10:00 AM - 4:00 PM WAT</p>
              <p className="text-muted-foreground">Sunday: Closed</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Emergency Support</h3>
              <p className="text-muted-foreground">Available 24/7 for urgent travel matters</p>
              <p className="text-muted-foreground">Live chat and emergency hotline</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Response Time</h3>
              <p className="text-muted-foreground">Email: Within 24 hours</p>
              <p className="text-muted-foreground">Phone: Immediate</p>
              <p className="text-muted-foreground">Live Chat: Within 5 minutes</p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}