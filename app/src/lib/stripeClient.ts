import { loadStripe, type Stripe } from '@stripe/stripe-js'

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined

export const hasStripeConfig = Boolean(publishableKey)

export const stripePromise: Promise<Stripe | null> = hasStripeConfig
  ? loadStripe(publishableKey!)
  : Promise.resolve(null)

export const stripeEnvGuidance = [
  'Create a Stripe account and a test publishable key.',
  'Store VITE_STRIPE_PUBLISHABLE_KEY as a GitHub Secret.',
  'Inject it into the build to power Checkout + customer portal.',
]
