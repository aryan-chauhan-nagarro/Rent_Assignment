# Rent_Assignment — RentHub

RentHub is a comprehensive, responsive web application built with Angular to simplify the apartment search and rental process. It enables landlords and property managers to post and manage available apartments, while allowing prospective renters to search, filter, express interest, and engage in transparent discussions.

---

## Project Links

- **GitHub Repository:** [https://github.com/aryan-chauhan-nagarro/Rent_Assignment](https://github.com/aryan-chauhan-nagarro/Rent_Assignment)
- **Live Deployed Application:** [https://renthub-app-e1xw.onrender.com](https://renthub-app-e1xw.onrender.com)

---

## Demo User Credentials

The application is pre-configured with demo accounts automatically stored and synchronized in `localStorage`. You can also click the **"Fill Landlord"** or **"Fill Renter"** quick buttons directly on the Login page.

| Role | Email | Password | Permissions & Actions |
| :--- | :--- | :--- | :--- |
| **Landlord / Owner** | `landlord@example.com` | `password123` | • Owns pre-seeded properties (*Sunny 2BHK near Metro*, *Modern 3BHK Family Home*)<br>• Can create new posts<br>• Full edit & delete permissions on owned listings<br>• Highlighted with **"Owner"** badge in listing comment discussions |
| **Prospective Renter** | `renter@example.com` | `password123` | • Browse and filter listings<br>• Mark/unmark listings as favourites<br>• Send direct inquiries to landlords<br>• Post questions and reply in comment threads |

*You can also register a brand-new user account via the Registration page at any time.*

---

## Bonus Features Attempted

1. **Preview and Submit Screen for Post (Bonus Question):**
   - Implemented interactive preview workflow before a listing is published.
   - When a landlord clicks **"Preview Listing"**, the form validates all fields and opens the Preview Screen showcasing property title, formatted rent (with negotiable tag), address, area, lease type, furnished status, vegetarian preference, amenities chips, photos gallery, and contact information.
   - Landlords can click **"← Back to edit"** to adjust form fields or **"Confirm and Publish"** to commit the listing.
2. **Apartment Listing Management (Full CRUD):**
   - Landlords can not only post but also **Edit** (`/edit/:id`) and **Delete** their existing listings directly from the property details view with instant confirmation and toast notifications.
3. **Vegetarian / Dietary Preference Filter & Tags:**
   - Includes radio button options (`Veg Only`, `Non-Veg Allowed`, `Any / No Preference`) in listing creation and preview, badge tags on listing cards, and a dedicated food preference filter on the Home page.
4. **Quick View Filters:**
   - One-click filter toggles on the Home screen for **"★ My Listings Only"** and **"♥ My Favourites Only"**.

---

## Key Features

### 1. User Registration & Authentication
- **User Registration Form**: Validates display name (min 3 chars), valid email format, and password (min 6 chars) with cross-field password matching validation.
- **User Login**: Session persistence in `localStorage`, logout capability, and pre-seeded demo user integration.
- **Route Guards**:
  - `authGuard`: Protects private actions (e.g., `/create`, `/edit/:id`) and redirects unauthenticated visitors to `/login` preserving the return URL.
  - `guestGuard`: Prevents authenticated users from accessing login or registration pages.

### 2. Apartment Listings & Management
- **Create New Post**: Form collecting property headline, detailed description with real-time character counter (up to 1400 chars), location, square footage, expected rent, negotiable toggle, stay/lease duration, shared property toggle, furnished status, amenities checkboxes, vegetarian preference radio buttons, dynamic photo URLs, and 10-digit contact phone.
- **Update & Delete**: Listing owners can edit all attributes or safely remove a listing.

### 3. Search, Filter & Discovery
- **Hero Carousel**: Top carousel highlighting featured properties with automatic slide rotation (every 5 seconds), manual next/previous navigation controls, quick details link, and favourite toggle.
- **Search & Filters**:
  - Search by title or street address.
  - Max rent budget filtering.
  - Food / vegetarian preference dropdown.
  - Furnished properties only filter.
  - Multi-select amenities filter (e.g., Swimming Pool, Gym, Car Park, Elevator, Security, etc.).
  - Sorting: Newest first, Price: low to high, Price: high to low.
  - Reset filters button.
- **Pagination**: Responsive pagination (6 listings per page) with Next/Prev and direct page navigation buttons.

### 4. Interest Expression & Inquiries Dashboard
- **Mark as Favourite**: Toggle favourite status across Home cards, Carousel, and Details view with instant state updates.
- **Direct Landlord Inquiries**: Dedicated inquiry message form on the Details page for prospective renters to contact the property owner.
- **Inquiries Dashboard (`/inquiries`)**:
  - **Received Inquiries (For Landlords)**: Review tenant questions, prospective tenant contact information, message content, and 1-click email reply. Includes an unread badge in the navigation bar.
  - **Sent Inquiries (For Renters)**: History of all inquiries sent to property owners with direct links back to the listing.

### 5. Interactive Comments & Nested Replies
- Discussion section on every listing for questions and negotiations.
- Supports top-level comments and 1-level nested replies.
- Distinguishes the property owner with a distinct **"Owner"** badge.
- Allows comment authors to delete their own comments.

---

## Technology Stack & Architecture

- **Framework:** Angular 22 (Standalone Components)
- **Language:** TypeScript 6.0
- **State & Reactivity:** Angular Signals (`signal`, `computed`, `toSignal`), RxJS Observables
- **Forms:** Angular Reactive Forms with custom cross-field and whitespace validators
- **Routing:** Angular Router with route resolvers (`listingResolver`) and functional guards (`authGuard`, `guestGuard`)
- **Storage:** Browser `localStorage` for offline persistence of listings, users, comments, inquiries, and favourites

---

## Local Setup & Development

### Prerequisites
- Node.js (v20+ recommended)
- npm (v10+ recommended)
- Angular CLI (`npm install -g @angular/cli`)

### Installation & Execution
```bash
# 1. Clone repository
git clone https://github.com/aryan-chauhan-nagarro/Rent_Assignment.git
cd Rent_Assignment

# 2. Install dependencies
npm install

# 3. Start local development server
npm start
# or
ng serve
```
Open [http://localhost:4200/](http://localhost:4200/) in your browser.

### Build
```bash
npm run build
```
Build output will be generated in `dist/renthub`.

### Run Unit Tests
```bash
npm test
# or
npx ng test --watch=false
```
Executes Jasmine/Jest-compatible unit test suites covering components (`ListingCard`, `PostPreview`, `Comments`) and services (`Auth`, `FavouriteService`, `InquiryService`) with 100% tests passing.
