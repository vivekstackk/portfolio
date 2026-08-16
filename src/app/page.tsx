"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent, MouseEvent as ReactMouseEvent } from "react";

type WindowId =
  | "work"
  | "about"
  | "toolbox"
  | "documents"
  | "certificates"
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
    category: "BACKEND SYSTEM",
    name: "Feature Flag Platform",
    description:
      "A backend platform for controlled feature releases, experimentation, targeting and reliable configuration delivery.",
    stack: ["TypeScript", "Fastify", "PostgreSQL", "Redis"],
    status: "BUILDING",
    github: "https://github.com/vivekstackk/feature-flag-platform",
  },
  {
    number: "02",
    category: "DISTRIBUTED SYSTEM",
    name: "Job Scheduler",
    description:
      "A backend scheduling system exploring workers, leases, locking, scheduled execution and failure recovery.",
    stack: ["TypeScript", "Fastify", "PostgreSQL", "Docker"],
    status: "BUILDING",
    github: "https://github.com/vivekstackk/job-scheduler",
  },
  {
    number: "03",
    category: "FULL-STACK PRODUCT",
    name: "Seatwise",
    description:
      "A modern full-stack application focused on product experience, clean architecture and reliable data handling.",
    stack: ["Next.js", "TypeScript", "PostgreSQL"],
    status: "BUILDING",
    github: "https://github.com/vivekstackk/seatwise",
  },
  {
    number: "04",
    category: "FULL-STACK PLATFORM",
    name: "SkillSwap",
    description:
      "A peer learning platform connecting people to exchange knowledge and skills through a modern web experience.",
    stack: ["React", "Next.js", "MongoDB"],
    status: "LIVE / BUILDING",
    github: "https://github.com/vivekstackk/skillswap",
  },
  {
    number: "05",
    category: "WEB APPLICATION",
    name: "Cinemate",
    description:
      "A responsive movie discovery application with search, detailed information and API-driven content.",
    stack: ["React", "Firebase", "TMDB API"],
    status: "COMPLETED",
    github: "https://github.com/vivekstackk/cinemate",
  },
];

