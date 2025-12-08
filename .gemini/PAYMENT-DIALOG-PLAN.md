# 💳 Payment Dialog Integration - Implementation Plan

## 🎯 Objective
Add a premium payment dialog that opens when users click on Stay or Flight cards to complete bookings.

## ✅ What's Already Done

### **1. Payment Dialog Component Created** ✅
- **File:** `src/components/ui/PaymentDialog.tsx`
- **Features:**
  - Multi-step flow (Details → Payment → Success)
  - Beautiful animations with Framer Motion
  - Form validation
  - Secure payment UI
  - Step indicators
  - Success confirmation

## 📋 Next Steps

### **Step 1: Update Stays Page**

Add payment dialog to `src/app/stays/page.tsx`:

```tsx
// 1. Import PaymentDialog
import { PaymentDialog } from "@/components/ui/PaymentDialog"

// 2. Add state
const [selectedStay, setSelectedStay] = useState<Accommodation | null>(null);
const [isPaymentOpen, setIsPaymentOpen] = useState(false);

// 3. Add handler function
const handleBookStay = (stay: Accommodation) => {
  setSelectedStay(stay);
  setIsPaymentOpen(true);
};

// 4. Update StayCard to accept onClick
<StayCard 
  key={stay.id} 
  stay={stay} 
  onClick={() => handleBookStay(stay)}
/>

// 5. Add PaymentDialog before closing </div>
<PaymentDialog
  isOpen={isPaymentOpen}
  onClose={() => setIsPaymentOpen(false)}
  itemType="stay"
  itemName={selectedStay?.name || ""}
  itemPrice={selectedStay?.price_per_night || 0}
  itemCurrency={selectedStay?.currency}
  itemImage={selectedStay?.images[0]}
  itemDetails={{
    location: `${selectedStay?.city}, ${selectedStay?.country}`,
    guests: selectedStay?.max_guests,
  }}
/>

// 6. Update StayCard component
function StayCard({ stay, onClick }: { stay: Accommodation; onClick: () => void }) {
  // Add onClick to the card
  <Card onClick={onClick} className="...cursor-pointer...">
}
```

### **Step 2: Update Flights Page**

Similar changes to `src/app/flights/page.tsx`:

```tsx
// 1. Import PaymentDialog
import { PaymentDialog } from "@/components/ui/PaymentDialog"

// 2. Add state
const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
const [isPaymentOpen, setIsPaymentOpen] = useState(false);

// 3. Add handler
const handleBookFlight = (flight: Flight) => {
  setSelectedFlight(flight);
  setIsPaymentOpen(true);
};

// 4. Update FlightCard
<FlightCard 
  key={flight.id} 
  flight={flight} 
  onClick={() => handleBookFlight(flight)}
/>

// 5. Add PaymentDialog
<PaymentDialog
  isOpen={isPaymentOpen}
  onClose={() => setIsPaymentOpen(false)}
  itemType="flight"
  itemName={`${selectedFlight?.airline} - ${selectedFlight?.flight_number}`}
  itemPrice={selectedFlight?.price || 0}
  itemCurrency={selectedFlight?.currency}
  itemDetails={{
    location: `${selectedFlight?.origin} → ${selectedFlight?.destination}`,
    date: selectedFlight?.departure_time,
  }}
/>
```

### **Step 3: Update Events Page (Optional)**

If you want payment for events too:

```tsx
// Same pattern as above
<PaymentDialog
  isOpen={isPaymentOpen}
  onClose={() => setIsPaymentOpen(false)}
  itemType="event"
  itemName={selectedEvent?.name || ""}
  itemPrice={selectedEvent?.price || 0}
  itemCurrency={selectedEvent?.currency}
  itemImage={selectedEvent?.images[0]}
  itemDetails={{
    location: selectedEvent?.location,
    date: selectedEvent?.date,
  }}
/>
```

## 🎨 Payment Dialog Features

### **Step 1: User Details**
- Full Name input
- Email input
- Phone Number input
- Total amount display
- "Continue to Payment" button

### **Step 2: Payment**
- Card Number input
- Expiry Date input
- CVV input
- Security badge
- "Back" and "Pay" buttons
- Processing animation

### **Step 3: Success**
- Success checkmark animation
- Confirmation message
- Email confirmation display
- "Done" button

## 🔒 Security Features

- Lock icon indicators
- Encrypted payment message
- Secure badge
- Professional UI

## ✨ Animations

- Smooth dialog entrance/exit
- Step transitions
- Processing spinner
- Success checkmark animation
- Hover effects

## 📱 Responsive Design

- Mobile-friendly
- Touch-optimized
- Adaptive layout
- Backdrop blur

## 🎯 User Experience

1. **Click card** → Dialog opens with smooth animation
2. **Fill details** → Form validation
3. **Enter payment** → Secure UI
4. **Processing** → Loading animation
5. **Success** → Confirmation
6. **Done** → Dialog closes smoothly

## 🚀 Ready to Implement!

The PaymentDialog component is complete and ready to use. Just need to:
1. Add state to pages
2. Add onClick handlers
3. Pass props to PaymentDialog
4. Update card components to accept onClick

**Estimated time:** 15-20 minutes for all pages!
