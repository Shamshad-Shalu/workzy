export const PLAN = {
  EXISTS: "Plan name already exists.",
  CREATED: "Plan created successfully.",
  UPDATED: "Plan Updated successfully.",
  NOT_FOUND: "Plan not found.",
  BLOCKED: "Plan blocked successfully.",
  UNBLOCKED: "Plan unblocked successfully.",
  ONLY_ONE_PREMIUM: "A premium plan already exists. Only one premium plan can exist at a time.",
  PREMIUM_REQUIRED: "At least one premium plan is required before adding special plans.",
  TYPE_CHANGE_NOT_ALLOWED: "plan cant change the type",

  VALID_FROM_FUTURE: "validFrom must be a valid date",
  VALID_TILL_FUTURE: "validTill must be a valid date",
  VALID_TILL_REQUIRED: "validTill is required for special offers.",
  INVALID_DATE_RANGE: "validFrom must be before validTill.",
  CANNOT_DEACTIVATE_REGULAR: "Regular plan cannot be deactivated.",
  OFFER_DATE_OVERLAP: "A special offer already exists in this date range. Deactivate it first.",
};
