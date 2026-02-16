import {
  LucideIcon,
  ShoppingBag,
  Sparkles,
  Landmark
} from "lucide-react";

interface RewardConfig {
  icon: LucideIcon;
  header?: string;
  iconColor?: string;
  displayTitle?: string;
  description?: string;
  points: number;
  deliveryNote?: string;
  emailNote?: string;
}

export const rewardContentMap: Record<string, RewardConfig> = {
  "$5 Amazon Gift Card": {
    icon: ShoppingBag,
    header: "Gift Card",
    iconColor: "#FF9900",
    displayTitle: "Amazon Gift Card",
    description: "$5 Value",
    points: 5000,
    deliveryNote: "You should receive it within 24 hours.",
    emailNote: "We're sending your gift card code to:",
  },
   "$10 Amazon Gift Card": {
    icon: ShoppingBag,
    header: "Gift Card",
    iconColor: "#FF9900",
    displayTitle: "Amazon Gift Card",
    description: "$10 Value",
    points: 10000,
    deliveryNote: "You should receive it within 24 hours.",
    emailNote: "We're sending your gift card code to:",
  },

  // "$2 Virtual Visa Card": {
  //   icon: ShoppingBag,
  //   iconColor: "#007bff",
  //   header: "Gift Card",
  //   displayTitle: "Virtual Visa Card",
  //   description: "$2 Prepaid Card",
  //   points: 2000,
  //   deliveryNote: "You’ll receive it by email shortly.",
  //   emailNote: "Your card details will be delivered to:",
  // },
  "$5 Virtual Visa Card": {
    icon: ShoppingBag,
    iconColor: "#007bff",
    header: "Gift Card",
    displayTitle: "Virtual Visa Card",
    description: "$5 Prepaid Card",
    points: 5000,
    deliveryNote: "You’ll receive it by email shortly.",
    emailNote: "Your card details will be delivered to:",
  },
  
  "$5 Apple Gift Card": {
    icon: ShoppingBag,
    iconColor: "#007bff",
    header: "Gift Card",
    displayTitle: "Apple Gift Card",
    description: "$5 Value",
    points: 5000,
    deliveryNote: "You’ll receive it by email shortly.",
    emailNote: "Your card details will be delivered to:",
  },
  "$5 Google Play Card": {
    icon: ShoppingBag,
    iconColor: "#007bff",
    header: "Gift Card",
    displayTitle: "Google Play Card",
    description: "$5 Value",
    points: 5000,
    deliveryNote: "You’ll receive it by email shortly.",
    emailNote: "Your card details will be delivered to:",
  },
  "$5 PayPal International": {
  icon: ShoppingBag,
  iconColor: "#007bff",
  header: "PayPal",
  displayTitle: "PayPal International",
  description: "$5 Transfer",
  points: 5000,
  deliveryNote: "The $5 will be sent to your PayPal email shortly.",
  emailNote: "Funds will be transferred to your PayPal account email:",
},

 "$5 Bank Transfer": {
  icon: Landmark, // or Landmark for bank
  header: "Bank Transfer",
  iconColor: "#4B5563",
  displayTitle: "Bank Transfer",
  description: "$5 Transfer",
  points: 5000,
  deliveryNote: "The $5 equivalent will be transferred to your bank account.",
  emailNote: "We will contact you via email to collect the necessary bank details for processing your transfer.",
},

  "Mystery Drop": {
    icon: Sparkles,
    header: "Special",
    iconColor: "#9333ea",
    displayTitle: "Mystery Drop",
    description: "First 5 to invite 5 friends unlock get a mystery surprise!",
    points: 1000,
    deliveryNote:
      "If you're among the first 5, your surprise will be delivered soon.",
    emailNote: "We'll notify you at:",
  },
  // "LinkedIn Profile Optimization": {
  //   icon: Briefcase,
  //   header: "Service",
  //   iconColor: "#0a66c2",
  //   displayTitle: "LinkedIn Profile Optimization",
  //   description: "Improve your LinkedIn visibility and presentation.",
  //   points: 1000,
  //   deliveryNote: "Our expert will connect with you within 24 hours.",
  //   emailNote: "We'll contact you at:",
  // },
  // "Tool Discounts": {
  //   icon: Briefcase,
  //   points: 1500,
  // },
};


