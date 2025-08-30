export interface Contact {
  name: string;
  phone?: string;
}

export interface SafetyPlan {
  warningSigns: string[];
  copingStrategies: string[];
  supportContacts: Contact[];
  safePlaces: string[];
  reasonsForLiving: string[];
}