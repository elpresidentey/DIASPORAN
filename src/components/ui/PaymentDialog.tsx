"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CreditCard, Calendar, Lock, Check, AlertCircle, User, Mail, Phone } from "lucide-react"
import { Button } from "./Button"
import { Input } from "./Input"
import { Card } from "./Card"

interface PaymentDialogProps {
    isOpen: boolean
    onClose: () => void
    itemType: "flight" | "stay" | "event"
    itemName: string
    itemPrice: number
    itemCurrency?: string
    itemImage?: string
    itemDetails?: {
        date?: string
        location?: string
        duration?: string
        guests?: number
    }
}

export function PaymentDialog({
    isOpen,
    onClose,
    itemType,
    itemName,
    itemPrice,
    itemCurrency = "NGN",
    itemImage,
    itemDetails,
}: PaymentDialogProps) {
    const [step, setStep] = useState<"details" | "payment" | "success">("details")
    const [isProcessing, setIsProcessing] = useState(false)
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
    })

    const handlePayment = async () => {
        setIsProcessing(true)
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000))
        setIsProcessing(false)
        setStep("success")
    }

    const resetAndClose = () => {
        setStep("details")
        setFormData({
            fullName: "",
            email: "",
            phone: "",
            cardNumber: "",
            expiryDate: "",
            cvv: "",
        })
        onClose()
    }

    const currencySymbol = itemCurrency === "NGN" ? "₦" : itemCurrency === "USD" ? "$" : itemCurrency

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={resetAndClose}
                    />

                    {/* Dialog */}
                    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            className="w-full max-w-sm pointer-events-auto"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        >
                            <Card className="bg-[#0f0f23]/95 backdrop-blur-xl border-white/10 overflow-hidden shadow-2xl shadow-black/50 text-white ring-1 ring-white/10 max-h-[85vh] flex flex-col">
                                {/* Header */}
                                <div className="relative h-24 shrink-0 overflow-hidden">
                                    {itemImage ? (
                                        <img src={itemImage} alt={itemName} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f23] via-[#0f0f23]/40 to-transparent" />

                                    {/* Close Button */}
                                    <button
                                        onClick={resetAndClose}
                                        className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white/70 hover:text-white transition-colors border border-white/10 z-10"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>

                                    {/* Title */}
                                    <div className="absolute bottom-3 left-4 right-4">
                                        <h2 className="text-lg font-bold text-white mb-0.5 shadow-sm truncate pr-2">{itemName}</h2>
                                        {itemDetails?.location && (
                                            <p className="text-white/80 text-[10px] flex items-center gap-1">
                                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                {itemDetails.location}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4 overflow-y-auto custom-scrollbar flex-1">
                                    {/* Step Indicator */}
                                    <div className="flex items-center justify-center mb-5">
                                        <div className="flex items-center gap-2">
                                            <StepIndicator active={step === "details"} completed={step !== "details"} number={1} label="Details" />
                                            <div className="w-8 h-0.5 bg-white/10 rounded-full" />
                                            <StepIndicator active={step === "payment"} completed={step === "success"} number={2} label="Payment" />
                                            <div className="w-8 h-0.5 bg-white/10 rounded-full" />
                                            <StepIndicator active={step === "success"} completed={false} number={3} label="Confirm" />
                                        </div>
                                    </div>

                                    {/* Step Content */}
                                    <AnimatePresence mode="wait">
                                        {step === "details" && (
                                            <motion.div
                                                key="details"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="space-y-3"
                                            >
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="text-xs font-medium text-white/70 mb-1 flex items-center gap-1.5">
                                                            <User className="w-3.5 h-3.5 text-muted-foreground" /> Full Name
                                                        </label>
                                                        <Input
                                                            className="h-9 text-sm bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary/50"
                                                            placeholder="e.g. Ebuka Obi-Uchendu"
                                                            value={formData.fullName}
                                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="text-xs font-medium text-white/70 mb-1 flex items-center gap-1.5">
                                                            <Mail className="w-3.5 h-3.5 text-muted-foreground" /> Email Address
                                                        </label>
                                                        <Input
                                                            type="email"
                                                            className="h-9 text-sm bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary/50"
                                                            placeholder="name@example.com"
                                                            value={formData.email}
                                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="text-xs font-medium text-white/70 mb-1 flex items-center gap-1.5">
                                                            <Phone className="w-3.5 h-3.5 text-muted-foreground" /> Phone Number
                                                        </label>
                                                        <Input
                                                            type="tel"
                                                            className="h-9 text-sm bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary/50"
                                                            placeholder="+234 800 000 0000"
                                                            value={formData.phone}
                                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Summary */}
                                                <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                                                    <div className="flex justify-between items-center mb-0.5">
                                                        <span className="text-xs text-white/60">Total Amount</span>
                                                        <span className="text-2xl font-bold text-white tracking-tight">
                                                            {currencySymbol}{itemPrice.toLocaleString()}
                                                        </span>
                                                    </div>
                                                    {itemDetails?.duration && (
                                                        <p className="text-[10px] text-muted-foreground font-medium">{itemDetails.duration}</p>
                                                    )}
                                                </div>

                                                <Button
                                                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold h-10 text-sm shadow-md shadow-primary/20 border-0"
                                                    size="sm"
                                                    onClick={() => setStep("payment")}
                                                    disabled={!formData.fullName || !formData.email || !formData.phone}
                                                >
                                                    Continue to Payment <Check className="w-3.5 h-3.5 ml-1.5" />
                                                </Button>
                                            </motion.div>
                                        )}

                                        {step === "payment" && (
                                            <motion.div
                                                key="payment"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="space-y-5"
                                            >
                                                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 flex gap-3">
                                                    <Lock className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <h4 className="text-sm font-medium text-green-400">Bank-Grade Security</h4>
                                                        <p className="text-xs text-white/50 mt-1">All transactions are encrypted with 256-bit SSL technology. We do not store your card details.</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="text-xs font-medium text-white/70 mb-1 flex items-center gap-1.5">
                                                            <CreditCard className="w-3.5 h-3.5 text-muted-foreground" /> Card Number
                                                        </label>
                                                        <div className="relative">
                                                            <Input
                                                                className="h-9 text-sm bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary/50 pl-9 tracking-widest"
                                                                placeholder="0000 0000 0000 0000"
                                                                value={formData.cardNumber}
                                                                onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                                                                maxLength={19}
                                                            />
                                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex gap-1">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-red-500/50"></div>
                                                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50"></div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="text-xs font-medium text-white/70 mb-1 flex items-center gap-1.5">
                                                                <Calendar className="w-3.5 h-3.5 text-muted-foreground" /> Expiry
                                                            </label>
                                                            <Input
                                                                className="h-9 text-sm bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary/50 text-center"
                                                                placeholder="MM/YY"
                                                                value={formData.expiryDate}
                                                                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                                                maxLength={5}
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="text-xs font-medium text-white/70 mb-1 flex items-center gap-1.5">
                                                                <Lock className="w-3.5 h-3.5 text-muted-foreground" /> CVV
                                                            </label>
                                                            <Input
                                                                className="h-9 text-sm bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary/50 text-center tracking-widest"
                                                                placeholder="123"
                                                                type="password"
                                                                value={formData.cvv}
                                                                onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                                                                maxLength={3}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2.5 pt-1">
                                                    <Button
                                                        variant="outline"
                                                        className="flex-1 h-10 border-white/10 text-white hover:bg-white/10 hover:text-white text-xs"
                                                        onClick={() => setStep("details")}
                                                    >
                                                        Back
                                                    </Button>
                                                    <Button
                                                        className="flex-[2] bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold h-10 border-0 text-sm"
                                                        onClick={handlePayment}
                                                        disabled={isProcessing || !formData.cardNumber || !formData.expiryDate || !formData.cvv}
                                                    >
                                                        {isProcessing ? (
                                                            <span className="flex items-center gap-2">
                                                                <motion.div
                                                                    className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full"
                                                                    animate={{ rotate: 360 }}
                                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                                />
                                                                Processing...
                                                            </span>
                                                        ) : (
                                                            `Pay ${currencySymbol}${itemPrice.toLocaleString()}`
                                                        )}
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        )}

                                        {step === "success" && (
                                            <motion.div
                                                key="success"
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="text-center py-8"
                                            >
                                                <div className="relative mb-8">
                                                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
                                                    <motion.div
                                                        className="w-24 h-24 rounded-full bg-[#0f0f23] border-2 border-green-500 relative z-10 mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                                    >
                                                        <Check className="w-12 h-12 text-green-500" />
                                                    </motion.div>
                                                </div>

                                                <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent mb-3">Payment Successful!</h3>
                                                <p className="text-white/60 mb-8 px-8">
                                                    Your booking for <span className="text-primary font-medium">{itemName}</span> has been confirmed. A receipt has been sent to your email.
                                                </p>

                                                <Button
                                                    className="w-full bg-white text-black hover:bg-white/90 font-bold h-12 rounded-xl"
                                                    onClick={resetAndClose}
                                                >
                                                    Return to Dashboard
                                                </Button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    )
}

function StepIndicator({ active, completed, number, label }: { active: boolean; completed: boolean; number: number; label: string }) {
    return (
        <div className="flex flex-col items-center gap-2">
            <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2 ${completed
                    ? "bg-green-500 border-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                    : active
                        ? "bg-[#0f0f23] border-primary text-primary shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                        : "bg-white/5 border-white/10 text-white/30"
                    }`}
            >
                {completed ? <Check className="w-5 h-5" /> : number}
            </div>
            <span className={`text-[10px] uppercase tracking-wider font-bold ${active ? "text-primary" : "text-white/30"}`}>
                {label}
            </span>
        </div>
    )
}
