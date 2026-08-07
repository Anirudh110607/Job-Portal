const bcrypt = require('bcryptjs');
const mockStore = require('./src/utils/mockStore');

const seedMockStore = async () => {
  if (mockStore.users.length > 0) return; // Already seeded

  console.log('[Seeder] Populating high-quality demo data...');

  const hashedPassword = await bcrypt.hash('Password123!', 10);

  // 1. Admin User
  const admin = mockStore.addUser({
    name: 'System Admin',
    email: 'admin@hirepulse.com',
    password: hashedPassword,
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop'
  });

  // 2. Recruiters
  const recruiter1 = mockStore.addUser({
    name: 'Sarah Jenkins',
    email: 'recruiter@techcorp.com',
    password: hashedPassword,
    role: 'recruiter',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop',
    bio: 'Lead Talent Acquisition Partner at TechCorp Systems.'
  });

  const recruiter2 = mockStore.addUser({
    name: 'Marcus Vance',
    email: 'hr@innovate.io',
    password: hashedPassword,
    role: 'recruiter',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop',
    bio: 'Senior Technical Recruiter specializing in AI and cloud applications.'
  });

  // 3. Candidates
  const candidate1 = mockStore.addUser({
    name: 'Alex Rivera',
    email: 'candidate1@gmail.com',
    password: hashedPassword,
    role: 'candidate',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop',
    bio: 'Full Stack Engineer passionate about React, Node.js, and high-performance Web APIs.',
    location: 'San Francisco, CA',
    skills: ['React', 'JavaScript', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'TypeScript'],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    portfolio: 'https://alexrivera.dev',
    experience: [
      {
        title: 'Frontend Developer',
        company: 'WebCraft Studio',
        startDate: '2022',
        endDate: 'Present',
        current: true,
        description: 'Built responsive micro-frontend components serving 500k monthly active users.'
      }
    ],
    education: [
      {
        degree: 'B.S. Computer Science',
        institution: 'University of California, Berkeley',
        startYear: '2018',
        endYear: '2022'
      }
    ]
  });

  const candidate2 = mockStore.addUser({
    name: 'Elena Rostova',
    email: 'candidate2@gmail.com',
    password: hashedPassword,
    role: 'candidate',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop',
    bio: 'UI/UX & Product Designer crafting accessible human-centered interfaces.',
    location: 'Austin, TX',
    skills: ['Figma', 'UI/UX Design', 'Design Systems', 'User Research', 'Prototyping', 'CSS3']
  });

  // 4. Companies
  const company1 = mockStore.addCompany({
    name: 'TechCorp Systems',
    recruiterId: recruiter1._id,
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&h=120&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=300&fit=crop',
    tagline: 'Empowering global enterprise through cloud intelligence',
    about: 'TechCorp Systems is a global technology pioneer building high-scale distributed systems and developer automation tools.',
    website: 'https://techcorp.example.com',
    industry: 'Cloud Computing & Software',
    size: '500-1,000 employees',
    location: 'San Francisco, CA'
  });

  const company2 = mockStore.addCompany({
    name: 'Innovate AI',
    recruiterId: recruiter2._id,
    logo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=120&h=120&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=300&fit=crop',
    tagline: 'Next-generation AI workflows for developers',
    about: 'Innovate AI crafts state-of-the-art machine learning platforms and generative tools for enterprise engineering teams.',
    website: 'https://innovate.ai',
    industry: 'Artificial Intelligence',
    size: '100-250 employees',
    location: 'New York, NY'
  });

  // 5. Jobs
  const job1 = mockStore.addJob({
    title: 'Senior Full Stack Software Engineer',
    recruiterId: recruiter1._id,
    companyId: company1._id,
    category: 'Software Engineering',
    jobType: 'Full Time',
    workplaceType: 'Remote',
    experienceLevel: 'Senior Level',
    location: 'San Francisco, CA (Remote)',
    salaryRange: '$140,000 - $180,000 / year',
    description: 'We are seeking an exceptional Senior Full Stack Engineer to architect and build our next-generation SaaS engine. You will own core product features end-to-end.',
    responsibilities: [
      'Architect and ship clean, scalable React frontend components and Node.js microservices.',
      'Optimize database queries and API response times for high availability.',
      'Collaborate with Product and Design teams to refine UX workflows.'
    ],
    requirements: [
      '5+ years of full-stack engineering experience using React, Node.js, and MongoDB / PostgreSQL.',
      'Strong understanding of RESTful API design, authentication (JWT/OAuth), and microservice architectures.',
      'Track record of delivering production-ready applications.'
    ],
    benefits: [
      'Competitive Equity package & 401(k) matching',
      '100% remote flexibility with home office stipend ($1,500)',
      'Unlimited PTO & comprehensive health insurance'
    ],
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Express', 'Tailwind CSS']
  });

  const job2 = mockStore.addJob({
    title: 'Senior UI/UX Product Designer',
    recruiterId: recruiter1._id,
    companyId: company1._id,
    category: 'Design & Creative',
    jobType: 'Full Time',
    workplaceType: 'Hybrid',
    experienceLevel: 'Mid Level',
    location: 'San Francisco, CA',
    salaryRange: '$120,000 - $150,000 / year',
    description: 'Join our design system team to create beautiful, accessible user experiences across web and mobile platforms.',
    responsibilities: [
      'Design wireframes, high-fidelity prototypes, and component design tokens in Figma.',
      'Conduct user testing sessions and translate insights into elegant UI solutions.'
    ],
    requirements: [
      '3+ years of product design experience with a strong portfolio.',
      'Proficiency in Figma, design systems, and visual prototyping tools.'
    ],
    benefits: ['Health, Dental, Vision', 'Hybrid work policy (2 days in office)'],
    skills: ['Figma', 'UI/UX Design', 'Design Systems', 'Prototyping']
  });

  const job3 = mockStore.addJob({
    title: 'Lead AI Infrastructure Engineer',
    recruiterId: recruiter2._id,
    companyId: company2._id,
    category: 'AI & Machine Learning',
    jobType: 'Full Time',
    workplaceType: 'Remote',
    experienceLevel: 'Lead / Executive',
    location: 'New York, NY (Remote)',
    salaryRange: '$170,000 - $220,000 / year',
    description: 'Lead our AI cloud deployment infrastructure, scaling inference endpoints and LLM pipelines.',
    responsibilities: ['Build high-throughput AI API pipelines and Kubernetes clusters.'],
    requirements: ['Python, Docker, Kubernetes, PyTorch, Ray, AWS.'],
    benefits: ['Stock options, 401k match, Tech allowance'],
    skills: ['Python', 'Docker', 'Kubernetes', 'PyTorch', 'AWS']
  });

  const job4 = mockStore.addJob({
    title: 'Frontend React Developer',
    recruiterId: recruiter2._id,
    companyId: company2._id,
    category: 'Software Engineering',
    jobType: 'Contract',
    workplaceType: 'Remote',
    experienceLevel: 'Mid Level',
    location: 'Austin, TX (Remote)',
    salaryRange: '$90,000 - $120,000 / year',
    description: 'Build fast, responsive dashboard interfaces for web analytics.',
    responsibilities: ['Develop clean React components and state management with Redux/Zustand.'],
    requirements: ['React, Tailwind CSS, JavaScript ES6+, HTML5/CSS3.'],
    benefits: ['Flexible hours, Remote work'],
    skills: ['React', 'Tailwind CSS', 'JavaScript', 'HTML5']
  });

  // 6. Demo Application
  const app1 = mockStore.addApplication({
    jobId: job1._id,
    candidateId: candidate1._id,
    coverLetter: 'I am excited to apply for the Senior Full Stack Engineer role at TechCorp Systems. With extensive experience in React and Node.js microservices, I can contribute immediately to your product roadmap.',
    status: 'shortlisted',
    matchPercentage: 94
  });

  // 7. Demo Interview
  mockStore.addInterview({
    applicationId: app1._id,
    jobId: job1._id,
    candidateId: candidate1._id,
    recruiterId: recruiter1._id,
    date: '2026-08-15',
    time: '14:00 EST',
    type: 'Video Call',
    meetingLink: 'https://meet.google.com/hirepulse-tech-interview',
    notes: 'Round 1 Architecture & Technical Deep Dive with Engineering Manager.'
  });

  // 8. Notifications
  mockStore.addNotification({
    userId: candidate1._id,
    title: 'Application Shortlisted! 🎉',
    message: 'Your application for Senior Full Stack Software Engineer at TechCorp Systems has been shortlisted.',
    type: 'application_update'
  });

  console.log('[Seeder] Demo dataset seeded successfully.');
  console.log(`- Candidates: candidate1@gmail.com / Password123!`);
  console.log(`- Recruiters: recruiter@techcorp.com / Password123!`);
  console.log(`- Admin: admin@hirepulse.com / Password123!`);
};

module.exports = { seedMockStore };
