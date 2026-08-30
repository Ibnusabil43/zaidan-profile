export const profile = {
  name: "ZAIDAN IBNUSABIL IRYANTO",
  phone: "082121550083",
  email: "zaidan.iryanto@gmail.com",
  linkedin: "https://www.linkedin.com/in/ibnusabil/",
  github: "https://github.com/ibnusabil43",
  status: "Backend Engineer @ BRI · Jakarta, ID",
  roles: ["Backend Engineer", "Core Banking", "Full-Stack Developer"],
  // PRD DR-6 / FR-25: the file itself lives once, in apps/main/public/ —
  // this is metadata only. `available: false` until the PDF actually exists;
  // every surface must render a disabled, honestly-labeled button rather
  // than a link that 404s (same pattern as FR-8/PRO-B1's project screenshots).
  resume: {
    filename: "resume.pdf",
    label: "Download Resume",
    available: false,
  },
  summary:
    "Backend engineer at Bank Rakyat Indonesia, working on Temenos T24 core banking: batch services, InfoBasic routines, and the integrations between T24 and external delivery channels. Outside the bank I design and ship internal systems end to end, from Next.js dashboards to Python scoring services and the developer tooling my own team uses. Most drawn to problems where the tooling doesn't exist yet."
};

export const education = [
  {
    institution: "Telkom University - Bandung, West Java",
    period: "Sep 2021 - Feb 2025",
    degree: "Bachelor of Informatics",
    gpa: "3.83/4.00",
    details: [
      "Graduated cum laude with a GPA of 3.83/4.00",
      "Published a research paper titled \"Emotion Classification Based on Social Media X Posting Patterns in Bahasa using RoBERTa\" at the ICoDSA conference",
      "Laboratory Assistant for the Informatics Laboratory of Telkom University, on a one-year contract",
      "Practicum Assistant for 5 courses: Programming Algorithm, Data Structures, Computer Networks, Object-Oriented Programming, and Mobile Programming",
      "Teaching Assistant for the Programming Algorithm course",
      "Completed the Bangkit Academy Mobile Development Cohort led by Google, GoTo, and Traveloka, and placed in the Top 50 of its product-based capstone project"
    ]
  }
];

export const skills = {
  "Core Banking": [
    "Temenos T24",
    "InfoBasic (jBC)",
    "TAFJ",
    "OFS",
    "jBASE"
  ],
  "Backend": [
    "Python",
    "Django",
    "Flask",
    "REST API",
    "Node.js"
  ],
  "Web": [
    "TypeScript",
    "Next.js",
    "React",
    "Vue 3",
    "Laravel",
    "Tailwind CSS"
  ],
  "Data & Infrastructure": [
    "PostgreSQL",
    "MySQL",
    "Supabase",
    "Prisma",
    "Docker",
    "Google APIs"
  ],
  "Machine Learning": [
    "PyTorch",
    "TensorFlow",
    "Transformers (Hugging Face)",
    "Natural Language Processing",
    "OpenCV"
  ],
  "Mobile": [
    "Flutter",
    "Kotlin",
    "Jetpack Compose",
    "Firebase"
  ]
};

