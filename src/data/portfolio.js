export const profile = {
  name: "ZAIDAN IBNUSABIL IRYANTO",
  phone: "082121550083",
  email: "zaidan.iryanto@gmail.com",
  linkedin: "https://www.linkedin.com/in/ibnusabil/",
  github: "https://github.com/ibnusabil43",
  summary: "Informatics Fresh Graduate with professional experience in mobile app development and data analysis. Possess hands-on experience in designing and developing Android applications, implementing UI/UX principles, integrating APIs, and managing databases. Additionally, skilled in data preprocessing, text classification, and building machine learning models. Currently looking to continue the development of skills in mobile development and data analytics."
};

export const education = [
  {
    institution: "Telkom University - Bandung, West Java",
    period: "Sep 2021 - Feb 2025",
    degree: "Bachelor of Informatics",
    gpa: "3.83/4.00",
    details: [
      "Qualified to be Laboratory Assistant for Informatics Laboratory of Telkom University in 6th semester for 1 year contract",
      "Qualified to be Practicum Assistant for 5 courses in total: Programming Algorithm, Data Structures, Computer Networks, Object-Oriented Programming (OOP), and Mobile Programming",
      "Qualified to be Teaching Assistant for the Programming Algorithm course",
      "Published a research paper titled \"Emotion Classification Based on Social Media X Posting Patterns in Bahasa using RoBERTa\" at the ICoDSA conference",
      "Successfully completed the Bangkit Academy Mobile Development Cohort, an intensive Android development program led by Google, GoTo, and Traveloka, focusing on Kotlin, clean architecture, and real-world project development",
      "Successfully achieved Top 50 position in the Product-Based Capstone Project of the Bangkit Academy",
      "Graduated as a fresh graduate with cumlaude honors and a GPA of 3.83"
    ]
  }
];

export const skills = {
  "Programming Languages": [
    "Kotlin",
    "Dart",
    "Python",
    "Java",
    "JavaScript",
    "C++",
    "PHP"
  ],
  "Mobile Development": [
    "Flutter",
    "Android Development",
    "Jetpack Compose",
    "Firebase",
    "RESTful API"
  ],
  "Web Development": [
    "Laravel",
    "Vue.js",
    "React",
    "HTML/CSS",
    "Tailwind CSS"
  ],
  "Machine Learning & Data": [
    "TensorFlow",
    "PyTorch",
    "Transformers (Hugging Face)",
    "Natural Language Processing",
    "Computer Vision",
    "OpenCV"
  ],
  "Tools & Databases": [
    "Git & GitHub",
    "MySQL",
    "Postman",
    "Android Studio",
    "VS Code"
  ]
};

export const projects = [
  {
    id: 1,
    title: "bantu.in",
    description: "Web-based platform connecting volunteers with social causes and charitable activities. Developed using Laravel framework with MySQL database and responsive UI design.",
    tech: ["Laravel", "Blade", "MySQL", "Tailwind CSS"],
    github: "https://github.com/Ibnusabil43/bantu.in",
    image: "project-bantu.jpg",
    featured: true
  },
  {
    id: 2,
    title: "QuitZone",
    description: "Capstone project for Bangkit Academy 2024. Android application to help users quit smoking with habit tracking, motivational features, and health monitoring. Developed the mobile interface using Kotlin and Jetpack Compose.",
    tech: ["Kotlin", "Jetpack Compose", "Firebase", "Retrofit", "MVVM"],
    github: "https://github.com/Quit-Zone/MD",
    image: "project-quitzone.jpg",
    featured: true
  },
  {
    id: 3,
    title: "Indonesian Emotion Classification using RoBERTa",
    description: "Research project implementing transformer-based model for emotion classification in Indonesian text. Fine-tuned RoBERTa model to detect seven emotion categories with improved accuracy over baseline models.",
    tech: ["Python", "PyTorch", "Transformers", "Hugging Face", "NLP"],
    github: "https://github.com/Ibnusabil43/emotion-classifier-roberta",
    image: "project-emotion.jpg",
    featured: true
  },
  {
    id: 4,
    title: "Real-Time Face Recognition System",
    description: "Computer vision application implementing facial recognition using deep learning. Detects and recognizes faces in real-time video streams with trained neural network models.",
    tech: ["Python", "OpenCV", "TensorFlow", "Keras", "Face Recognition"],
    github: "https://github.com/Ibnusabil43/face-recognition",
    image: "project-face.jpg",
    featured: false
  },
  {
    id: 5,
    title: "AniHunt",
    description: "Mobile application for anime enthusiasts to discover, track, and review anime series. Features anime database integration, watchlist management, and user reviews.",
    tech: ["Flutter", "Dart", "REST API", "Provider"],
    github: "https://github.com/Ibnusabil43/AniHunt",
    image: "project-anihunt.jpg",
    featured: true
  },
  {
    id: 6,
    title: "KeebsHub",
    description: "E-commerce mobile application for mechanical keyboards and accessories. Includes product catalog, shopping cart functionality, and user authentication.",
    tech: ["Flutter", "Dart", "Firebase", "Provider"],
    github: "https://github.com/Ibnusabil43/keebshub",
    image: "project-keebshub.jpg",
    featured: false
  },
  {
    id: 7,
    title: "Rythm",
    description: "Music streaming mobile application with playlist creation, favorites management, and music discovery features. Built with Flutter for cross-platform deployment.",
    tech: ["Flutter", "Dart", "REST API", "Audio Players"],
    github: "https://github.com/Ibnusabil43/rythm",
    image: "project-rythm.jpg",
    featured: true
  }
];

