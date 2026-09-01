"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent, MouseEvent as ReactMouseEvent } from "react";

type WindowId =
  | "work"
  | "about"
  | "toolbox"
  | "documents"
  | "certificates"
  | "achievements"
  | "terminal"
  | "experiments"
  | "readme"
  | "contact"
  | "hire";

type WinState = {
  id: WindowId;
  title: string;
  icon: string;
  open: boolean;
  minimized: boolean;
  maximized: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  z: number;
};

type DragState = {
  id: WindowId;
  offsetX: number;
  offsetY: number;
};

type ResizeState = {
  id: WindowId;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
};

const projects = [
  {
    number: "01",
    category: "FULL-STACK PRODUCT",
    name: "SeatWise",
    description:
      "Full-stack event ticketing platform with interactive seat maps, dynamic pricing, and real-time checkout. Eliminated double-booking under concurrency with atomic PostgreSQL transactions (SELECT FOR UPDATE) and integrated Stripe Checkout with server-verifiable QR check-in.",
    stack: ["Next.js", "PostgreSQL (Neon)", "Drizzle ORM", "Stripe", "Better-Auth"],
    status: "LIVE / BUILDING",
    github: "https://github.com/vivekstackk/seatwise",
    live: "https://seatwise.onrender.com",
  },
  {
    number: "02",
    category: "BACKEND MICROSERVICE",
    name: "FlagWise",
    description:
      "Feature-flag microservice with REST APIs for flag configuration, targeting rules, and rollout percentages. Redis caching layer cuts flag evaluation latency to under 5ms. Production-ready with Docker Compose and 27+ Jest test suites at 90%+ code coverage.",
    stack: ["TypeScript", "Fastify", "PostgreSQL", "Redis", "Docker"],
    status: "LIVE / COMPLETED",
    github: "https://github.com/vivekstackk/flagwise",
    live: "https://feature-flag-dashboard.onrender.com",
  },
  {
    number: "03",
    category: "DISTRIBUTED SYSTEM",
    name: "Distributed Job Scheduler",
    description:
      "Distributed cron-style job scheduler backed by a persistent PostgreSQL queue. Eliminated multi-worker race conditions with SKIP LOCKED locking and heartbeat lease renewals, featuring exponential backoff retries and Dead-Letter Queue.",
    stack: ["Node.js", "TypeScript", "PostgreSQL", "Docker Compose"],
    status: "LIVE / COMPLETED",
    github: "https://github.com/vivekstackk/job-scheduler",
    live: "https://jobscheduler-150z.onrender.com",
  },
  {
    number: "04",
    category: "FULL-STACK PLATFORM",
    name: "SkillSwap",
    description:
      "A peer learning platform connecting people to exchange knowledge and skills through a modern web experience.",
    stack: ["React", "Next.js", "MongoDB", "Tailwind CSS"],
    status: "LIVE / BUILDING",
    github: "https://github.com/vivekstackk/skillswap",
  },
  {
    number: "05",
    category: "WEB APPLICATION",
    name: "Cinemate",
    description:
      "A responsive movie discovery application with search, detailed information and API-driven content.",
    stack: ["React", "Firebase", "TMDB API", "Tailwind CSS"],
    status: "COMPLETED",
    github: "https://github.com/vivekstackk/cinemate",
  },
];

const toolbox = {
  "LANGUAGES": ["TypeScript", "JavaScript (ES6+)", "Python", "C++", "SQL", "HTML5", "CSS3"],
  "FRONTEND": ["React.js", "Next.js (App Router)", "Tailwind CSS", "Responsive UI/UX"],
  "BACKEND & APIS": ["Node.js", "Fastify", "Express.js", "RESTful APIs", "Better-Auth", "Stripe API"],
  "DATABASES & DEVOPS": ["PostgreSQL", "Neon DB", "Drizzle ORM", "Redis", "Docker", "Docker Compose", "Git", "Jest", "Linux"],
  "RELEVANT COURSEWORK": ["Data Structures & Algorithms", "Database Management Systems", "Object Oriented Programming", "Operating Systems", "Computer Networks", "System Design"],
};

const certificates = [
  {
    number: "01",
    title: "Data Analyst Internship Certificate",
    issuer: "Gazebo Labs Private Limited (IIT Bhubaneswar Research Park)",
    division: "Data & Business Intelligence Division · Bhubaneswar, India",
    duration: "June 2026 – Aug 2026",
    description:
      "Completed 2-month internship validating telemetry and sensor data from smart IoT aquaculture devices, developing real-time Python/SQL dashboards, and automating analytical reporting pipelines (cutting turnaround by 70%).",
    url: "https://drive.google.com/file/d/1cuA7EH0zP8XGkJlcUsvrSt4YoMfjXAZa/view?usp=drive_link",
    status: "VERIFIED / DRIVE ↗",
    icon: "💼",
  },
  {
    number: "02",
    title: "Hack Innovision — National Hackathon Certificate",
    issuer: "National Institute of Technology, Rourkela",
    division: "36-Hour National Hackathon",
    duration: "National Hackathon",
    description:
      "Participated in the intensive 36-hour annual national hackathon at NIT Rourkela, prototyping and delivering full-stack software solutions under time constraints.",
    url: "https://drive.google.com/file/d/1DsQNWBDXfpDOPA77AW19Hk4D9wjXRnR0/view?usp=sharing",
    status: "VERIFIED / DRIVE ↗",
    icon: "🏆",
  },
  {
    number: "03",
    title: "Official Resume / Curriculum Vitae",
    issuer: "Vivek Damar · NIT Rourkela",
    division: "Full-Time & SDE Internship Resume",
    duration: "Updated 2026",
    description:
      "Complete resume detailing engineering projects, technical stack, distributed systems experience, academic record, and contact details.",
    url: "/VIVEKDAMAR_FTE_RESUME.pdf",
    status: "PDF DOCUMENT ↗",
    icon: "📄",
  },
  {
    number: "04",
    title: "Problem Setter Recognition — The Timeless Saga",
    issuer: "Algorithmic & Programming Society, NIT Rourkela",
    division: "Competitive Programming Division",
    duration: "Flagship Contest",
    description:
      "Curated 30+ competitive programming challenges testing algorithmic logic, data structures, and mathematical optimization for the society's premier contest.",
    status: "RECOGNITION",
    icon: "🧩",
  },
];