export const projects = [
  {
    id: "t24-toolkit",
    title: "T24 Toolkit",
    subtitle: "VS Code extension for Temenos T24 InfoBasic",
    tier: 1,
    year: "2026",
    role: "Sole developer · internal tool at BRI",
    internal: true,
    description:
      "Temenos T24 runs on InfoBasic, a proprietary language with no modern editor support. I built the toolchain myself: compile, diagnostics, navigation, and linting, all inside VS Code.",
    highlights: [
      "Compiles through the TAFJ launcher and parses compiler output into editor diagnostics, distinguishing a genuine code error from a broken environment",
      "Language server level features the product itself never shipped: go to definition and find references for $INSERT, field autocomplete for I_F.* tables, and LOCAL.REF hovers resolved from MULTI.GET.LOC.REF calls",
      "House convention linter validated against the real 814 file corpus with zero false positives before release",
      "3,461 lines of production TypeScript across 27 modules, backed by 1,634 lines of tests; cross-platform on macOS and Windows"
    ],
    tech: ["TypeScript", "VS Code API", "esbuild", "TextMate Grammar", "Node.js"],
    links: [],
    image: "project-t24-toolkit.jpg",
    featured: true
  },
  {
    id: "ordinat-dashboard",
    title: "Ordinat Dashboard",
    subtitle: "Psychological assessment platform, two services",
    tier: 1,
    year: "2026",
    role: "Sole developer",
    description:
      "An internal platform that runs a psychology bureau's entire assessment pipeline, from scheduling a school session to exporting the scored recap. Two services by design: a Next.js dashboard that users see, and a Flask scoring engine that is never exposed to the public internet and is reachable only through the dashboard's own API routes.",
    highlights: [
      "Event lifecycle modelled as a state machine (SCHEDULED → ONGOING → REKAP → DONE), with the first transition driven by a daily cron job and a manual override",
      "Role-based access control across admin, field coordinator, and tester, enforced through Supabase app metadata",
      "Asynchronous scoring jobs: submit, poll for progress, review borderline matches by hand, export to Excel",
      "Fuzzy-matching engine with configurable thresholds to reconcile raw test results against recap data, cutting manual scoring work",
      "Google Sheets and Drive integration for data sync and report generation"
    ],
    tech: ["Next.js 15", "React 19", "TypeScript", "Prisma", "Supabase", "Flask", "Docker"],
    links: [
      { label: "Live", href: "https://ordinatdashboard.site" },
      { label: "Dashboard", href: "https://github.com/Ibnusabil43/ordinat-dashboard" },
      { label: "Scoring engine", href: "https://github.com/Ibnusabil43/recap-fuzzy-score-matcher" }
    ],
    image: "project-ordinat-dashboard.jpg",
    featured: true
  },
  {
    id: "emotion-classifier",
    title: "Bahasa Emotion Classifier",
    subtitle: "Published research at the ICoDSA conference",
    tier: 1,
    year: "2025",
    role: "Researcher",
    description:
      "Transformer-based emotion classification for Indonesian text. Fine-tuned RoBERTa across seven emotion categories, improving on the baseline models. Published at the ICoDSA conference as \"Emotion Classification Based on Social Media X Posting Patterns in Bahasa using RoBERTa\".",
    highlights: [],
    tech: ["Python", "PyTorch", "Transformers", "Hugging Face", "NLP"],
    links: [
      { label: "Code", href: "https://github.com/Ibnusabil43/Bahasa-Emotion-Classifier-using-RoBERTa" }
    ],
    image: "project-emotion.jpg",
    featured: true
  },
  {
    id: "quitzone",
    title: "QuitZone",
    subtitle: "Top 50 Bangkit Academy capstone",
    tier: 1,
    year: "2024",
    role: "Mobile developer",
    description:
      "Android application helping users quit smoking, with habit tracking, motivational features, and health monitoring. Built the mobile client in Kotlin and Jetpack Compose. Placed in the Top 50 of the Bangkit Academy product-based capstone project.",
    highlights: [],
    tech: ["Kotlin", "Jetpack Compose", "Firebase", "Retrofit", "MVVM"],
    links: [{ label: "Code", href: "https://github.com/Quit-Zone/MD" }],
    image: "project-quitzone.jpg",
    featured: true
  },
  {
    id: "ordinat-profile",
    title: "Ordinat Company Profile",
    subtitle: "Client website for a psychology consultancy",
    tier: 2,
    year: "2026",
    role: "Sole developer",
    description:
      "Company profile site for a psychology consultancy serving schools, companies, and migrant workers across Indonesia. Showcases services, team, and a partner roster of 95+ clients.",
    highlights: [],
    tech: ["Vue 3.5", "TypeScript", "Vite 6", "Tailwind CSS"],
    links: [
      { label: "Live", href: "https://ordinat-profile.vercel.app" },
      { label: "Code", href: "https://github.com/Ibnusabil43/ordinat-company-profile-vue" }
    ],
    image: "project-ordinat-profile.jpg",
    featured: false
  },
  {
    id: "bantu-in",
    title: "bantu.in",
    subtitle: "Academic & digital help platform",
    tier: 2,
    year: "2025",
    role: "Sole developer",
    description:
      "Platform connecting people with academic and digital assistance services. Originally built on Laravel with Blade templates, later rewritten as a Vue 3 single-page app with GSAP transitions.",
    highlights: [],
    tech: ["Laravel", "Vue 3", "GSAP", "MySQL", "Tailwind CSS"],
    links: [
      { label: "Live", href: "https://bantu-in.vercel.app" },
      { label: "Laravel", href: "https://github.com/Ibnusabil43/bantu.in" },
      { label: "Vue rewrite", href: "https://github.com/Ibnusabil43/bantu.in-vue" }
    ],
    image: "project-bantu.jpg",
    featured: false
  }
];

