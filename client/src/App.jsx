
import { useEffect, useState } from "react";
import {
  Link,
  Routes,
  Route,
  useNavigate
} from "react-router-dom";
import api from "./api";

// ================= NAVIGATION =================

function Nav({ user, logout }) {
  return (
    <nav className="nav">
      <Link className="brand" to="/">
        Skill<span>Bridge</span>
      </Link>

      <div className="navlinks">
        <Link to="/">Explore</Link>

        {user && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/add">Offer a skill</Link>
          </>
        )}

        {user ? (
          <button className="ghost" onClick={logout}>
            Log out
          </button>
        ) : (
          <Link className="nav-cta" to="/login">
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
}

// ================= AUTHENTICATION =================

function Auth({ mode, onAuth }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    year: ""
  });

  const [error, setError] = useState("");
  const nav = useNavigate();

  const update = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  async function submit(e) {
    e.preventDefault();
    setError("");

    try {
      const { data } = await api.post(
        `/auth/${mode}`,
        form
      );

      onAuth(data);
      nav("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to continue"
      );
    }
  }

  return (
    <section className="auth card">
      <p className="eyebrow">CAMPUS COMMUNITY</p>

      <h1>
        {mode === "register"
          ? "Create your student profile"
          : "Welcome back"}
      </h1>

      <p className="muted">
        Learn from peers. Share what you know.
      </p>

      <form onSubmit={submit}>
        {mode === "register" && (
          <>
            <input
              name="name"
              placeholder="Full name"
              value={form.name}
              onChange={update}
              required
            />

            <input
              name="department"
              placeholder="Department (e.g. AIML)"
              value={form.department}
              onChange={update}
            />

            <input
              name="year"
              placeholder="Study year (e.g. 2nd year)"
              value={form.year}
              onChange={update}
            />
          </>
        )}

        <input
          type="email"
          name="email"
          placeholder="College email"
          value={form.email}
          onChange={update}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password (min. 6 characters)"
          value={form.password}
          onChange={update}
          minLength="6"
          required
        />

        {error && (
          <p className="error">{error}</p>
        )}

        <button className="primary full">
          {mode === "register"
            ? "Create account"
            : "Sign in"}
        </button>
      </form>

      <p className="muted">
        {mode === "register"
          ? "Already registered?"
          : "New to SkillBridge?"}

        {" "}

        <Link
          to={
            mode === "register"
              ? "/login"
              : "/register"
          }
        >
          {mode === "register"
            ? "Sign in"
            : "Create an account"}
        </Link>
      </p>
    </section>
  );
}

// ================= EXPLORE SKILLS =================