const achievements = [
  {
    number: "01",
    title: "Problem Setter — The Timeless Saga",
    organization: "Algorithmic & Programming Society, NIT Rourkela",
    badge: "COMPETITIVE PROGRAMMING",
    description:
      "Curated 30+ competitive programming challenges for the society's flagship algorithmic contest. Designed problem test suites and edge cases covering trees, dynamic programming, and graph algorithms.",
    date: "Flagship Contest",
    icon: "🧩",
  },
  {
    number: "02",
    title: "Hack Innovision Hackathon Participant",
    organization: "National Institute of Technology, Rourkela",
    badge: "NATIONAL HACKATHON",
    description:
      "Participated in the 36-hour annual national hackathon at NIT Rourkela, collaborating to design, architect, and prototype full-stack software solutions under time constraints.",
    date: "36-Hour Sprint",
    url: "https://drive.google.com/file/d/1DsQNWBDXfpDOPA77AW19Hk4D9wjXRnR0/view?usp=sharing",
    icon: "🏆",
  },
  {
    number: "03",
    title: "Data Analyst Intern @ Gazebo Labs",
    organization: "IIT Bhubaneswar Research Park",
    badge: "WORK EXPERIENCE",
    description:
      "Selected as Data Analyst Intern in Data & Business Intelligence Division. Built real-time IoT device health monitoring dashboards and automated reporting pipelines, reducing manual reporting turnaround by 70%.",
    date: "June 2026 – Aug 2026",
    url: "https://drive.google.com/file/d/1cuA7EH0zP8XGkJlcUsvrSt4YoMfjXAZa/view?usp=drive_link",
    icon: "💼",
  },
  {
    number: "04",
    title: "Academic Excellence & Navodaya Alumnus",
    organization: "NIT Rourkela & JNV Jhabua",
    badge: "ACADEMICS",
    description:
      "Pursuing B.Tech in Computer Science and Engineering at NIT Rourkela (CGPA: 6.59). Completed Class XII CBSE Science PCM with 81.2% and Class X with 87.2% at Jawahar Navodaya Vidyalaya.",
    date: "2019 – 2027",
    icon: "🎓",
  },
];

