export type IconName =
  | 'phone'
  | 'arrow'
  | 'check'
  | 'clock'
  | 'shield'
  | 'mail'
  | 'pin'
  | 'user'
  | 'facebook'
  | 'instagram'
  | 'x'
  | 'linkedin'
  | 'menu'
  | 'chevron'
  | 'close';

export interface SocialLink {
  label: string;
  icon: IconName;
  href: string;
}

export const site = {
  name: 'ARYA Heating & Cooling',
  shortName: 'ARYA HVAC',
  title: 'Ashburn HVAC Repair & Installation | ARYA Heating & Cooling',
  description:
    'Master Licensed HVAC technicians serving Ashburn and Northern Virginia. 24/7 emergency HVAC, AC repair, heating and maintenance. Call (703) 420-5038.',
  phone: {
    display: '(703) 420-5038',
    href: 'tel:+17034205038',
  },
  email: {
    display: 'aryaheatingcooling@gmail.com',
    href: 'mailto:aryaheatingcooling@gmail.com',
  },
  // Point this at the CRM / form handler
  formAction: '#',
  // Google "write a review" page for the business
  reviewHref: 'https://g.page/r/CehQZc4BOKckEAE/review',
  // Business address as published on the previous website
  address: {
    street: '8256 Laurel Heights Loop',
    city: 'Lorton',
    region: 'VA',
    postalCode: '22079',
    country: 'US',
  },
  // Set these once the pages exist, e.g. '/terms/'. Until then the labels show without a link.
  termsHref: undefined as string | undefined,
  privacyHref: undefined as string | undefined,
} as const;

export const socialLinks: SocialLink[] = [
  { label: 'Facebook', icon: 'facebook', href: '#' },
  { label: 'Instagram', icon: 'instagram', href: '#' },
  { label: 'X', icon: 'x', href: '#' },
  { label: 'LinkedIn', icon: 'linkedin', href: '#' },
];
