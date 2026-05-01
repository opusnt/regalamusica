export function trackEvent(name, properties = {}) {
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: name, ...properties });
  }

  if (import.meta.env.DEV) {
    console.info("[analytics]", name, properties);
  }
}

export const analyticsEvents = {
  viewHome: "view_home",
  clickCreateSong: "click_create_song",
  clickListenExamples: "click_listen_examples",
  startForm: "start_form",
  completeStep1: "complete_step_1",
  completeStep2: "complete_step_2",
  completeStep3: "complete_step_3",
  selectPlan: "select_plan",
  beginCheckout: "begin_checkout",
  paymentSuccess: "payment_success",
  paymentCancelled: "payment_cancelled",
  submitOrder: "submit_order",
};
