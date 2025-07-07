# AI-Assisted Review Navigation Test Guide

## Test Steps

1. **Start the Create Listing Process**
   - Navigate to `/create-listing`
   - Select any category (e.g., "HR & Payroll")
   - Fill in the intelligent ingestion form with test data
   - Wait for AI processing to complete

2. **Test Navigation Through All 8 Sections**
   
   ### Section 1: Project Overview & Business Context
   - Verify the section loads with pre-filled data
   - Check that the AI message appears in the chat
   - Click "Looks Good, Next →" button
   - Console should log: "handleNextSection called. Current section: 0"
   - Console should log: "Moving to section: 1 Organizational & Operational Details"

   ### Section 2: Organizational & Operational Details
   - Verify smooth transition with fade effect
   - Form should scroll to top
   - New AI message should appear
   - Click "Looks Good, Next →" button
   - Console logs should show progression to section 2

   ### Section 3: Budget & Timeline
   - Check all form fields are functional
   - Progress indicator should show 3 of 8
   - Click "Looks Good, Next →" button

   ### Section 4: Core Requirements
   - Verify checkboxes work properly
   - Click "Looks Good, Next →" button

   ### Section 5: Technical Specifications
   - Test all form interactions
   - Click "Looks Good, Next →" button

   ### Section 6: Additional Requirements & Evaluation
   - Verify textarea and checkboxes
   - Click "Looks Good, Next →" button

   ### Section 7: Project Details
   - Test budget input fields
   - Click "Looks Good, Next →" button

   ### Section 8: Business Context
   - This is the final section
   - Button should now say "Perfect, Let's Finalize →"
   - Click the button
   - Console should log: "handleComplete called. Finalizing RFQ..."

3. **Final Approval Page**
   - Should transition to the Final Approval component
   - Verify all data is preserved

## Visual Indicators to Check

- **Progress Bar**: Should update with each section (ring effect on current)
- **Chat Messages**: Should accumulate showing conversation history
- **Smooth Transitions**: Form content should fade during transitions
- **Auto-scroll**: Chat should scroll to show new messages
- **Button State**: Should be clickable and show hover effects

## Console Logs to Verify

- Initial mount: "AIAssistedReview mounted. Initializing first message..."
- Each button click: "Button clicked: Looks Good, Next →"
- Navigation logs showing section transitions
- Final completion: "Calling onComplete with formData"

## Common Issues Fixed

1. **Button not appearing**: Fixed with delayed initialization
2. **Navigation not working**: Fixed with proper callback handling
3. **Visual feedback**: Added transition states and progress indicators
4. **Scroll behavior**: Added auto-scroll for both form and chat