const initialWindows: WinState[] = [
  {
    id: "work",
    title: "My Work",
    icon: "▣",
    open: false,
    minimized: false,
    maximized: false,
    x: 70,
    y: 70,
    width: 1080,
    height: 650,
    z: 1,
  },
  {
    id: "about",
    title: "About Me",
    icon: "?",
    open: false,
    minimized: false,
    maximized: false,
    x: 120,
    y: 90,
    width: 940,
    height: 600,
    z: 2,
  },
  {
    id: "toolbox",
    title: "Developer Toolbox",
    icon: "⚙",
    open: false,
    minimized: false,
    maximized: false,
    x: 180,
    y: 90,
    width: 850,
    height: 620,
    z: 3,
  },
  {
    id: "documents",
    title: "My Documents",
    icon: "📁",
    open: false,
    minimized: false,
    maximized: false,
    x: 220,
    y: 100,
    width: 760,
    height: 500,
    z: 4,
  },
  {
    id: "certificates",
    title: "Certificates",
    icon: "🏆",
    open: false,
    minimized: false,
    maximized: false,
    x: 250,
    y: 110,
    width: 800,
    height: 560,
    z: 5,
  },
  {
    id: "achievements",
    title: "Achievements",
    icon: "⭐",
    open: false,
    minimized: false,
    maximized: false,
    x: 270,
    y: 120,
    width: 820,
    height: 580,
    z: 6,
  },
  {
    id: "terminal",
    title: "Vivek Terminal",
    icon: "▰",
    open: false,
    minimized: false,
    maximized: false,
    x: 150,
    y: 100,
    width: 820,
    height: 540,
    z: 7,
  },
  {
    id: "experiments",
    title: "Experiments",
    icon: "⌘",
    open: false,
    minimized: false,
    maximized: false,
    x: 170,
    y: 80,
    width: 900,
    height: 570,
    z: 8,
  },
  {
    id: "readme",
    title: "README.txt",
    icon: "▤",
    open: false,
    minimized: false,
    maximized: false,
    x: 260,
    y: 120,
    width: 780,
    height: 580,
    z: 9,
  },
  {
    id: "contact",
    title: "Contact — Vivek Damar",
    icon: "@",
    open: false,
    minimized: false,
    maximized: false,
    x: 150,
    y: 80,
    width: 820,
    height: 620,
    z: 10,
  },
  {
    id: "hire",
    title: "Hiring — New Opportunity",
    icon: "★",
    open: false,
    minimized: false,
    maximized: false,
    x: 230,
    y: 80,
    width: 780,
    height: 650,
    z: 11,
  },
];

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [startOpen, setStartOpen] = useState(false);
  const [time, setTime] = useState("");
  const [windows, setWindows] = useState<WinState[]>(initialWindows);
  const [topZ, setTopZ] = useState(20);

  const dragRef = useRef<DragState | null>(null);
  const resizeRef = useRef<ResizeState | null>(null);

  const [terminalInput, setTerminalInput] = useState("");
  const [terminalLines, setTerminalLines] = useState<string[]>([
    "VIVEK_OS TERMINAL v1.0",
    "Type 'help' to see available commands.",
    "",
  ]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 100) {
          window.clearInterval(timer);
          window.setTimeout(() => setLoading(false), 450);
          return 100;
        }

        return current + Math.floor(Math.random() * 8) + 3;
      });
    }, 120);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const updateClock = () => {
      setTime(
        new Intl.DateTimeFormat("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).format(new Date())
      );
    };

    updateClock();

    const timer = window.setInterval(updateClock, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const move = (event: globalThis.MouseEvent) => {
      if (dragRef.current) {
        const drag = dragRef.current;

        setWindows((current) =>
          current.map((win) => {
            if (win.id !== drag.id || win.maximized) return win;

            return {
              ...win,
              x: Math.max(5, event.clientX - drag.offsetX),
              y: Math.max(5, event.clientY - drag.offsetY),
            };
          })
        );
      }

      if (resizeRef.current) {
        const resize = resizeRef.current;

        setWindows((current) =>
          current.map((win) => {
            if (win.id !== resize.id || win.maximized) return win;

            return {
              ...win,
              width: Math.max(
                480,
                resize.startWidth + event.clientX - resize.startX
              ),
              height: Math.max(
                350,
                resize.startHeight + event.clientY - resize.startY
              ),
            };
          })
        );
      }
    };

    const stop = () => {
      dragRef.current = null;
      resizeRef.current = null;
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", stop);

    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", stop);
    };
  }, []);

  const openWindow = (id: WindowId) => {
    setTopZ((currentZ) => {
      const nextZ = currentZ + 1;
      setWindows((current) =>
        current.map((win) =>
          win.id === id
            ? { ...win, open: true, minimized: false, z: nextZ }
            : win
        )
      );
      return nextZ;
    });
    setStartOpen(false);
  };

  const closeWindow = (id: WindowId) => {
    setWindows((current) =>
      current.map((win) =>
        win.id === id ? { ...win, open: false, minimized: false } : win
      )
    );
  };

  const minimizeWindow = (id: WindowId) => {
    setWindows((current) =>
      current.map((win) =>
        win.id === id ? { ...win, minimized: true } : win
      )
    );
  };

  const maximizeWindow = (id: WindowId) => {
    setWindows((current) =>
      current.map((win) =>
        win.id === id ? { ...win, maximized: !win.maximized } : win
      )
    );
  };

  const focusWindow = (id: WindowId) => {
    setTopZ((currentZ) => {
      const nextZ = currentZ + 1;
      setWindows((current) =>
        current.map((win) =>
          win.id === id
            ? { ...win, z: nextZ, minimized: false }
            : win
        )
      );
      return nextZ;
    });
  };

  const startDrag = (
    event: ReactMouseEvent<HTMLDivElement>,
    id: WindowId
  ) => {
    event.preventDefault();

    const target = windows.find((win) => win.id === id);

    if (!target || target.maximized) return;

    focusWindow(id);

    dragRef.current = {
      id,
      offsetX: event.clientX - target.x,
      offsetY: event.clientY - target.y,
    };
  };

  const startResize = (
    event: ReactMouseEvent<HTMLDivElement>,
    id: WindowId
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const target = windows.find((win) => win.id === id);

    if (!target || target.maximized) return;

    focusWindow(id);

    resizeRef.current = {
      id,
      startX: event.clientX,
      startY: event.clientY,
      startWidth: target.width,
      startHeight: target.height,
    };
  };

  const submitHiring = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const name = String(form.get("name") || "");
    const email = String(form.get("email") || "");
    const company = String(form.get("company") || "");
    const role = String(form.get("role") || "");
    const budget = String(form.get("budget") || "");
    const message = String(form.get("message") || "");

    const subject = `Hiring Inquiry — ${role || "Software Opportunity"}`;

    const body = `
Hello Vivek,

I would like to discuss an opportunity with you.

Name: ${name}
Email: ${email}
Company: ${company}
Role / Opportunity: ${role}
Budget / Compensation: ${budget}

Message:
${message}

Sent from Vivek's portfolio.
`;

    window.location.href =
      `mailto:vivekdamar28@gmail.com?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
  };

  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const name = String(form.get("name") || "");
    const email = String(form.get("email") || "");
    const subject = String(form.get("subject") || "Portfolio Contact");
    const message = String(form.get("message") || "");

    const body = `
Name: ${name}
Email: ${email}