function Explore({ user }) {
  const [skills, setSkills] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const [booking, setBooking] = useState(null);
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    try {
      const { data } = await api.get("/skills", {
        params: { search }
      });

      setSkills(data);
      setError("");
    } catch {
      setError(
        "Could not load skills. Check that the server is running."
      );
    }
  }

  useEffect(() => {
    load();
  }, [search]);

  async function book(e) {
    e.preventDefault();

    try {
      await api.post("/bookings", {
        skillId: booking._id,
        date,
        message
      });

      alert("Session request sent!");

      setBooking(null);
      setDate("");
      setMessage("");
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Booking failed"
      );
    }
  }

  return (
    <>
      <header className="hero">
        <div>
          <p className="eyebrow">
            LEARN TOGETHER. GROW TOGETHER.
          </p>

          <h1>
            Your campus is full
            <br />
            of people who can teach you.
          </h1>

          <p>
            Exchange skills, discover peer mentors,
            and turn what you know into someone else's
            next breakthrough.
          </p>

          <a
            className="primary linkbutton"
            href="#discover"
          >
            Explore skills
          </a>
        </div>

        <div className="hero-art">
          <div className="orbit">✦</div>

          <div className="hero-card">
            <span>PEER LEARNING</span>

            <strong>
              Share a skill.
              <br />
              Build a community.
            </strong>

            <div className="avatars">
              👩🏻‍💻　👨🏽‍🎨　👩🏽‍🔬
            </div>
          </div>
        </div>
      </header>

      <main
        id="discover"
        className="section"
      >
        <div className="section-head">
          <div>
            <p className="eyebrow">
              THE SKILL MARKETPLACE
            </p>

            <h2>Find your next skill</h2>
          </div>

          <input
            className="search"
            placeholder="Search Python, design, public speaking..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        {error && (
          <p className="error">{error}</p>
        )}

        <div className="cards">
          {skills.map((s) => (
            <article
              className="skill card"
              key={s._id}
            >
              <div className="skill-top">
                <span className="tag">
                  {s.category}
                </span>

                <span className="level">
                  {s.level}
                </span>
              </div>

              <h3>{s.title}</h3>

              <p className="muted">
                {s.description}
              </p>

              <div className="skill-meta">
                <span>
                  👤 {s.owner?.name || "Student"}
                </span>

                <span>📍 {s.mode}</span>
              </div>

              <div className="skill-bottom">
                <span className="muted">
                  {s.owner?.department || "Campus peer"}
                </span>

                {user ? (
                  <button
                    className="primary small"
                    onClick={() => setBooking(s)}
                  >
                    Request session
                  </button>
                ) : (
                  <Link
                    className="primary small linkbutton"
                    to="/login"
                  >
                    Sign in to book
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>

        {skills.length === 0 && !error && (
          <div className="empty card">
            No skills found yet.
            Be the first to offer one!
          </div>
        )}
      </main>

      {booking && (
        <div className="modal-backdrop">
          <form
            className="modal card"
            onSubmit={book}
          >
            <button
              type="button"
              className="close"
              onClick={() => setBooking(null)}
            >
              ×
            </button>

            <p className="eyebrow">
              SESSION REQUEST
            </p>

            <h2>{booking.title}</h2>

            <label>
              Preferred date and time
            </label>

            <input
              type="datetime-local"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
              required
            />

            <label>
              Message to tutor
            </label>

            <textarea
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              placeholder="What would you like to learn?"
            />

            <button className="primary full">
              Send request
            </button>
          </form>
        </div>
      )}
    </>
  );
}

// ================= ADD SKILL =================

function AddSkill() {
  const [form, setForm] = useState({
    title: "",
    category: "Programming",
    description: "",
    level: "Beginner",
    mode: "Both",
    availability: "Flexible"
  });

  const [error, setError] = useState("");
  const nav = useNavigate();

  const update = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  async function submit(e) {
    e.preventDefault();

    try {
      await api.post("/skills", form);
      nav("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Could not publish skill"
      );
    }
  }

  return (
    <section className="formpage card">
      <p className="eyebrow">
        GIVE BACK TO YOUR CAMPUS
      </p>

      <h1>Offer a skill</h1>

      <p className="muted">
        Share something you know and help another student grow.
      </p>

      <form onSubmit={submit}>
        <label>Skill title</label>

        <input
          name="title"
          placeholder="e.g. Python for beginners"
          value={form.title}
          onChange={update}
          required
        />

        <label>Category</label>

        <select
          name="category"
          value={form.category}
          onChange={update}
        >
          {[
            "Programming",
            "Design",
            "Languages",
            "Academics",
            "Business",
            "Music",
            "Other"
          ].map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>

        <label>Description</label>

        <textarea
          name="description"
          placeholder="What will students learn from you?"
          value={form.description}
          onChange={update}
          required
        />

        <div className="two">
          <div>
            <label>Level</label>

            <select
              name="level"
              value={form.level}
              onChange={update}
            >
              {[
                "Beginner",
                "Intermediate",
                "Advanced"
              ].map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Session mode</label>

            <select
              name="mode"
              value={form.mode}
              onChange={update}
            >
              {[
                "Online",
                "In person",
                "Both"
              ].map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label>Availability</label>

        <input
          name="availability"
          value={form.availability}
          onChange={update}
        />

        {error && (
          <p className="error">{error}</p>
        )}

        <button className="primary full">
          Publish skill
        </button>
      </form>
    </section>
  );
}

// ================= STUDENT DASHBOARD =================

function Dashboard({ user }) {
  const [bookings, setBookings] = useState([]);
  const [skills, setSkills] = useState([]);

  async function load() {
    const [b, s] = await Promise.all([
      api.get("/bookings/mine"),
      api.get("/skills")
    ]);

    setBookings(b.data);

    setSkills(
      s.data.filter(
        (x) =>
          x.owner?._id === user?.id ||
          x.owner === user?.id
      )
    );
  }

  useEffect(() => {
    load().catch(console.error);
  }, []);

  async function status(id, value) {
    try {
      await api.patch(
        `/bookings/${id}/status`,
        { status: value }
      );

      await load();
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Could not update booking"
      );
    }
  }

  return (
    <main className="section dashboard">
      <p className="eyebrow">
        YOUR LEARNING SPACE
      </p>

      <h1>
        Hello, {user?.name?.split(" ")[0] || "student"} 👋
      </h1>

      <p className="muted">
        Manage your skills and peer-learning sessions.
      </p>

      <div className="stats">
        <div className="card">
          <strong>{skills.length}</strong>
          <span>Skills offered</span>
        </div>

        <div className="card">
          <strong>{bookings.length}</strong>
          <span>Session requests</span>
        </div>

        <div className="card">
          <strong>
            {
              bookings.filter(
                (b) => b.status === "Completed"
              ).length
            }
          </strong>
          <span>Completed sessions</span>
        </div>
      </div>

      <div className="section-head">
        <h2>Your sessions</h2>

        <Link
          className="primary small linkbutton"
          to="/add"
        >
          + Offer a skill
        </Link>
      </div>

      <div className="session-list">
        {bookings.length === 0 ? (
          <div className="empty card">
            No sessions yet.
            Explore skills or publish your first skill.
          </div>
        ) : (
          bookings.map((b) => (
            <article
              className="booking card"
              key={b._id}
            >
              <div>
                <h3>{b.skill?.title}</h3>

                <p className="muted">
                  Learner: {b.learner?.name}
                  {" · "}
                  Tutor: {b.tutor?.name}
                </p>

                <p>
                  {b.date
                    ? new Date(b.date).toLocaleString()
                    : "Date not set"}
                </p>

                <span className="tag">
                  {b.status}
                </span>
              </div>

              {b.tutor?._id === user?.id &&
                b.status === "Pending" && (
                  <div className="actions">
                    <button
                      className="primary small"
                      onClick={() =>
                        status(b._id, "Accepted")
                      }
                    >
                      Accept
                    </button>

                    <button
                      className="ghost"
                      onClick={() =>
                        status(b._id, "Rejected")
                      }
                    >
                      Decline
                    </button>
                  </div>
                )}

              {b.tutor?._id === user?.id &&
                b.status === "Accepted" && (
                  <button
                    className="primary small"
                    onClick={() =>
                      status(b._id, "Completed")
                    }
                  >
                    Mark completed
                  </button>
                )}
            </article>
          ))
        )}
      </div>
    </main>
  );
}

// ================= MAIN APPLICATION =================

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("cse_token");

    if (token) {
      api.get("/auth/me")
        .then((r) => {
          setUser({
            id: r.data._id,
            name: r.data.name,
            email: r.data.email
          });
        })
        .catch(() => {
          localStorage.removeItem("cse_token");
        });
    }
  }, []);

  function onAuth(data) {
    localStorage.setItem("cse_token", data.token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("cse_token");
    setUser(null);
  }

  return (
    <>
      <Nav
        user={user}
        logout={logout}
      />

      <Routes>
        <Route
          path="/"
          element={<Explore user={user} />}
        />

        <Route
          path="/login"
          element={
            <Auth
              mode="login"
              onAuth={onAuth}
            />
          }
        />

        <Route
          path="/register"
          element={
            <Auth
              mode="register"
              onAuth={onAuth}
            />
          }
        />

        <Route
          path="/add"
          element={
            user
              ? <AddSkill />
              : <Auth mode="login" onAuth={onAuth} />
          }
        />

        <Route
          path="/dashboard"
          element={
            user
              ? <Dashboard user={user} />
              : <Auth mode="login" onAuth={onAuth} />
          }
        />

        <Route
          path="*"
          element={<Explore user={user} />}
        />
      </Routes>

      <footer>
        SkillBridge · A campus where everyone has something to teach.
      </footer>
    </>
  );
}
