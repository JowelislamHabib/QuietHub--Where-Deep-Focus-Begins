# QuietHub — Where Deep Focus Begins

## What problem does it solve?

Finding a quiet, distraction‑free place to work or study is harder than it should be. Coffee shops are noisy, libraries have limited hours, and shared offices are expensive or require long‑term commitments.

QuietHub connects people who need **short‑term, focused work sessions** with hosts who have calm, underutilised spaces — from private study nooks to quiet meeting rooms. It removes the friction of discovery, booking, and payment by providing a simple marketplace tailored for deep work.

## Who is it for?

- **Students & remote workers** – need a quiet spot for a few hours, with predictable amenities (power, Wi‑Fi, natural light, whiteboards).
- **Freelancers & digital nomads** – want variety without monthly co‑working memberships.
- **Hosts (homeowners, small businesses, libraries, churches)** – have spare rooms or quiet hours and want to earn extra income with minimal management.
- **Teams & study groups** – require bookable rooms with capacity and equipment (projector, desks, silent zones).

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| UI | [React 19](https://react.dev), [HeroUI](https://www.heroui.com) v3, [Tailwind CSS](https://tailwindcss.com) v4 |
| Motion | [Motion](https://motion.dev) |
| Icons | [React Icons](https://react-icons.github.io/react-icons/) (Remix Icon set) |
| Auth (frontend) | [Better Auth](https://www.better-auth.com) + JWT plugin + `@better-auth/mongo-adapter` |
| Database | [MongoDB](https://www.mongodb.com) (Better Auth users/sessions) |
| Backend API | [Express.js](https://expressjs.com) + JWT (`Authorization: Bearer`) |
| Dates | `@internationalized/date` (booking calendar constraints) |
| Compiler | React Compiler (`babel-plugin-react-compiler`) |
| API base URL | `NEXT_PUBLIC_SERVER_URL` (Express server) |

## How to run it (quick start)

### Prerequisites

- **Node.js** 18.18+ (20 LTS recommended)
- **MongoDB** (local or Atlas) – stores user accounts (via Better Auth)
- A separate **Express.js API** (not included here) that provides room, booking & listing data.  
  *This repo is the Next.js frontend client. You need the backend service running.*

### 1. Clone & install

```bash
git clone <repository-url>
cd quietHub-where-deep-focus-begins
npm install
```

### 2. Configure environment

Create a `.env.local` file:

```env
MONGO_URI=mongodb://127.0.0.1:27017/quiethub
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-long-random-secret
NEXT_PUBLIC_SERVER_URL=http://localhost:5000/api   # Express API base URL
# Optional for Google OAuth:
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

### 3. Start the Express backend

Make sure your Express API (with JWT middleware) is running on the URL you set in `NEXT_PUBLIC_SERVER_URL`.  
The API must expose:

- `GET /rooms` – public listing
- `GET /rooms/:id` – room details
- `POST /bookings` (protected) – create a booking
- `GET /bookings/user` (protected) – fetch user’s bookings
- `POST /rooms` (protected) – add a new listing
- `PUT /rooms/:id` (protected) – edit listing
- `DELETE /rooms/:id` (protected) – delete listing

### 4. Run the Next.js frontend

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).  
Sign up with email or Google – now you can search rooms, make bookings, and list your own spaces.

### Production build

```bash
npm run build
npm start
```

## Key features at a glance

| For guests | For hosts |
|------------|-----------|
| Browse rooms with filters (amenities, price, capacity) | Multi‑step form to add a new space |
| View image galleries, floor, exact location | Edit or delete your listings |
| Book a time slot with date & hour picker | See how many booked ( coming soon - who booked your room via bookings) |
| Real‑time cost estimate | Manage your availability (coming soon) |
| Reschedule or cancel upcoming bookings | |

