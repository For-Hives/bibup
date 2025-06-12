# Beswib Platform Update Guide

This document outlines the changes being made to the Beswib platform as per the new requirements.

## Phase 1: Core Feature Enhancements

### Step 1: Extend User Model and Profile Management

**Objective:** Collect more detailed user information, including phone, address, and date of birth.

**A. Code Changes (Completed):**

1.  **Modified `src/models/user.model.ts`:**
    *   The `User` interface has been updated to include new optional fields:
        *   `phone?: string`
        *   `address?: { street: string; city: string; postalCode: string; country: string }`
        *   `dateOfBirth?: string` (intended to store an ISO date string like 'YYYY-MM-DD')

    *   The updated interface looks like this:

        ```typescript
        export interface User {
            bibUpBalance: number // Default to 0
            clerkId: string // For linking to Clerk user
            email: string
            firstName: string
            id: string
            lastName: string
            roles: Array<'admin' | 'buyer' | 'organizer' | 'seller'>
            phone?: string // New field
            address?: { // New field
                street: string
                city: string
                postalCode: string
                country: string
            }
            dateOfBirth?: string // New field (ISO date string e.g., 'YYYY-MM-DD')
        }
        ```

**B. Manual Configuration (To Be Done by You):**

1.  **Configure Clerk Dashboard Custom Attributes:**
    *   Log in to your Clerk dashboard.
    *   Navigate to **Users > Custom attributes**.
    *   Add the following custom attributes. These attributes will allow users to manage this information through their Clerk profile, and the values will be synced to your application's database via webhooks.
        *   **Attribute 1:**
            *   Name: `phone`
            *   Type: `String` (or "Phone Number" if a specific type is available)
            *   Permissions: Ensure users can read and edit this attribute.
        *   **Attribute 2:**
            *   Name: `dateOfBirth`
            *   Type: `String` (this will store the date as YYYY-MM-DD; choose a "Date" type if available)
            *   Permissions: Ensure users can read and edit this attribute.
        *   **Attribute 3 (Address - Street):**
            *   Name: `addressStreet`
            *   Type: `String`
            *   Permissions: Ensure users can read and edit this attribute.
        *   **Attribute 4 (Address - City):**
            *   Name: `addressCity`
            *   Type: `String`
            *   Permissions: Ensure users can read and edit this attribute.
        *   **Attribute 5 (Address - Postal Code):**
            *   Name: `addressPostalCode`
            *   Type: `String`
            *   Permissions: Ensure users can read and edit this attribute.
        *   **Attribute 6 (Address - Country):**
            *   Name: `addressCountry`
            *   Type: `String`
            *   Permissions: Ensure users can read and edit this attribute.

    *   **Note:** Using separate fields for the address in Clerk (`addressStreet`, `addressCity`, etc.) is generally easier to manage within Clerk's UI unless they have robust JSON object support for custom attributes that is user-editable. The application's webhook will be responsible for combining these into the structured `address` object in our database.

**C. Code Changes (Completed by Assistant):**

1.  **Updated `src/services/user.services.ts`:**
    *   **`CreateUserDTO` Modified:**
        *   Added optional fields: `phone?: string`, `address?: { street: string; city: string; postalCode: string; country: string }`, `dateOfBirth?: string`.
    *   **`createUser` Function Updated:**
        *   Modified to include `phone`, `address`, and `dateOfBirth` from `userData` when preparing `newUserRecord`.
        *   Includes logic to omit undefined optional fields from the record sent to PocketBase.
    *   **`UpdateUserDTO` Defined:**
        *   A new interface was added:
            ```typescript
            export interface UpdateUserDTO {
                firstName?: string;
                lastName?: string;
                phone?: string;
                address?: {
                    street: string;
                    city: string;
                    postalCode: string;
                    country: string;
                };
                dateOfBirth?: string; // ISO date string e.g., 'YYYY-MM-DD'
            }
            ```
    *   **`updateUser` Function Implemented:**
        *   A new function was added: `async function updateUser(userId: string, userData: UpdateUserDTO): Promise<null | User>`
        *   It takes a PocketBase `userId` and an `UpdateUserDTO`.
        *   Constructs a payload with only the fields present in `userData`.
        *   Calls `pb.collection('users').update<User>(userId, updatePayload)` to update the user.
        *   Handles cases where no actual data is provided for update (returns current user) and includes error handling.

