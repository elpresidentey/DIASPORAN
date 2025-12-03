"use client"

import { Input } from "@/components/ui/Input"
import { Card, CardContent } from "@/components/ui/Card"
import { useState } from "react"

export default function InputDemoPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");

  // Simple validation
  const emailError = email && !email.includes('@') ? 'Please enter a valid email address' : undefined;
  const passwordError = password && password.length < 8 ? 'Password must be at least 8 characters' : undefined;

  return (
    <div className="min-h-screen bg-black py-20 px-4">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Enhanced Input Component Demo
        </h1>

        <Card className="glass-strong border-white/10 mb-8">
          <CardContent className="p-8 space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Form Examples</h2>

            {/* Basic Input with Label */}
            <Input
              label="Username"
              value={username}
              onChange={setUsername}
              placeholder="Enter your username"
              helperText="Choose a unique username"
            />

            {/* Email Input with Validation */}
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              error={emailError}
              required
            />

            {/* Password Input with Validation */}
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Enter your password"
              error={passwordError}
              helperText="Must be at least 8 characters"
              required
            />

            {/* Phone Input */}
            <Input
              label="Phone Number"
              type="tel"
              value={phone}
              onChange={setPhone}
              placeholder="+234 800 000 0000"
              helperText="Include country code"
            />

            {/* Disabled Input */}
            <Input
              label="Account Type"
              value="Premium Member"
              onChange={() => {}}
              disabled
              helperText="Contact support to change your account type"
            />
          </CardContent>
        </Card>

        <Card className="glass-strong border-white/10">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Accessibility Features</h2>
            <ul className="space-y-2 text-gray-300">
              <li>✓ Label association with htmlFor</li>
              <li>✓ Error states with inline validation messages</li>
              <li>✓ Helper text support</li>
              <li>✓ Focus highlighting with glow effects</li>
              <li>✓ ARIA-describedby and ARIA-invalid attributes</li>
              <li>✓ Proper color contrast for all states</li>
              <li>✓ Minimum 44x44px touch targets</li>
              <li>✓ Backward compatible with legacy usage</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
