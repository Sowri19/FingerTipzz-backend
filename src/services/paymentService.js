import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (amount, currency = "usd") => {
  return await stripe.paymentIntents.create({
    amount,
    currency,
  });
};

export const confirmPayment = async (paymentIntentId) => {
  return await stripe.paymentIntents.confirm(paymentIntentId);
};

export const refundPayment = async (paymentIntentId, amount) => {
  return await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount,
  });
};