2.  **Updated `src/app/api/webhooks/clerk/route.ts` (Clerk Webhook Handler):**
    *   **Imports:** Added imports for `updateUser`, `UpdateUserDTO`, `fetchUserByClerkId` from `@/services/user.services.ts`.
    *   **`user.created` Event Logic:**
        *   Now extracts `phone`, `dateOfBirth`, and address components (`addressStreet`, `addressCity`, `addressPostalCode`, `addressCountry`) from `evt.data.public_metadata`.
        *   Constructs a nested `address` object if all components are present.
        *   Passes these new fields (phone, dateOfBirth, address) to the `createUser` service.
    *   **`user.updated` Event Logic:**
        *   Added a new `else if (eventType === 'user.updated')` block to handle this event.
        *   Extracts `id` (Clerk ID), `first_name`, `last_name` from `evt.data`, and the same custom attributes from `evt.data.public_metadata`.
        *   Calls `fetchUserByClerkId(clerkId)` to find the corresponding user in PocketBase.
        *   If the user is found, it prepares an `UpdateUserDTO` with the received data (including the nested `address` object if all components are available).
        *   Calls the `updateUser(pocketBaseUserId, updateData)` service function to save the changes.
        *   Includes error handling for scenarios like user not found, no actual data to update, or database errors.
    *   **General:** The changes ensure that user profile information, including new custom fields managed in Clerk, are synced to the application's PocketBase database upon user creation and updates.

---

*This document will be updated as more features are implemented.*

### Step 2: Enhance Event Model for Core Details

**Objective:** Expand the information stored for each event to include more specific details relevant to race organization and display.

**A. Code Changes (Completed by Assistant):**

1.  **Modified `src/models/event.model.ts`:**
    *   The `Event` interface has been updated to include new optional fields:
        *   `raceType?: string` (e.g., 'trail', 'road')
        *   `distance?: number` (in km)
        *   `elevationGain?: number` (in meters)
        *   `raceFormat?: string` (e.g., 'solo', 'team')
        *   `logoUrl?: string`
        *   `bibPickupDetails?: string`
        *   `registrationOpenDate?: string` (ISO string 'YYYY-MM-DD')
        *   `referencePrice?: number`

2.  **Modified `src/app/dashboard/organizer/submit-event/SubmitEventForm.tsx`:**
    *   Added new input fields to the event submission form for each of the new `Event` model fields:
        *   `raceType`: A `<select>` input.
        *   `distance`: An `<input type="number">`.
        *   `elevationGain`: An `<input type="number">`.
        *   `raceFormat`: A `<select>` input.
        *   `logoUrl`: An `<input type="url">`.
        *   `bibPickupDetails`: A `<textarea>`.
        *   `registrationOpenDate`: An `<input type="date">`.
        *   `referencePrice`: An `<input type="number">`.
    *   These fields use new translation keys (e.g., `t.raceTypeLabel`, `t.distanceLabel`, etc.) for their labels and placeholders.

3.  **Modified `src/services/event.services.ts`:**
    *   The `createEvent` function was updated:
        *   The `dataToCreate` object passed to `pb.collection('events').create()` now includes all the new optional fields from the `eventData` parameter (`raceType`, `distance`, `elevationGain`, `raceFormat`, `logoUrl`, `bibPickupDetails`, `registrationOpenDate`, `referencePrice`).
        *   This allows these details to be saved when a new event is created.

4.  **Modified `src/app/dashboard/organizer/submit-event/actions.ts`:**
    *   **Valibot Schema (`EventFormSchema`):** Updated to include validation rules for all new form fields. This includes type transformations (e.g., string to number for `distance`, `elevationGain`, `referencePrice`; URL validation for `logoUrl`). `participantCount` was also added to the schema.
    *   **Data Handling:** The `handleSubmitEvent` function now extracts the new fields from `formData`, includes them in the `dataToValidate` object, and passes the validated new fields to the `createEvent` service via the `eventData` object.
    *   The main event `date` field is now explicitly converted to a `Date` object (`new Date(validatedOutput.date)`) within the action before calling `createEvent`, while `registrationOpenDate` is passed as a string.

**B. Manual Configuration / i18n (To Be Done by You):**

1.  **Update `src/app/dashboard/organizer/submit-event/locales.json`:**
    *   Add new translation keys and their corresponding translations (for English, French, Korean) for the labels of the new form fields. The keys used in `SubmitEventForm.tsx` are:
        *   `raceTypeLabel`
        *   `distanceLabel`
        *   `elevationGainLabel`
        *   `raceFormatLabel`
        *   `logoUrlLabel`
        *   `bibPickupDetailsLabel`
        *   `registrationOpenDateLabel`
        *   `referencePriceLabel`
        *   `selectOptionDefault` (for the default "Select..." option in dropdowns)
    *   Example for English (`en`):
        ```json
        "raceTypeLabel": "Race Type:",
        "distanceLabel": "Distance (km):",
        "elevationGainLabel": "Elevation Gain (meters):",
        "raceFormatLabel": "Race Format:",
        "logoUrlLabel": "Logo URL (Optional):",
        "bibPickupDetailsLabel": "Bib Pickup Details (Optional):",
        "registrationOpenDateLabel": "Registration Open Date (Optional):",
        "referencePriceLabel": "Reference Bib Price (Optional):",
        "selectOptionDefault": "Select an option...",
        ```
    *   Remember to add these for `fr` and `ko` locales as well.
---
