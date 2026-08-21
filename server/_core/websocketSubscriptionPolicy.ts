export const ALLOWED_SUBSCRIPTION_CHANNELS = new Set([
  "keywords",
  "statistics",
]);

export const MAX_SUBSCRIPTIONS_PER_CLIENT = 2;

type SubscriptionRequest = {
  isAdmin: boolean;
  channel: unknown;
  subscriptions: ReadonlySet<string>;
};

type SubscriptionAccepted = {
  accepted: true;
  subscriptions: Set<string>;
};

type SubscriptionRejected = {
  accepted: false;
  reason: "subscription_forbidden" | "invalid_subscription_channel" | "subscription_limit_reached";
  subscriptions: Set<string>;
};

export function applySubscriptionRequest({
  isAdmin,
  channel,
  subscriptions,
}: SubscriptionRequest): SubscriptionAccepted | SubscriptionRejected {
  const nextSubscriptions = new Set(subscriptions);

  if (!isAdmin) {
    return {
      accepted: false,
      reason: "subscription_forbidden",
      subscriptions: nextSubscriptions,
    };
  }

  if (typeof channel !== "string" || !ALLOWED_SUBSCRIPTION_CHANNELS.has(channel)) {
    return {
      accepted: false,
      reason: "invalid_subscription_channel",
      subscriptions: nextSubscriptions,
    };
  }

  if (!nextSubscriptions.has(channel) && nextSubscriptions.size >= MAX_SUBSCRIPTIONS_PER_CLIENT) {
    return {
      accepted: false,
      reason: "subscription_limit_reached",
      subscriptions: nextSubscriptions,
    };
  }

  nextSubscriptions.add(channel);
  return {
    accepted: true,
    subscriptions: nextSubscriptions,
  };
}