export const experience = [
  {
    title: "IT Staff",
    company: "CV. Dimensi Cakrawala",
    location: "Cirebon",
    period: "Sep 2025 - Present",
    responsibilities: [
      "Installing and configuring computer hardware, software, systems, networks, printers, and scanners",
      "Design and create Google Forms as a platform for conducting online psychology tests",
      "Develop and maintain Excel templates to analyze data from psychology tests",
      "Create formulas and basic automation to assist in calculating scores and interpreting test results including: SPM, IST, CFIT, PAPI Kostik, EPPS, MBTI, RIASEC",
      "Ensure that all data from google form is accurate and complete for each test participant",
      "Enter psychology test result data into the system or database as per established procedures",
      "Prepare reports of psychology test results based on processed data",
      "Present the reports in a clear and informative format for relevant parties"
    ],
    images: []
  },
  {
    title: "IT Staff Intern",
    company: "Telkom Indonesia",
    location: "Jakarta",
    period: "Jun 2024 - Sep 2024",
    responsibilities: [
      "Developed a mobile application prototype for the Assurance and Fulfillment Ticketing System at Indihome IT Division - OPO Telkom Indonesia",
      "Designed UAT (User Acceptance Testing) and IT (Integration Testing) plans to ensure prototype functionality and system compatibility",
      "Created architecture and integration plans, implementing UI prototypes using Flutter and API integration with the ticketing database",
      "Planned and managed prototype development using Agile Scrum methodology, including defining user stories, sprint planning, backlog management, and iterative development to ensure a structured and efficient workflow"
    ],
    images: []
  },
  {
    title: "Laboratory Assistant",
    company: "Informatics Laboratory Telkom University",
    location: "Bandung, West Java",
    period: "Jul 2024 - Jun 2025",
    responsibilities: [
      "Managed practicum assistant recruitment, question bank, practicum problem creation, score documentation, and laboratory inventory to ensure smooth operations",
      "Optimized the recruitment process, streamlined question bank management, and improved inventory tracking for better efficiency",
      "Enhanced assistant recruitment efficiency, improved practicum evaluation accuracy, and ensured proper honorarium distribution, contributing to a more organized laboratory system"
    ],
    images: []
  },
  {
    title: "Assistant Lecturer",
    company: "Faculty of Informatics, Telkom University",
    location: "Bandung, West Java",
    period: "Jul 2024 - Jan 2025",
    responsibilities: [
      "Supported lecturers in teaching Programming Algorithm",
      "Assisted in preparing lectures, assignments, and exams, ensuring alignment with course objectives"
    ],
    images: []
  },
  {
    title: "Mobile Development Cohort",
    company: "Bangkit Academy led by Google, Tokopedia, Gojek, & Traveloka (MSIB Kampus Merdeka Batch 6)",
    location: "",
    period: "Feb 2024 - Jul 2024",
    responsibilities: [
      "Completed an intensive training program in Android development using Kotlin",
      "Developed a mobile application project following industry best practices",
      "Learned and applied clean architecture, UI/UX principles, and API integration",
      "Collaborated in a cross-functional team with machine learning and cloud computing cohorts",
      "Gained hands-on experience in Agile development, project management, and teamwork"
    ],
    images: []
  },
  {
    title: "Practicum Assistant",
    company: "Informatics Laboratory Telkom University",
    location: "Bandung, West Java",
    period: "Jul 2023 - Jun 2025",
    responsibilities: [
      "Assisted students in hands-on lab sessions for Programming Algorithm, Data Structures, Computer Networks, Object-Oriented Programming (OOP), Mobile Programming",
      "Provided technical explanations, troubleshooting support, and debugging assistance",
      "Evaluated student assignments and offered constructive feedback to improve understanding",
      "Helped lecturers prepare practicum materials, assessments, and instructional guides"
    ],
    images: []
  },
  {
    title: "IT Support",
    company: "Ordinat Consultant",
    location: "Cirebon, West Java",
    period: "Jul 2020 - Jan 2025",
    responsibilities: [
      "Accurately compiling and organizing data from participants' psychological test results to ensure comprehensive and accessible records",
      "Diligently inputting data from psychological test results into the excel program",
      "Designing and developing Excel programs for the precise calculation and analysis of psychological test results",
      "Developing and implementing technical procedures for the seamless execution of online psychological tests, ensuring a smooth and user-friendly experience for participants"
    ],
    images: []
  }
];

