export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Find quick answers to common questions about booking, travel, and using Diasporan.
          </p>
        </div>
      </section>
      
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Booking & Reservations</h2>
            <div className="space-y-4">
              <div className="border rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-2">How do I book a flight through Diasporan?</h3>
                <p className="text-muted-foreground">Simply visit our Flights page, enter your departure and destination cities, select your travel dates, and browse available options.</p>
              </div>
              <div className="border rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-2">Can I modify or cancel my booking?</h3>
                <p className="text-muted-foreground">Yes, you can modify or cancel most bookings through your account dashboard. Cancellation policies vary by provider.</p>
              </div>
            </div>
          </div>
          
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Travel & Safety</h2>
            <div className="space-y-4">
              <div className="border rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-2">Do I need a visa to travel to African countries?</h3>
                <p className="text-muted-foreground">Visa requirements vary by country and your nationality. Check with the embassy or consulate of your destination country.</p>
              </div>
              <div className="border rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-2">Is travel insurance recommended?</h3>
                <p className="text-muted-foreground">Yes, we strongly recommend comprehensive travel insurance covering medical emergencies, trip cancellation, and lost luggage.</p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-muted-foreground mb-6">Contact our support team for help with your travel needs.</p>
            <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
              Contact Support
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}