"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function CardDemoPage() {
  const [clickedCard, setClickedCard] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Enhanced Card Components
        </h1>

        {clickedCard && (
          <div className="mb-6 p-4 bg-purple-500/20 border border-purple-500/50 rounded-lg text-center">
            Clicked: {clickedCard}
          </div>
        )}

        <div className="space-y-12">
          {/* Default Cards */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Default Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Default Card</CardTitle>
                  <CardDescription>
                    Basic card with glassmorphism effect
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    This card has the default styling with backdrop blur and
                    subtle borders.
                  </p>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Elevated Card</CardTitle>
                  <CardDescription>Card with shadow elevation</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    This card has elevated styling with enhanced shadows.
                  </p>
                </CardContent>
              </Card>

              <Card variant="flat">
                <CardHeader>
                  <CardTitle>Flat Card</CardTitle>
                  <CardDescription>Minimal flat design</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    This card has a flat design without backdrop blur.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Hoverable Cards */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Hoverable Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card hoverable>
                <CardHeader>
                  <CardTitle>Hoverable Card</CardTitle>
                  <CardDescription>
                    Hover to see elevation effect
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    This card lifts up and shows a shadow when you hover over
                    it.
                  </p>
                </CardContent>
              </Card>

              <Card hoverable variant="elevated">
                <CardHeader>
                  <CardTitle>Elevated + Hover</CardTitle>
                  <CardDescription>Combined effects</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    This card combines elevated styling with hover effects.
                  </p>
                </CardContent>
              </Card>

              <Card hoverable>
                <CardHeader>
                  <CardTitle>Smooth Transitions</CardTitle>
                  <CardDescription>300ms ease-out animation</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    All hover effects use smooth transitions for a polished
                    feel.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Interactive Cards */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">
              Interactive Cards (Clickable)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card
                clickable
                onClick={() => setClickedCard("Event Card")}
                ariaLabel="View event details"
              >
                <CardHeader>
                  <CardTitle>Event Card</CardTitle>
                  <CardDescription>Click to view details</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    This card is clickable and shows visual affordances on
                    hover.
                  </p>
                </CardContent>
                <CardFooter>
                  <span className="text-sm text-purple-400">
                    Click anywhere →
                  </span>
                </CardFooter>
              </Card>

              <Card
                onClick={() => setClickedCard("Destination Card")}
                ariaLabel="View destination"
              >
                <CardHeader>
                  <CardTitle>Destination</CardTitle>
                  <CardDescription>Lagos, Nigeria</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Cards with onClick handlers automatically become
                    interactive.
                  </p>
                </CardContent>
                <CardFooter>
                  <span className="text-sm text-purple-400">
                    Keyboard accessible
                  </span>
                </CardFooter>
              </Card>

              <Card
                clickable
                onClick={() => setClickedCard("Package Card")}
                ariaLabel="Select package"
              >
                <CardHeader>
                  <CardTitle>VIP Package</CardTitle>
                  <CardDescription>Premium experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Interactive cards support keyboard navigation (Enter/Space).
                  </p>
                </CardContent>
                <CardFooter>
                  <span className="text-sm text-purple-400">
                    Try Tab + Enter
                  </span>
                </CardFooter>
              </Card>
            </div>
          </section>

          {/* Cards with Actions */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Cards with Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Flight Booking</CardTitle>
                  <CardDescription>
                    Lagos to Accra • Dec 20, 2024
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-gray-300">
                    <p>Departure: 10:00 AM</p>
                    <p>Arrival: 11:30 AM</p>
                    <p className="text-2xl font-bold text-white mt-4">$250</p>
                  </div>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button variant="primary" className="flex-1">
                    Book Now
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Details
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Hotel Stay</CardTitle>
                  <CardDescription>
                    Luxury Resort • 3 Nights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-gray-300">
                    <p>Check-in: Dec 20, 2024</p>
                    <p>Check-out: Dec 23, 2024</p>
                    <p className="text-2xl font-bold text-white mt-4">$450</p>
                  </div>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button variant="primary" className="flex-1">
                    Reserve
                  </Button>
                  <Button variant="outline" className="flex-1">
                    View
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </section>

          {/* Loading State */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Loading State</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card loading>
                <CardHeader>
                  <CardTitle>Loading Card</CardTitle>
                  <CardDescription>Content is loading...</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    This card is in a loading state with reduced opacity.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Normal Card</CardTitle>
                  <CardDescription>Fully loaded</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    This card is in its normal state for comparison.
                  </p>
                </CardContent>
              </Card>

              <Card loading clickable>
                <CardHeader>
                  <CardTitle>Loading + Interactive</CardTitle>
                  <CardDescription>Cannot be clicked</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Loading cards have pointer-events disabled.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Mobile Responsive */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">
              Mobile Responsive (Resize window)
            </h2>
            <p className="text-gray-400 mb-4">
              Cards automatically stack vertically on mobile devices with
              appropriate spacing.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} hoverable>
                  <CardHeader>
                    <CardTitle>Card {i}</CardTitle>
                    <CardDescription>Responsive layout</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">
                      This card adapts to different screen sizes.
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