${message}
`;

    window.location.href =
      `mailto:vivekdamar28@gmail.com?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
  };

  const runTerminalCommand = (event: FormEvent) => {
    event.preventDefault();

    const command = terminalInput.trim().toLowerCase();

    if (!command) return;

    let output: string[] = [];

    if (command === "help") {
      output = [
        "AVAILABLE COMMANDS",
        "------------------",
        "about          → about Vivek",
        "projects       → show projects",
        "stack          → show technology stack",
        "experience     → show work experience",
        "certificates   → open certificates window",
        "achievements   → open achievements window",
        "resume         → open resume PDF",
        "contact        → contact information",
        "hire           → open hiring window",
        "clear          → clear terminal",
      ];
    } else if (command === "about") {
      output = [
        "Vivek Damar",
        "Full-Stack Developer & Software Engineer",
        "B.Tech in Computer Science and Engineering @ NIT Rourkela (Batch 2027)",
        "Ex-Data Analyst Intern @ Gazebo Labs (IIT Bhubaneswar Research Park)",
        "Building web products, backend microservices, and distributed systems.",
      ];
    } else if (command === "projects") {
      output = projects.map((project) => `${project.number}  ${project.name} [${project.category}]`);
    } else if (command === "stack") {
      output = [
        "LANGUAGES: TypeScript, JavaScript, Python, C++, SQL, HTML5, CSS3",
        "FRONTEND: React.js, Next.js, Tailwind CSS, Responsive UI/UX",
        "BACKEND: Node.js, Fastify, Express.js, RESTful APIs, Better-Auth, Stripe API",
        "DATABASES & DEVOPS: PostgreSQL, Neon DB, Drizzle ORM, Redis, Docker, Git, Jest",
      ];
    } else if (command === "experience") {
      output = [
        "WORK EXPERIENCE",
        "---------------",
        "Gazebo Labs Private Limited (IIT Bhubaneswar Research Park)",
        "Role: Data Analyst Intern – Data & Business Intelligence Division",
        "Duration: June 2026 – Aug 2026 | Bhubaneswar, India",
        "• Validated IoT aquaculture device telemetry and sensor streams.",
        "• Built real-time Python/SQL device health and metrics dashboards.",
        "• Automated analytical reports, reducing turnaround time by 70%.",
      ];
    } else if (command === "certificates") {
      openWindow("certificates");
      output = ["Opening certificates directory..."];
    } else if (command === "achievements") {
      openWindow("achievements");
      output = ["Opening achievements directory..."];
    } else if (command === "resume") {
      window.open("/VIVEKDAMAR_FTE_RESUME.pdf", "_blank");
      output = ["Opening VIVEKDAMAR_FTE_RESUME.pdf..."];
    } else if (command === "contact") {
      output = [
        "EMAIL: vivekdamar28@gmail.com",
        "PHONE: (+91) 9303316127",
        "GITHUB: github.com/vivekstackk",
        "LINKEDIN: linkedin.com/in/vivek-damar",
      ];
    } else if (command === "hire") {
      openWindow("hire");
      output = ["Opening hiring interface..."];
    } else if (command === "clear") {
      setTerminalLines([]);
      setTerminalInput("");
      return;
    } else {
      output = [`Command not found: ${command}`, "Type 'help' for commands."];
    }

    setTerminalLines((current) => [
      ...current,
      `C:\\VIVEK_OS> ${command}`,
      ...output,
      "",
    ]);

    setTerminalInput("");
  };

  const renderWindowContent = (id: WindowId) => {
    switch (id) {
      case "work":
        return (
          <div className="explorer-page">
            <div className="explorer-path">
              <span>▣</span>
              PROJECT DIRECTORY
              <span className="object-count">{projects.length} OBJECTS</span>
            </div>

            <div className="project-list">
              {projects.map((project) => (
                <div
                  className="project-row"
                  key={project.name}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    if (project.github) {
                      window.open(project.github, "_blank", "noopener,noreferrer");
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && project.github) {
                      window.open(project.github, "_blank", "noopener,noreferrer");
                    }
                  }}
                >
                  <div className="folder-icon">📁</div>

                  <div className="project-main">
                    <div className="project-category">
                      {project.category}
                    </div>

                    <h2>{project.name}</h2>

                    <p>{project.description}</p>

                    <div className="tech-tags">
                      {project.stack.map((tech) => (
                        <span key={tech}>{tech}</span>
                      ))}
                    </div>
                  </div>

                  <div className="project-number">
                    <strong>{project.number}</strong>
                    <small>{project.status}</small>
                  </div>
                </div>
              ))}
            </div>

            <div className="explorer-footer">
              Click a project to open its GitHub repository.
            </div>
          </div>
        );

      case "about":
        return (
          <div className="about-page">
            <div className="breadcrumb">My Computer → About Me</div>

            <div className="about-grid">
              <div className="about-sidebar">
                <div className="large-system-icon">V</div>

                <div className="side-label">PERSONAL PROFILE</div>

                <div className="side-value">FULL-STACK DEVELOPER</div>

                <div className="side-label">EDUCATION</div>

                <div className="side-value">NIT ROURKELA (B.TECH CSE &apos;27)</div>

                <div className="side-label">EXPERIENCE</div>

                <div className="side-value">GAZEBO LABS (IIT BHUBANESWAR)</div>
              </div>

              <div>
                <div className="eyebrow">PERSONAL PROFILE</div>

                <h1>About Me</h1>

                <p className="about-lead">
                  I&apos;m Vivek — a computer science student at NIT Rourkela, full-stack
                  developer and creative builder interested in scalable backend systems and product engineering.
                </p>

                <p className="about-copy">
                  I build web products, backend microservices and distributed systems with
                  an emphasis on clean architecture, useful interfaces and resilient data handling.
                  Previously interned as a Data Analyst Intern at Gazebo Labs (IIT Bhubaneswar Research Park),
                  where I optimized IoT telemetry streams and built real-time analytics dashboards.
                </p>

                <div className="about-stats">
                  <div>
                    <span>FOCUS</span>
                    <strong>FULL-STACK &amp; BACKEND</strong>
                  </div>

                  <div>
                    <span>STACK</span>
                    <strong>NEXT.JS / FASTIFY / POSTGRES</strong>
                  </div>

                  <div>
                    <span>INTEREST</span>
                    <strong>DISTRIBUTED SYSTEMS &amp; CP</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "toolbox":
        return (
          <div className="toolbox-page">
            <div className="section-heading">
              <div>
                <div className="eyebrow">DEVELOPER ENVIRONMENT</div>
                <h1>Toolbox</h1>
              </div>

              <div className="toolbox-status">
                <span className="status-dot" />
                ONLINE
              </div>
            </div>

            <div className="toolbox-grid">
              {Object.entries(toolbox).map(([category, tools]) => (
                <div className="tool-card" key={category}>
                  <div className="tool-card-title">{category}</div>

                  <div className="tool-items">
                    {tools.map((tool) => (
                      <span key={tool}>{tool}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="tool-note">
              <strong>BUILD PHILOSOPHY</strong>
              <p>
                Prefer simple systems, readable code, useful interfaces and
                software that solves an actual problem.
              </p>
            </div>
          </div>
        );

      case "documents":
        return (
          <div className="documents-page">
            <div className="breadcrumb">My Computer → Documents</div>

            <div className="document-grid">
              <div
                className="document-card"
                onClick={() => openWindow("certificates")}
                style={{ cursor: "pointer" }}
              >
                <div className="document-icon">🏆</div>
                <strong>Certificates</strong>
                <span>Open folder · {certificates.length} items</span>
              </div>

              <div
                className="document-card"
                onClick={() => window.open("/VIVEKDAMAR_FTE_RESUME.pdf", "_blank")}
                style={{ cursor: "pointer" }}
              >
                <div className="document-icon">📄</div>
                <strong>Resume.pdf</strong>
                <span>Click to view · PDF</span>
              </div>

              <div
                className="document-card"
                onClick={() => openWindow("readme")}
                style={{ cursor: "pointer" }}
              >
                <div className="document-icon">📋</div>
                <strong>README.txt</strong>
                <span>Personal overview</span>
              </div>

              <div
                className="document-card"
                onClick={() => openWindow("achievements")}
                style={{ cursor: "pointer" }}
              >
                <div className="document-icon">⭐</div>
                <strong>Achievements</strong>
                <span>Open folder · {achievements.length} items</span>
              </div>
            </div>

            <div className="placeholder-note">
              <strong>DOCUMENT SYSTEM / VIVEK_OS</strong>
              <p>
                Browse verified certificates, official resume, comprehensive README,
                and competition achievements curated directly from Vivek Damar&apos;s credentials.
              </p>
            </div>
          </div>
        );

      case "certificates":
        return (
          <div className="certificates-page">
            <div className="breadcrumb">
              My Computer → Documents → Certificates
            </div>

            {certificates.map((cert) => (
              <div
                className={`certificate-row ${cert.url ? "is-clickable" : ""}`}
                key={cert.number}
                onClick={() => {
                  if (cert.url) {
                    window.open(cert.url, "_blank", "noopener,noreferrer");
                  }
                }}
              >
                <div className="certificate-icon">{cert.icon}</div>

                <div>
                  <strong>{cert.title}</strong>
                  <div className="certificate-meta">
                    <span>{cert.issuer}</span>
                    <span>•</span>
                    <span>{cert.duration}</span>
                  </div>
                  <p>{cert.description}</p>
                </div>

                <div>
                  {cert.url ? (
                    <a
                      className="certificate-action-badge"
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {cert.status}
                    </a>
                  ) : (
                    <div className="certificate-status">{cert.status}</div>
                  )}
                </div>
              </div>
            ))}

            <div className="certificate-footer">
              All credentials verified from Vivek Damar&apos;s portfolio &amp; Google Drive repository.
            </div>
          </div>
        );

      case "achievements":
        return (
          <div className="achievements-page">
            <div className="breadcrumb">
              My Computer → Documents → Achievements
            </div>

            {achievements.map((item) => (
              <div
                className={`achievement-row ${item.url ? "is-clickable" : ""}`}
                key={item.number}
                onClick={() => {
                  if (item.url) {
                    window.open(item.url, "_blank", "noopener,noreferrer");
                  }
                }}
              >
                <div className="achievement-icon">{item.icon}</div>

                <div>
                  <strong>{item.title}</strong>
                  <div className="achievement-meta">
                    <span>{item.organization}</span>
                    <span>•</span>
                    <span>{item.date}</span>
                  </div>
                  <p>{item.description}</p>
                </div>

                <div>
                  {item.url ? (
                    <a
                      className="achievement-badge"
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      VIEW CERTIFICATE ↗
                    </a>
                  ) : (
                    <div className="achievement-status">{item.badge}</div>
                  )}
                </div>
              </div>
            ))}

            <div className="achievement-footer">
              Highlights across competitive programming, hackathons, industry internships, and academic milestones.
            </div>
          </div>
        );

      case "terminal":
        return (
          <div className="terminal-page">
            <div className="terminal-output">
              {terminalLines.map((line, index) => (
                <div key={`${line}-${index}`}>{line || "\u00A0"}</div>
              ))}
            </div>

            <form onSubmit={runTerminalCommand} className="terminal-form">
              <span>C:\VIVEK_OS&gt;</span>
              <input
                value={terminalInput}
                onChange={(event) => setTerminalInput(event.target.value)}
                autoFocus
                spellCheck={false}
              />
            </form>
          </div>
        );

      case "experiments":
        return (
          <div className="experiments-page">
            <div className="eyebrow">LABORATORY</div>
            <h1>Experiments</h1>

            <div className="experiment-grid">
              <div className="experiment-card">
                <span>01</span>
                <h3>Backend Architecture</h3>
                <p>
                  Exploring workers, queues, locking, leases and reliable
                  background execution.
                </p>
              </div>

              <div className="experiment-card">
                <span>02</span>
                <h3>Creative Interfaces</h3>
                <p>
                  Mixing engineering with experimental editorial and retro
                  computer interfaces.
                </p>
              </div>

              <div className="experiment-card">
                <span>03</span>
                <h3>System Design</h3>
                <p>
                  Learning how larger software systems communicate, scale and
                  fail.
                </p>
              </div>
            </div>
          </div>
        );

      case "readme":
        return (
          <div className="readme-page">
            <div className="readme-line"># VIVEK DAMAR — README.txt</div>

            <p>
              Hi, I&apos;m Vivek Damar — a Computer Science &amp; Engineering student at NIT Rourkela and a Full-Stack Developer building modern web products, backend architectures, and developer systems.
            </p>

            <div className="readme-block">
              <span>CURRENT STATUS</span>
              <strong>B.TECH IN COMPUTER SCIENCE &amp; ENGINEERING @ NIT ROURKELA (BATCH OF 2027)</strong>
            </div>

            <div className="readme-block">
              <span>WORK EXPERIENCE</span>
              <strong>
                DATA ANALYST INTERN @ GAZEBO LABS (IIT BHUBANESWAR RESEARCH PARK) — JUNE 2026 TO AUG 2026
                <br />
                Cleaned IoT aquaculture telemetry, built real-time Python/SQL dashboards, and automated report pipelines cutting turnaround by 70%.
              </strong>
            </div>

            <div className="readme-block">
              <span>KEY PROJECTS</span>
              <strong>
                • SEATWISE — Real-time event ticketing with dynamic seat maps, SELECT FOR UPDATE locking &amp; Stripe
                <br />
                • FLAGWISE — High-throughput feature flag microservice with Redis caching &amp; &lt;5ms latency
                <br />
                • DISTRIBUTED JOB SCHEDULER — Multi-worker scheduler with SKIP LOCKED queues &amp; Dead-Letter Queue
              </strong>
            </div>

            <div className="readme-block">
              <span>TECHNICAL SKILLS</span>
              <strong>
                TypeScript, JavaScript (ES6+), Python, C++, SQL, React.js, Next.js, Fastify, Node.js, Express, PostgreSQL, Redis, Docker, Tailwind CSS
              </strong>
            </div>

            <div className="readme-block">
              <span>ACHIEVEMENTS</span>
              <strong>
                • Problem Setter @ Algorithmic &amp; Programming Society, NIT Rourkela (Curated 30+ contest challenges)
                <br />
                • Participant @ Hack Innovision 36-Hour National Hackathon (NIT Rourkela)
              </strong>
            </div>

            <div className="readme-block">
              <span>EDUCATION</span>
              <strong>
                • NIT Rourkela — B.Tech in CSE (Expected 2027, CGPA: 6.59)
                <br />
                • Jawahar Navodaya Vidyalaya (JNV), Jhabua — Class XII (81.2%) &amp; Class X (87.2%)
              </strong>
            </div>

            <div className="readme-block">
              <span>CONTACT &amp; LINKS</span>
              <strong>
                EMAIL: vivekdamar28@gmail.com · PHONE: (+91) 9303316127 · GITHUB: github.com/vivekstackk · LINKEDIN: linkedin.com/in/vivek-damar
              </strong>
            </div>

            <div className="readme-block">
              <span>PHILOSOPHY</span>
              <strong>&quot;Build. Learn. Ship. Repeat.&quot; — Prefer simple systems, readable code, and software that solves real problems.</strong>
            </div>
          </div>
        );

      case "contact":
        return (
          <div className="contact-page old-contact-page">
            <div className="contact-old-header">
              <div>
                <div className="eyebrow">PERSONAL CONTACT</div>
                <h1>Contact Me.</h1>
                <p>
                  Have an opportunity, project or just want to connect?
                  Find me through any of the channels below.
                </p>
              </div>

              <div className="contact-status">
                <span className="status-dot" />
                OPEN TO CONNECT
              </div>
            </div>

            <div className="contact-links">
              <a
                className="contact-link contact-link-primary"
                href="mailto:vivekdamar28@gmail.com"
              >
                <span
                  className="contact-link-mark"
                  aria-hidden="true"
                  style={{
                    width: 58,
                    height: 58,
                    minWidth: 58,
                    display: "grid",
                    placeItems: "center",
                    border: "1px solid currentColor",
                    fontSize: 28,
                    lineHeight: 1,
                    marginRight: 26,
                  }}
                >
                  @
                </span>
                <div className="contact-link-content">
                  <span>EMAIL</span>
                  <strong>vivekdamar28</strong>
                  <small>Send me an email</small>
                </div>
                <div className="contact-link-arrow">↗</div>
              </a>

              <a
                className="contact-link"
                href="https://github.com/vivekstackk"
                target="_blank"
                rel="noreferrer"
              >
                <span
                  className="contact-link-mark contact-link-mark-text"
                  aria-hidden="true"
                  style={{
                    width: 58,
                    height: 58,
                    minWidth: 58,
                    display: "grid",
                    placeItems: "center",
                    border: "1px solid currentColor",
                    fontSize: 16,
                    fontWeight: 600,
                    letterSpacing: "-0.04em",
                    marginRight: 26,
                  }}
                >
                  GH
                </span>
                <div className="contact-link-content">
                  <span>GITHUB</span>
                  <strong>vivekstackk</strong>
                  <small>Projects, source code & experiments</small>
                </div>
                <div className="contact-link-arrow">↗</div>
              </a>

              <a
                className="contact-link"
                href="https://www.linkedin.com/in/vivek-damar"
                target="_blank"
                rel="noreferrer"
              >
                <span
                  className="contact-link-mark contact-link-mark-linkedin"
                  aria-hidden="true"
                  style={{
                    width: 58,
                    height: 58,
                    minWidth: 58,
                    display: "grid",
                    placeItems: "center",
                    border: "1px solid currentColor",
                    fontSize: 24,
                    fontWeight: 600,
                    letterSpacing: "-0.06em",
                    marginRight: 26,
                  }}
                >
                  in
                </span>
                <div className="contact-link-content">
                  <span>LINKEDIN</span>
                  <strong>vivek-damar</strong>
                  <small>Professional profile & connections</small>
                </div>
                <div className="contact-link-arrow">↗</div>
              </a>
            </div>

            <div className="contact-footer-old">
              <span>VIVEK_OS / CONTACT</span>
              <span>FULL-STACK DEVELOPER</span>
              <span>INDIA</span>
            </div>
          </div>
        );

      case "hire":
        return (
          <div className="hire-page">
            <div className="hire-banner">
              <div>
                <div className="eyebrow">OPEN FOR OPPORTUNITIES</div>
                <h1>Hiring?</h1>
                <p>
                  Tell me about the role, company or project. This will open
                  your email client with all the details prepared.
                </p>
              </div>

              <div className="availability">
                <span className="status-dot" />
                AVAILABLE
              </div>
            </div>

            <form onSubmit={submitHiring} className="hire-form">
              <div className="form-two">
                <label>
                  YOUR NAME
                  <input name="name" required placeholder="John Doe" />
                </label>

                <label>
                  EMAIL
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="you@company.com"
                  />
                </label>
              </div>

              <div className="form-two">
                <label>
                  COMPANY
                  <input name="company" placeholder="Company name" />
                </label>

                <label>
                  ROLE / OPPORTUNITY
                  <input
                    name="role"
                    required
                    placeholder="Software Engineer Intern"
                  />
                </label>
              </div>

              <label>
                BUDGET / COMPENSATION
                <select name="budget" defaultValue="">
                  <option value="" disabled>
                    Select...
                  </option>
                  <option value="Internship">Internship</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Project based">Project based</option>
                  <option value="Prefer to discuss">Prefer to discuss</option>
                </select>
              </label>

              <label>
                MESSAGE
                <textarea
                  name="message"
                  required
                  placeholder="Tell me about the opportunity..."
                />
              </label>

              <div className="hire-actions">
                <button className="xp-primary-button" type="submit">
                  SEND HIRING DETAILS →
                </button>

                <span>
                  Opens an email addressed to
                  <strong> vivekdamar28@gmail.com</strong>
                </span>
              </div>
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <main className="boot-screen">
        <div className="boot-center">
          <div className="boot-icon">V</div>

          <h1>VIVEK</h1>

          <div className="boot-subtitle">PERSONAL COMPUTER</div>

          <div className="boot-message">Starting personal environment...</div>

          <div className="boot-progress">
            <div style={{ width: `${Math.min(progress, 100)}%` }} />
          </div>

          <div className="boot-status">
            <span>Initialising portfolio...</span>
            <span>{Math.min(progress, 100)}%</span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="desktop">
      <div className="desktop-overlay" />

      <div className="top-system-status">
        VIVEK_OS <span>/</span> ONLINE
      </div>

      <div className="desktop-content">
        <div className="desktop-kicker">VIVEK DAMAR / 01</div>

        <div className="desktop-role">
          SOFTWARE
          <br />
          ENGINEER
        </div>

        <h1 className="hero-title">
          Building
          <br />
          digital
          <br />
          things with
          <br />
          character.
        </h1>

        <p className="hero-description">
          Full-stack developer building web products, backend systems and
          experiments where engineering meets visual thinking.
        </p>

        <div className="hero-actions">
          <button onClick={() => openWindow("work")}>
            OPEN MY WORK ↗
          </button>

          <button onClick={() => openWindow("hire")}>
            HIRE / WORK WITH ME
          </button>
        </div>

        <div className="availability-line">
          <span className="status-dot" />
          AVAILABLE FOR OPPORTUNITIES
        </div>

        <div className="explore-hint">CLICK TO EXPLORE</div>
      </div>

      <nav className="desktop-icons">
        <DesktopIcon
          icon="▣"
          label="MY WORK"
          onClick={() => openWindow("work")}
        />

        <DesktopIcon
          icon="?"
          label="ABOUT"
          onClick={() => openWindow("about")}
        />

        <DesktopIcon
          icon="⌘"
          label="EXPERIMENTS"
          onClick={() => openWindow("experiments")}
        />

        <DesktopIcon
          icon="▰"
          label="TERMINAL"
          onClick={() => openWindow("terminal")}
        />

        <DesktopIcon
          icon="▤"
          label="README.TXT"
          onClick={() => openWindow("readme")}
        />

        <DesktopIcon
          icon="⚙"
          label="TOOLBOX"
          onClick={() => openWindow("toolbox")}
        />

        <DesktopIcon
          icon="📁"
          label="DOCUMENTS"
          onClick={() => openWindow("documents")}
        />

        <DesktopIcon
          icon="🏆"
          label="CERTIFICATES"
          onClick={() => openWindow("certificates")}
        />

        <DesktopIcon
          icon="⭐"
          label="ACHIEVEMENTS"
          onClick={() => openWindow("achievements")}
        />

        <DesktopIcon
          icon="@"
          label="CONTACT"
          onClick={() => openWindow("contact")}
        />

        <DesktopIcon
          icon="★"
          label="HIRE ME"
          accent
          onClick={() => openWindow("hire")}
        />
      </nav>

      {windows.map((win) => {
        if (!win.open || win.minimized) return null;

        return (
          <section
            key={win.id}
            className={`xp-window ${win.maximized ? "maximized" : ""}`}
            style={{
              left: win.maximized ? 0 : win.x,
              top: win.maximized ? 0 : win.y,
              width: win.maximized ? "100vw" : win.width,
              height: win.maximized ? "calc(100vh - 40px)" : win.height,
              zIndex: win.z,
            }}
            onMouseDown={() => focusWindow(win.id)}
          >
            <div
              className="window-titlebar"
              onMouseDown={(event) => startDrag(event, win.id)}
              onDoubleClick={() => maximizeWindow(win.id)}
            >
              <div className="window-title">
                <span className="window-title-icon">{win.icon}</span>
                {win.title}
              </div>

              <div className="window-buttons">
                <button
                  aria-label="Minimize"
                  onMouseDown={(event) => event.stopPropagation()}
                  onClick={() => minimizeWindow(win.id)}
                >
                  _
                </button>

                <button
                  aria-label="Maximize"
                  onMouseDown={(event) => event.stopPropagation()}
                  onClick={() => maximizeWindow(win.id)}
                >
                  □
                </button>

                <button
                  aria-label="Close"
                  className="close-button"
                  onMouseDown={(event) => event.stopPropagation()}
                  onClick={() => closeWindow(win.id)}
                >
                  ×
                </button>
              </div>
            </div>

            <div className="window-menu">
              <span>File</span>
              <span>Edit</span>
              <span>View</span>
              <span>Favorites</span>
              <span>Help</span>
            </div>

            <div className="window-body">{renderWindowContent(win.id)}</div>

            {!win.maximized && (
              <div
                className="resize-handle"
                onMouseDown={(event) => startResize(event, win.id)}
              />
            )}
          </section>
        );
      })}

      <div className="taskbar">
        <button
          className={`start-button ${startOpen ? "active" : ""}`}
          onClick={() => setStartOpen((current) => !current)}
        >
          <span className="windows-logo">
            <i />
            <i />
            <i />
            <i />
          </span>
          start
        </button>

        <div className="taskbar-windows">
          {windows
            .filter((win) => win.open)
            .map((win) => (
              <button
                key={win.id}
                className={`taskbar-item ${
                  win.minimized ? "minimized" : ""
                }`}
                onClick={() => {
                  if (win.minimized) {
                    openWindow(win.id);
                  } else {
                    focusWindow(win.id);
                  }
                }}
              >
                {win.icon} {win.title}
              </button>
            ))}
        </div>

        <div className="system-tray">
          <span>◉</span>
          <span>⌁</span>
          <span>{time}</span>
        </div>
      </div>

      {startOpen && (
        <div className="start-menu">
          <div className="start-header">
            <div className="start-avatar">V</div>

            <div>
              <strong>Vivek Damar</strong>
              <span>Full-Stack Developer</span>
            </div>
          </div>

          <div className="start-content">
            <div className="start-main">
              <StartItem
                icon="▣"
                label="My Work"
                onClick={() => openWindow("work")}
              />

              <StartItem
                icon="?"
                label="About Me"
                onClick={() => openWindow("about")}
              />

              <StartItem
                icon="⚙"
                label="Developer Toolbox"
                onClick={() => openWindow("toolbox")}
              />

              <StartItem
                icon="📁"
                label="Documents"
                onClick={() => openWindow("documents")}
              />

              <StartItem
                icon="🏆"
                label="Certificates"
                onClick={() => openWindow("certificates")}
              />

              <StartItem
                icon="⭐"
                label="Achievements"
                onClick={() => openWindow("achievements")}
              />

              <StartItem
                icon="▰"
                label="Terminal"
                onClick={() => openWindow("terminal")}
              />

              <StartItem
                icon="@"
                label="Contact"
                onClick={() => openWindow("contact")}
              />
            </div>

            <div className="start-side">
              <StartItem
                icon="★"
                label="Hire Me"
                onClick={() => openWindow("hire")}
                highlighted
              />

              <StartItem
                icon="⌘"
                label="Experiments"
                onClick={() => openWindow("experiments")}
              />

              <StartItem
                icon="▤"
                label="README"
                onClick={() => openWindow("readme")}
              />

              <div className="start-side-info">
                <span>GITHUB</span>
                <strong>vivekstackk</strong>

                <span>EMAIL</span>
                <strong>vivekdamar28@gmail.com</strong>
              </div>
            </div>
          </div>

          <div className="start-footer">
            <span>VIVEK_OS</span>
            <span>PERSONAL COMPUTER</span>
          </div>
        </div>
      )}
    </main>
  );
}

function DesktopIcon({
  icon,
  label,
  accent,
  onClick,
}: {
  icon: string;
  label: string;
  accent?: boolean;
  onClick: () => void;
}) {
  // GitHub and LinkedIn belong inside CONTACT, not on the desktop.
  // This guard also prevents them from reappearing if an older nav entry remains.
  if (label === "GITHUB" || label === "LINKEDIN") return null;

  return (
    <button
      className={`desktop-icon ${accent ? "desktop-icon-accent" : ""}`}
      onClick={onClick}
    >
      <span className="desktop-icon-box">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function StartItem({
  icon,
  label,
  onClick,
  highlighted,
}: {
  icon: string;
  label: string;
  onClick: () => void;
  highlighted?: boolean;
}) {
  return (
    <button
      className={`start-item ${highlighted ? "highlighted" : ""}`}
      onClick={onClick}
    >
      <span>{icon}</span>
      <strong>{label}</strong>
    </button>
  );
}