/** Older work, shown as a compact list rather than full cards. */
export const earlierWork = [
  {
    title: "AniHunt",
    year: "2023",
    tech: "Flutter · REST API",
    href: "https://github.com/Ibnusabil43/AniHunt",
    note: "Anime discovery and watchlist app"
  },
  {
    title: "Rythm",
    year: "2023",
    tech: "Flutter · Audio Players",
    href: "https://github.com/Ibnusabil43/rythm",
    note: "Music streaming client"
  },
  {
    title: "KeebsHub",
    year: "2023",
    tech: "Flutter · Firebase",
    href: "https://github.com/Ibnusabil43/keebshub",
    note: "Mechanical keyboard storefront"
  },
  {
    title: "Real-Time Face Recognition",
    year: "2023",
    tech: "Python · OpenCV · TensorFlow",
    href: "https://github.com/Ibnusabil43/RealTimeFaceRecognition",
    note: "Face detection over live video"
  },
  {
    title: "CineHub",
    year: "2024",
    tech: "Java · SQL",
    href: "https://github.com/Ibnusabil43/CineHub",
    note: "Film catalogue and watch tracker"
  },
  {
    title: "Multi Linked List Documentation",
    year: "2025",
    tech: "Vue 3",
    href: "https://github.com/Ibnusabil43/data-structure-final-project-documentation",
    note: "Interactive teaching reference built while assisting the Data Structures course"
  },
  {
    title: "TypingTest",
    year: "2024",
    tech: "JavaScript",
    href: "https://github.com/Ibnusabil43/TypingTest",
    note: "Typing speed trainer"
  }
];

