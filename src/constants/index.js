export const navLinks = [
  {
    id: 1,
    name: 'Home',
    href: '#home',
  },
  {
    id: 2,
    name: 'About',
    href: '#about',
  },
  {
    id: 3,
    name: 'Projects',
    href: '#projects',
  },
  {
    id: 4,
    name: 'Experience',
    href: '#work',
  },
  {
    id: 5,
    name: 'Contact',
    href: '#contact',
  },
  {
    id: 6,
    name: 'Photo Booth',
    href: '/photobooth',
  },
];

export const clientReviews = [
  
];

export const myProjects = [
  {
    title: 'Port of Singapore Authority CodeSprint 2024',
    desc: 'An AI-powered platform for Port Singapore Authority (PSA) to enhance collaboration, mentorship, and career development within the organization.',
    subdesc:
      'The platform will provide employees with personalized learning paths, mentorship opportunities, and career development resources.',
    href: 'https://psa-codesprint-2024-eit6.vercel.app/',
    texture: '/textures/project/recording5.mp4',
    logo: '/assets/psa.png',
    logoStyle: {

      backgroundColor: '#ffffff',
      border: '0.2px solid #36201D',
      boxShadow: '0px 0px 60px 0px #AA3C304D',
      padding: '0',

    },
    spotlight: '/assets/spotlight1.png',
    tags: [
      {
        id: 1,
        name: 'Next.js',
        path: '/assets/nextjs1.png',
      },
      {
        id: 2,
        name: 'TailwindCSS',
        path: 'assets/tailwindcss.png',
      },
      {
        id: 3,
        name: 'TypeScript',
        path: '/assets/typescript.png',
      },
      {
        id: 4,
        name: 'LangChain',
        path: '/assets/langchain.png',
      },
    ],
  },
  {
    title: 'Piggify - Personal Finance App',
    desc: 'Piggify redefines how people manage shared expenses and keep track of their financial interactions with friends.',
    subdesc:
      'Features include: User Account Authentication, Expense Tracking, Financial Analysis and Breakdown, Friend-to-Friend Money Management including repayment reminder notifications and Gamification features.',
    href: 'https://drive.google.com/file/d/1gVNR2Ard0TLCyw1u79vHcYyx4r1RrJ3q/view?usp=drive_link',
    texture: '/textures/project/piggifydemo.mp4',
    logo: '/assets/piggify.png',
    logoStyle: {
      backgroundColor: '#13202F',
      border: '0.2px solid #17293E',
      boxShadow: '0px 0px 60px 0px #2F6DB54D',
      padding: '0',
    },
    spotlight: '/assets/spotlight2.png',
    tags: [
      {
        id: 1,
        name: 'React.js',
        path: '/assets/react.svg',
      },
      {
        id: 2,
        name: 'TailwindCSS',
        path: 'assets/tailwindcss.png',
      },
      {
        id: 3,
        name: 'TypeScript',
        path: '/assets/typescript.png',
      },
      {
        id: 4,
        name: 'Supabase',
        path: '/assets/supabase.jpg',
      },
    ],
  }
];

export const calculateSizes = (isSmall, isMobile, isTablet) => {
  return {
    deskScale: isSmall ? 0.045 : isMobile ? 0.055 : 0.06,
    deskPosition: isMobile ? [0, -4.5, 0] : [0, -5.5, 0],
    cubePosition: isSmall ? [3.5, -5, 0] : isMobile ? [4.5, -5, 0] : isTablet ? [5, -5, 0] : [6.5, -5.5, 0],
    reactLogoPosition: isSmall ? [3, 4, 0] : isMobile ? [4, 4, 0] : isTablet ? [5, 4, 0] : [8, 3, 0],
    ringPosition: isSmall ? [-4, 7, 0] : isMobile ? [-8, 10, 0] : isTablet ? [-10, 10, 0] : [-9, 4, 0],
    targetPosition: isSmall ? [-4, -7, -10] : isMobile ? [-7, -8, -10] : isTablet ? [-9, -7, -10] : [-10, -10, -14],
  };
};

export const workExperiences = [
  {
    id: 1,
    name: "Central Provident Fund Board",
    pos: "Software Engineer",
    duration: "Jan 2025 - Dec 2025",
    title: "Robotics Automation Engineer - Investment Management Department",
    icon: "/assets/cpf.png",
    animation: "victory",
  },
];
