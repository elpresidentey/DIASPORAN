# Date Input Styling Fix

## Issue
Date inputs across the Stays and Flights pages were displaying with inconsistent styling:
- Showing browser default placeholder text "dd/mm/yyyy"
- Calendar picker icon was not properly visible
- Inconsistent with the overall design system

## Solution Applied

### Changes Made

**1. Stays Page (`src/app/stays/page.tsx`)**
- Updated Check-in and Check-out date inputs
- Added proper calendar picker styling
- Improved visual consistency

**2. Flights Page (`src/app/flights/page.tsx`)**
- Updated Departure and Return date inputs
- Applied same styling improvements
- Ensured uniform appearance

### Technical Implementation

Applied the following CSS classes to all date inputs:
```tsx
className="h-10 text-center md:text-left [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
```

**Key improvements:**
- `h-10` - Consistent height across all inputs
- `text-center md:text-left` - Centered on mobile, left-aligned on desktop
- `[&::-webkit-calendar-picker-indicator]:opacity-100` - Makes calendar icon fully visible
- `[&::-webkit-calendar-picker-indicator]:cursor-pointer` - Proper cursor on hover
- Added `placeholder="Select date"` for better UX

### Benefits

✅ **Uniform Appearance** - All date inputs now have consistent styling
✅ **Better UX** - Calendar picker icon is clearly visible and clickable
✅ **Responsive Design** - Works well on both mobile and desktop
✅ **Accessibility** - Proper cursor feedback and visual indicators
✅ **Professional Look** - Matches the overall design system

### Pages Updated
- ✅ Stays page - Check-in and Check-out dates
- ✅ Flights page - Departure and Return dates

All changes compiled successfully with no errors.