const toolbox = {
  "FRONTEND": ["React", "Next.js", "TypeScript", "JavaScript", "HTML", "CSS"],
  "BACKEND": ["Node.js", "Fastify", "Express", "REST APIs"],
  "DATABASE": ["PostgreSQL", "MongoDB", "Firebase"],
  "TOOLS": ["Git", "GitHub", "VS Code", "Postman", "Docker"],
  "CURRENTLY EXPLORING": ["System Design", "Distributed Systems", "Backend Architecture"],
};

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
    width: 780,
    height: 540,
    z: 5,
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
    z: 6,
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
    z: 7,
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
    width: 760,
    height: 550,
    z: 8,
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
    z: 9,
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
    z: 10,
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
        "about       → about Vivek",
        "projects    → show projects",
        "stack       → show technology stack",
        "contact     → contact information",
        "hire        → open hiring window",
        "clear       → clear terminal",
      ];
    } else if (command === "about") {
      output = [
        "Vivek Damar",
        "Full-Stack Developer",
        "Computer Science student @ NIT Rourkela",
        "Building web products, backend systems and experiments.",
      ];
    } else if (command === "projects") {
      output = projects.map((project) => `${project.number}  ${project.name}`);
    } else if (command === "stack") {
      output = [
        "React / Next.js / TypeScript",
        "Node.js / Fastify / Express",
        "PostgreSQL / MongoDB / Firebase",
        "Git / GitHub / Docker / Postman",
      ];
    } else if (command === "contact") {
      output = [
        "EMAIL: vivekdamar28@gmail.com",
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
                  onDoubleClick={() => {
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
              Double-click a project to open its GitHub repository.
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

                <div className="side-value">NIT ROURKELA</div>
              </div>

              <div>
                <div className="eyebrow">PERSONAL PROFILE</div>

                <h1>About Me</h1>

                <p className="about-lead">
                  I&apos;m Vivek — a computer science student, full-stack
                  developer and creative builder interested in the space
                  between engineering and visual design.
                </p>

                <p className="about-copy">
                  I build web products, backend systems and experiments with
                  an emphasis on clean architecture, useful interfaces and
                  thoughtful user experiences.
                </p>

                <div className="about-stats">
                  <div>
                    <span>FOCUS</span>
                    <strong>FULL-STACK DEVELOPMENT</strong>
                  </div>

                  <div>
                    <span>BACKEND</span>
                    <strong>NODE / FASTIFY / DATABASES</strong>
                  </div>

                  <div>
                    <span>INTEREST</span>
                    <strong>SYSTEM DESIGN</strong>
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
                onDoubleClick={() => openWindow("certificates")}
              >
                <div className="document-icon">🏆</div>
                <strong>Certificates</strong>
                <span>Open folder</span>
              </div>

              <div className="document-card">
                <div className="document-icon">📄</div>
                <strong>Resume.pdf</strong>
                <span>Coming soon</span>
              </div>

              <div className="document-card">
                <div className="document-icon">📋</div>
                <strong>README.txt</strong>
                <span>Personal information</span>
              </div>

              <div className="document-card">
                <div className="document-icon">⭐</div>
                <strong>Achievements</strong>
                <span>Placeholder folder</span>
              </div>
            </div>

            <div className="placeholder-note">
              <strong>DOCUMENT SYSTEM</strong>
              <p>
                This folder is ready for future resumes, certificates,
                achievements and other professional documents.
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

            {[1, 2, 3].map((number) => (
              <div className="certificate-row" key={number}>
                <div className="certificate-icon">🏆</div>

                <div>
                  <strong>Certificate {String(number).padStart(2, "0")}</strong>
                  <span>Certificate title — placeholder</span>
                </div>

                <div className="certificate-status">AVAILABLE SOON</div>
              </div>
            ))}

            <div className="certificate-footer">
              Add certificate files later inside:
              <code>/public/certificates/</code>
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
            <div className="readme-line"># VIVEK DAMAR</div>

            <p>
              Full-Stack Developer building web products and backend systems.
            </p>

            <div className="readme-block">
              <span>ROLE</span>
              <strong>FULL-STACK DEVELOPER</strong>
            </div>

            <div className="readme-block">
              <span>EDUCATION</span>
              <strong>COMPUTER SCIENCE — NIT ROURKELA</strong>
            </div>

            <div className="readme-block">
              <span>INTERESTS</span>
              <strong>
                BACKEND SYSTEMS · PRODUCT ENGINEERING · CREATIVE UI
              </strong>
            </div>

            <div className="readme-block">
              <span>OPEN TO</span>
              <strong>SDE INTERNSHIPS · FULL-TIME OPPORTUNITIES</strong>
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

        <div className="explore-hint">DOUBLE CLICK TO EXPLORE</div>
      </div>

      <nav className="desktop-icons">
        <DesktopIcon
          icon="▣"
          label="MY WORK"
          onDoubleClick={() => openWindow("work")}
        />

        <DesktopIcon
          icon="?"
          label="ABOUT"
          onDoubleClick={() => openWindow("about")}
        />

        <DesktopIcon
          icon="⌘"
          label="EXPERIMENTS"
          onDoubleClick={() => openWindow("experiments")}
        />

        <DesktopIcon
          icon="▰"
          label="TERMINAL"
          onDoubleClick={() => openWindow("terminal")}
        />

        <DesktopIcon
          icon="▤"
          label="README.TXT"
          onDoubleClick={() => openWindow("readme")}
        />

        <DesktopIcon
          icon="⚙"
          label="TOOLBOX"
          onDoubleClick={() => openWindow("toolbox")}
        />

        <DesktopIcon
          icon="📁"
          label="DOCUMENTS"
          onDoubleClick={() => openWindow("documents")}
        />

        <DesktopIcon
          icon="🏆"
          label="CERTIFICATES"
          onDoubleClick={() => openWindow("certificates")}
        />

        <DesktopIcon
          icon="@"
          label="CONTACT"
          onDoubleClick={() => openWindow("contact")}
        />

        <DesktopIcon
          icon="★"
          label="HIRE ME"
          accent
          onDoubleClick={() => openWindow("hire")}
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
  onDoubleClick,
}: {
  icon: string;
  label: string;
  accent?: boolean;
  onDoubleClick: () => void;
}) {
  // GitHub and LinkedIn belong inside CONTACT, not on the desktop.
  // This guard also prevents them from reappearing if an older nav entry remains.
  if (label === "GITHUB" || label === "LINKEDIN") return null;

  return (
    <button
      className={`desktop-icon ${accent ? "desktop-icon-accent" : ""}`}
      onDoubleClick={onDoubleClick}
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