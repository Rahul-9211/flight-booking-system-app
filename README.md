# Flight Booking Application

A modern web application for booking flights, built with Next.js, TypeScript, and Stripe for payment processing.

## Features

- User authentication (sign up, sign in)
- Flight search and booking
- Secure payment processing with Stripe
- Booking confirmation and management
- Responsive design for all devices

## Getting Started

First, clone the repository:

```bash
git clone https://github.com/rahul-9211/flight-booking-app.git
cd flight-booking-app
```

Install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```
# Database
DATABASE_URL=your_database_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Next.js
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `/app` - Next.js application routes and pages
  - `/api` - API routes for backend functionality
    - `/flights` - Flight-related API endpoints
    - `/payments` - Payment processing endpoints including Stripe webhook
  - `/flights` - Flight search and details pages
  - `/signin` & `/signup` - Authentication pages
  - `/payment-confirmation` - Payment confirmation page
- `/store` - State management (using custom stores)
  - `authStore.ts` - Authentication state management
- `/components` - Reusable UI components
- `/lib` - Utility functions and shared code
- `/public` - Static assets

## Application Flow

### Authentication

1. Users can sign up at `/signup` with email and password
2. Users can sign in at `/signin` with their credentials
3. Authentication state is managed through the auth store

### Flight Booking

1. Users can search for flights at `/flights`
2. Flight details can be viewed at `/flights/[id]`
3. Users can select a flight and proceed to checkout
4. Payment is processed using Stripe
5. Upon successful payment, users are redirected to `/payment-confirmation`

## Payment Processing

This application uses Stripe for payment processing:

1. A payment intent is created via the API at `/api/payments/create-intent`
2. Users complete payment using Stripe Elements
3. Webhook at `/api/payments/webhook` handles payment confirmation

## Development Guidelines

- Follow the existing code style and patterns
- Use TypeScript for type safety
- Keep components small and focused

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