export const experience = [
  {
    title: "Back End Developer",
    company: "PT Bank Rakyat Indonesia (Persero) Tbk",
    location: "Jakarta",
    period: "May 2026 - Present",
    start: "2026-05",
    end: null,
    org: "Bank Rakyat Indonesia",
    type: "Full-time",
    responsibilities: [
      "Develop T24 batch services and InfoBasic routines supporting core banking business processes",
      "Develop and maintain surrounding core banking applications using Python and Django with MySQL, delivering within a 3-week SLA per request",
      "Build and maintain integrations between Temenos T24 and external delivery channels via API and OFS services",
      "Implement backend services and business logic based on approved technical specifications for core banking operations",
      "Built a VS Code extension for T24 InfoBasic covering syntax highlighting, compile, diagnostics, navigation, and linting, now used daily by 6 developers on the team",
      "Troubleshoot and resolve production issues across T24 and its surrounding applications"
    ],
    images: []
  },
  {
    title: "IT Specialist, BRIlian Future Leader Program (BFLP)",
    company: "PT Bank Rakyat Indonesia (Persero) Tbk",
    location: "Jakarta",
    period: "Jan 2026 - Present",
    start: "2026-01",
    end: null,
    org: "Bank Rakyat Indonesia",
    type: "Full-time",
    responsibilities: [
      "Selected into BRI's flagship development programme for future IT specialists",
      "Rotational training across core banking systems, engineering practice, and banking domain knowledge"
    ],
    images: []
  },
  {
    title: "Full Stack Developer",
    company: "Ordinat Consultant",
    location: "Cirebon, West Java (Remote)",
    period: "Jul 2026 - Present",
    start: "2026-07",
    end: null,
    org: "Ordinat Consultant",
    type: "Freelance",
    responsibilities: [
      "Built an internal psychological-testing management dashboard with Next.js 15, React 19, TypeScript, and Tailwind, backed by Supabase (PostgreSQL + Auth) and Prisma",
      "Implemented role-based access control for admin, field coordinator, and tester roles, with an end-to-end event workflow from scheduling to completion",
      "Developed automated session scheduling and subtest link distribution with cron-based jobs and manual override, plus real-time monitoring dashboards",
      "Integrated Google Sheets and Drive APIs to sync assessment data and generate reports",
      "Built a Python scoring-automation service exposing REST endpoints for job submission, status polling, borderline-match review, and Excel export, containerised with Docker",
      "Designed a fuzzy-matching engine with configurable thresholds to reconcile raw test results against recap data, cutting manual scoring effort",
      "Developed the company profile website using Vue 3, TypeScript, Vite, and Tailwind"
    ],
    images: []
  },
  {
    title: "IT Staff",
    company: "CV. Dimensi Cakrawala",
    location: "Cirebon, West Java",
    period: "Sep 2025 - Apr 2026",
    start: "2025-09",
    end: "2026-04",
    org: "CV. Dimensi Cakrawala",
    type: "Full-time",
    responsibilities: [
      "Installed and configured computer hardware, software, systems, networks, printers, and scanners",
      "Designed Google Forms as the delivery platform for online psychology tests",
      "Developed and maintained Excel templates to analyse psychology test data",
      "Created formulas and automation to score and interpret test results including SPM, IST, CFIT, PAPI Kostik, EPPS, MBTI, and RIASEC",
      "Verified that data collected from each participant was accurate and complete",
      "Prepared and presented psychology test reports in a clear, informative format for relevant parties"
    ],
    images: []
  },
  {
    title: "Programming Algorithm Lecturer Assistant",
    company: "Telkom University",
    location: "Bandung, West Java",
    period: "Sep 2024 - Jan 2025",
    start: "2024-09",
    end: "2025-01",
    org: "Telkom University",
    type: "Contract",
    responsibilities: [
      "Supported lecturers in teaching Programming Algorithm",
      "Assisted in preparing lectures, assignments, and exams, ensuring alignment with course objectives"
    ],
    images: []
  },
  {
    title: "Laboratory Assistant",
    company: "Informatics Laboratory, Telkom University",
    location: "Bandung, West Java",
    period: "Jun 2024 - Jun 2025",
    start: "2024-06",
    end: "2025-06",
    org: "Telkom University",
    type: "Contract",
    responsibilities: [
      "Managed practicum assistant recruitment, the question bank, practicum problem creation, score documentation, and laboratory inventory",
      "Troubleshot technical issues on practicum machines to avoid disruption during sessions",
      "Optimised the recruitment process, streamlined question bank management, and improved inventory tracking",
      "Improved practicum evaluation accuracy and ensured correct honorarium distribution"
    ],
    images: []
  },
  {
    title: "IT Staff Intern",
    company: "Telkom Indonesia",
    location: "Jakarta",
    period: "Jun 2024 - Aug 2024",
    start: "2024-06",
    end: "2024-08",
    org: "Telkom Indonesia",
    type: "Internship",
    responsibilities: [
      "Developed a mobile application prototype for the Assurance and Fulfillment Ticketing System at the Indihome IT Division (OPO), Telkom Indonesia",
      "Designed UAT and Integration Testing plans to verify prototype functionality and system compatibility",
      "Created architecture and integration plans, implementing UI prototypes in Flutter with API integration against the ticketing database",
      "Planned and managed prototype development using Agile Scrum, covering user stories, sprint planning, and backlog management"
    ],
    images: []
  },
  {
    title: "Mobile Development Cohort",
    company: "Bangkit Academy led by Google, Tokopedia, Gojek & Traveloka",
    location: "Remote",
    period: "Feb 2024 - Jul 2024",
    start: "2024-02",
    end: "2024-07",
    org: "Bangkit Academy",
    type: "Programme",
    responsibilities: [
      "Completed an intensive Android development programme in Kotlin",
      "Applied clean architecture, UI/UX principles, and API integration to a real project",
      "Collaborated in a cross-functional team alongside machine learning and cloud computing cohorts",
      "Built QuitZone, a smoking-cessation app using Jetpack Compose, which placed in the Top 50 product-based capstone projects"
    ],
    images: []
  },
  {
    title: "Practicum Assistant",
    company: "Informatics Laboratory, Telkom University",
    location: "Bandung, West Java",
    period: "Jul 2023 - Jun 2025",
    start: "2023-07",
    end: "2025-06",
    org: "Telkom University",
    type: "Contract",
    responsibilities: [
      "Assisted students in lab sessions for Programming Algorithm, Data Structures, Computer Networks, Object-Oriented Programming, and Mobile Programming",
      "Provided technical explanations, troubleshooting support, and debugging assistance",
      "Evaluated student assignments and gave constructive feedback",
      "Helped lecturers prepare practicum materials, assessments, and instructional guides"
    ],
    images: []
  },
  {
    title: "IT Support",
    company: "Ordinat Consultant",
    location: "Cirebon, West Java",
    period: "Jul 2020 - Jan 2025",
    start: "2020-07",
    end: "2025-01",
    org: "Ordinat Consultant",
    type: "Part-time",
    responsibilities: [
      "Compiled and organised participants' psychological test results into accessible records",
      "Designed and developed Excel programs for the calculation and analysis of psychological test results",
      "Developed technical procedures for running online psychological tests smoothly for participants"
    ],
    images: []
  }
];

