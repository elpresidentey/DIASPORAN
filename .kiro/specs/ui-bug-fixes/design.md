# Design Document

## Overview

This design addresses four specific UI/UX issues that are impacting user experience: missing padding on the flight search container, incorrect scroll positioning when opening blog posts, broken transport booking functionality, and inconsistent scrollbar styling. The solution focuses on targeted fixes that improve usability without requiring major architectural changes.

## Architecture

The fixes are organized into four independent modules:

1. **Flight Search Layout Fix**: Add proper padding to the search container section
2. **Blog Navigation Fix**: Implement scroll-to-top behavior when navigating to blog posts
3. **Transport Booking Fix**: Either fix the booking flow or gracefully disable it
4. **Scrollbar Styling Update**: Replace purple scrollbar with theme-aware neutral colors

Each fix is isolated and can be implemented independently without affecting other parts of the system.

## Components and Interfaces

### Flight Search Container
**Current Issue**: The search section on `/flights` page lacks top padding, causing the content to appear cramped.

**Solution**:
- Add `pt-8` or `pt-10` class to the search Card component
- Ensure consistent spacing across all breakpoints
- Maintain existing responsive behavior

**Files to Modify**:
- `src/app/flights/page.tsx` - Update the CardContent padding

### Blog Navigation
**Current Issue**: When clicking on a blog post, the page scrolls to the bottom instead of the top.

**Solution**:
- Add `useEffect` hook to scroll to top when blog post is selected
- Use `window.scrollTo({ top: 0, behavior: 'smooth' })` or the existing `smoothScrollTo` utility
- Ensure scroll happens after content renders

**Files to Modify**:
- `src/app/blog/page.tsx` - Add scroll-to-top logic when `selectedPost` changes

### Transport Booking
**Current Issue**: Clicking "Book Now" on transport options shows an error page.

**Solution Options**:
1. **Option A (Preferred)**: Remove the "Book Now" button and replace with informational text
2. **Option B**: Fix the booking flow by implementing proper error handling in PaymentDialog
3. **Option C**: Disable the button with a tooltip explaining the feature is coming soon

**Recommended Approach**: Option A - Remove the button to prevent user frustration. The transport page already shows ride-hailing options (Uber/Bolt) which are functional.

**Files to Modify**:
- `src/app/transport/page.tsx` - Remove or disable booking buttons for scheduled routes

### Scrollbar Styling
**Current Issue**: Purple scrollbar doesn't match the minimalistic design.

**Solution**:
- Update `::-webkit-scrollbar-thumb` to use neutral gray colors
- Ensure theme-aware colors that adapt to light/dark mode
- Use existing CSS custom properties for consistency

**Files to Modify**:
- `src/app/globals.css` - Update scrollbar styling rules

## Data Models

No data model changes required. All fixes are UI/styling updates.

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

**Property 1: Flight search container responsive spacing**
*For any* viewport width between 320px and 2560px, the flight search container should maintain consistent spacing ratios and not cause layout shifts during user interactions
**Validates: Requirements 1.2, 1.3, 1.4, 1.5**

**Property 2: Blog post scroll behavior**
*For any* blog post selection, the window scroll position should be set to 0 within 100ms of the selectedPost state change
**Validates: Requirements 2.1**

**Property 3: Transport booking error handling**
*For any* transport booking attempt, the system should either complete successfully or display user-friendly error messages with alternative actions
**Validates: Requirements 3.1, 3.2, 3.4, 3.5**

**Property 4: Transport booking button conditional rendering**
*For any* transport route where booking is unavailable, the "Book Now" button should not be rendered in the DOM
**Validates: Requirements 3.3**

**Property 5: Scrollbar theme consistency**
*For any* theme change (light/dark), the scrollbar colors should update to use theme-appropriate neutral colors within the CSS transition duration
**Validates: Requirements 4.1, 4.3**

**Property 6: Scrollbar hover feedback**
*For any* scrollbar hover interaction, the visual feedback should be consistent with the design system's hover states
**Validates: Requirements 4.2, 4.5**

## Error Handling

### Flight Search
- Maintain existing error handling for API failures
- Preserve loading states and empty states
- Ensure padding doesn't cause layout shifts

### Blog Navigation
- Handle cases where blog post data is missing
- Gracefully handle scroll failures in browsers that don't support smooth scrolling
- Maintain scroll position when navigating back to blog list

### Transport Booking
- If removing buttons: Provide clear messaging about alternative booking methods
- If keeping buttons: Implement proper error boundaries and user-friendly error messages
- Ensure PaymentDialog handles missing data gracefully

### Scrollbar Styling
- Provide fallback styles for browsers that don't support custom scrollbars
- Ensure scrollbar remains functional even if styling fails
- Test across different operating systems (Windows, Mac, Linux)

## Testing Strategy

**Unit Testing:**
- Test that flight search container renders with correct padding classes
- Test blog post navigation triggers scroll behavior
- Test transport booking button conditional rendering
- Test scrollbar CSS classes are applied correctly

**Property-Based Testing:**
- Use Vitest for JavaScript/TypeScript property testing
- Configure each property test to run a minimum of 100 iterations
- Tag each property-based test with comments referencing the design document properties

**Manual Testing:**
- Visual inspection of flight search spacing on multiple screen sizes
- Click through blog posts to verify scroll behavior
- Test transport page booking flow or verify buttons are removed
- Check scrollbar appearance in light and dark modes across browsers

**Regression Testing:**
- Verify existing functionality remains intact
- Test theme switching still works correctly
- Ensure no layout shifts or visual regressions
- Confirm performance is not negatively impacted

## Implementation Details

### Flight Search Padding
```tsx
// Before
<CardContent className="p-5">

// After  
<CardContent className="p-5 pt-8">
```

### Blog Scroll-to-Top
```tsx
useEffect(() => {
  if (selectedPost) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}, [selectedPost]);
```

### Transport Booking Button Removal
```tsx
// Remove the Book Now button and replace with info text
<div className="text-sm text-muted-foreground">
  Contact provider directly to book
</div>
```

### Scrollbar Styling
```css
/* Replace purple with neutral gray */
::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.3);
  border-radius: 5px;
  transition: background-color 300ms ease-in-out;
}

::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.5);
}
```

## Accessibility Considerations

- Ensure sufficient color contrast for scrollbar visibility
- Maintain keyboard navigation functionality
- Preserve screen reader compatibility
- Test with reduced motion preferences
- Ensure focus indicators remain visible after changes