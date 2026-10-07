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
  title: 'HVAC Repair & Installation in Ashburn, VA | ARYA Heating & Cooling',
  description:
    'Master Licensed HVAC technicians serving Ashburn and Northern Virginia. 24/7 emergency HVAC, AC repair, heating and maintenance. Call (703) 420-5038 for a free quote.',
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
  termsHref: '/terms/',
  privacyHref: '/privacy-policy-682915/',
} as const;

export const socialLinks: SocialLink[] = [
  { label: 'Facebook', icon: 'facebook', href: '#' },
  { label: 'Instagram', icon: 'instagram', href: '#' },
  { label: 'X', icon: 'x', href: '#' },
  { label: 'LinkedIn', icon: 'linkedin', href: '#' },
];