export const achievements = [
  {
    title: "Published Research Paper at ICoDSA Conference",
    description:
      "Published a research paper titled \"Emotion Classification Based on Social Media X Posting Patterns in Bahasa using RoBERTa\" at the ICoDSA conference",
    relatedRole: "Student Researcher",
    institution: "Telkom University",
    period: "Sep 2021 - Feb 2025",
    year: "2024",
    category: "Research"
  },
  {
    title: "Top 50 Product-Based Capstone Project at Bangkit Academy",
    description:
      "Placed in the Top 50 of the Bangkit Academy product-based capstone project with QuitZone",
    relatedRole: "Mobile Development Cohort",
    institution: "Bangkit Academy led by Google, Tokopedia, Gojek & Traveloka",
    period: "Feb 2024 - Jul 2024",
    year: "2024",
    category: "Professional"
  },
  {
    title: "Bangkit Academy Mobile Development Graduate",
    description:
      "Completed the Bangkit Academy Mobile Development Cohort, an intensive Android development programme led by Google, GoTo, and Traveloka, focused on Kotlin, clean architecture, and real-world project development",
    relatedRole: "Mobile Development Cohort",
    institution: "Bangkit Academy led by Google, Tokopedia, Gojek & Traveloka",
    period: "Feb 2024 - Jul 2024",
    year: "2024",
    category: "Professional"
  },
  {
    title: "Graduated with Cum Laude Honours",
    description: "Graduated with cum laude honours and a GPA of 3.83/4.00",
    relatedRole: "Bachelor of Informatics",
    institution: "Telkom University - Bandung, West Java",
    period: "Sep 2021 - Feb 2025",
    year: "2025",
    category: "Academic"
  },
  {
    title: "Qualified as Laboratory Assistant",
    description:
      "Selected as Laboratory Assistant for the Informatics Laboratory of Telkom University on a one-year contract",
    relatedRole: "Laboratory Assistant",
    institution: "Informatics Laboratory, Telkom University",
    period: "Jun 2024 - Jun 2025",
    year: "2024",
    category: "Academic"
  },
  {
    title: "Qualified as Practicum Assistant for 5 Courses",
    description:
      "Selected as Practicum Assistant for Programming Algorithm, Data Structures, Computer Networks, Object-Oriented Programming, and Mobile Programming",
    relatedRole: "Practicum Assistant",
    institution: "Informatics Laboratory, Telkom University",
    period: "Jul 2023 - Jun 2025",
    year: "2023",
    category: "Academic"
  }
];
