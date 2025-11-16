import { GraduationCap, Users, TrendingUp, Github, Twitter, Mail, Linkedin } from "lucide-react";

export const FOOTER_LINKS = {
  PLATFORM: [
    { label: 'Courses', href: '/courses' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Sign In', href: '/signin' },
    { label: 'Get Started', href: '/register' }
  ]
};

export const SOCIAL_LINKS = [
  { 
    label: 'GitHub', 
    href: '#', 
    icon: Github,
    ariaLabel: 'GitHub'
  },
  { 
    label: 'Twitter', 
    href: '#', 
    icon: Twitter,
    ariaLabel: 'Twitter'
  },
  { 
    label: 'Email', 
    href: '#', 
    icon: Mail,
    ariaLabel: 'Email'
  },
  { 
    label: 'LinkedIn', 
    href: '#', 
    icon: Linkedin,
    ariaLabel: 'LinkedIn'
  }
];

export const STATS_DATA = [
  { value: '10K+', label: 'Active Students' },
  { value: '500+', label: 'Courses' },
  { value: '200+', label: 'Expert Instructors' },
  { value: '98%', label: 'Satisfaction Rate' }
];

export const STEPS_DATA = [
  {
    number: 1,
    title: 'Sign Up',
    description: 'Create your free account as a student or instructor'
  },
  {
    number: 2,
    title: 'Explore Courses',
    description: 'Browse through hundreds of expert-led courses'
  },
  {
    number: 3,
    title: 'Start Learning',
    description: 'Enroll in courses and begin your learning journey'
  }
];

export const FEATURE_CARDS = [
  {
    title: 'For Students',
    description: 'Learn at your own pace',
    icon: GraduationCap,
    color: 'blue',
    features: [
      'Access to expert-led video courses',
      'Track your learning progress',
      'Earn completion certificates',
      'Learn from any device, anytime'
    ]
  },
  {
    title: 'For Instructors',
    description: 'Share your knowledge',
    icon: Users,
    color: 'purple',
    features: [
      'Create and manage courses easily',
      'Upload and stream video content',
      'Monitor student engagement',
      'Build your teaching brand'
    ]
  },
  {
    title: 'Platform Features',
    description: 'Modern learning experience',
    icon: TrendingUp,
    color: 'green',
    features: [
      'HD video streaming',
      'Mobile-friendly design',
      'Secure user accounts',
      'Progress Completion'
    ]
  }
];