export const achievements = [
  {
    title: "Published Research Paper at ICoDSA Conference",
    description: "Published a research paper titled \"Emotion Classification Based on Social Media X Posting Patterns in Bahasa using RoBERTa\" at the ICoDSA conference",
    relatedRole: "Student Researcher",
    institution: "Telkom University",
    period: "Sep 2021 - Feb 2025",
    year: "2024",
    category: "Research"
  },
  {
    title: "Top 50 Product-Based Capstone Project - Bangkit Academy",
    description: "Successfully achieved Top 50 position in the Product-Based Capstone Project of the Bangkit Academy",
    relatedRole: "Mobile Development Cohort",
    institution: "Bangkit Academy led by Google, Tokopedia, Gojek, & Traveloka",
    period: "Feb 2024 - Jul 2024",
    year: "2024",
    category: "Professional"
  },
  {
    title: "Bangkit Academy Mobile Development Graduate",
    description: "Successfully completed the Bangkit Academy Mobile Development Cohort, an intensive Android development program led by Google, GoTo, and Traveloka, focusing on Kotlin, clean architecture, and real-world project development",
    relatedRole: "Mobile Development Cohort",
    institution: "Bangkit Academy led by Google, Tokopedia, Gojek, & Traveloka",
    period: "Feb 2024 - Jul 2024",
    year: "2024",
    category: "Professional"
  },
  {
    title: "Graduated with Cumlaude Honors",
    description: "Graduated as a fresh graduate with cumlaude honors and a GPA of 3.83",
    relatedRole: "Bachelor of Informatics",
    institution: "Telkom University - Bandung, West Java",
    period: "Sep 2021 - Feb 2025",
    year: "2025",
    category: "Academic"
  },
  {
    title: "Qualified as Laboratory Assistant",
    description: "Qualified to be Laboratory Assistant for Informatics Laboratory of Telkom University in 6th semester for 1 year contract",
    relatedRole: "Laboratory Assistant",
    institution: "Informatics Laboratory Telkom University",
    period: "Jul 2024 - Jun 2025",
    year: "2024",
    category: "Academic"
  },
  {
    title: "Qualified as Practicum Assistant for 5 Courses",
    description: "Qualified to be Practicum Assistant for 5 courses in total: Programming Algorithm, Data Structures, Computer Networks, Object-Oriented Programming (OOP), and Mobile Programming",
    relatedRole: "Practicum Assistant",
    institution: "Informatics Laboratory Telkom University",
    period: "Jul 2023 - Jun 2025",
    year: "2023",
    category: "Academic"
  },
  {
    title: "Qualified as Teaching Assistant",
    description: "Qualified to be Teaching Assistant for the Programming Algorithm course",
    relatedRole: "Assistant Lecturer",
    institution: "Faculty of Informatics, Telkom University",
    period: "Jul 2024 - Jan 2025",
    year: "2024",
    category: "Academic"
  }
];
