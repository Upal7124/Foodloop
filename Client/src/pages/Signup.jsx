import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Leaf,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Building2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import KitchenProfileStep from "../components/auth/KitchenProfileStep";
import NGOProfileStep from "../components/auth/NGOProfileStep";
import DeliveryAgentStep from "../components/auth/DeliveryAgentStep";

// ── Password rules ───────────────────────────────────────────────────────────
const passwordRules = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "Contains a number", test: (p) => /\d/.test(p) },
  { label: "Contains a letter", test: (p) => /[a-zA-Z]/.test(p) },
];

// ── Role config ──────────────────────────────────────────────────────────────
const ROLES = [
  {
    key: "kitchen",
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-zLY2VD08yL17Pnh82JRmV4hS5NGF667okawfgNTz9Q&s=10",
    title: "Institutional Kitchen",
    desc: "Hospitals, schools, corporates, or any large kitchen that cooks daily at scale.",
    color: "#16a34a",
  },
  {
    key: "ngo",
    icon: "https://static.vecteezy.com/system/resources/previews/022/988/656/non_2x/ngo-icon-vector.jpg",
    title: "NGO / Charity",
    desc: "Organisations that receive and redistribute surplus food to those in need.",
    color: "#16a34a",
  },
  {
    key: "agent",
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMx6swun-edqDz0YCASSxAaRXOBNgwK298iRtFECkP5l6kcj1lEZe0V38&s=10",
    title: "Delivery Agent",
    desc: "Individuals or fleets that transport surplus food from kitchens to NGOs.",
    color: "#16a34a",
  },
];

export default function Signup() {
  const { signup, completeRegistration, saveKitchenProfile } = useAuth();
  const navigate = useNavigate();

  // 0 = role selection, 1 = account form, 2 = role-specific profile
  const [step, setStep] = useState(0);
  const [role, setRole] = useState(null);
  const [pendingUser, setPendingUser] = useState(null);

  // Step 1 form
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    restaurant: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  };

  // ── Step 0 → Step 1 ─────────────────────────────────────────────────────
  const handleRoleSelect = (r) => {
    setRole(r);
    setStep(1);
  };

  // ── Step 1 submit ────────────────────────────────────────────────────────
  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!passwordRules.every((r) => r.test(form.password))) {
      setError("Password does not meet the requirements.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);

    const result = await signup({
      ...form,
      role: role?.key,
    });

    setLoading(false);
    if (result.success) {
      setPendingUser(result.user);
      setStep(2);
    } else setError(result.message);
  };

  // ── Step 2 handlers ───────────────────────────────────────────────────────
  const handleProfileComplete = async (profileData) => {
    if (role?.key === "kitchen") {
      await saveKitchenProfile(pendingUser.id, profileData);
    }

    completeRegistration(pendingUser);
    navigate("/", { replace: true });
  };
  const handleProfileSkip = () => {
    completeRegistration(pendingUser);
    navigate("/", { replace: true });
  };

  // ── Render Step 2 ─────────────────────────────────────────────────────────
  if (step === 2) {
    if (role?.key === "ngo")
      return (
        <NGOProfileStep
          pendingUser={pendingUser}
          onComplete={handleProfileComplete}
          onSkip={handleProfileSkip}
        />
      );
    if (role?.key === "agent")
      return (
        <DeliveryAgentStep
          pendingUser={pendingUser}
          onComplete={handleProfileComplete}
          onSkip={handleProfileSkip}
        />
      );
    return (
      <KitchenProfileStep
        pendingUser={pendingUser}
        onComplete={handleProfileComplete}
        onSkip={handleProfileSkip}
      />
    );
  }

  // ── Render Step 0 — Role Selection ────────────────────────────────────────
  if (step === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{ backgroundColor: "#f3f4f6" }}
      >
        <div className="w-full max-w-lg">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "#1a6b3a" }}
            >
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-2xl">FoodLoop</span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">
              Who are you joining as?
            </h1>
            <p className="text-sm text-gray-500 text-center mb-7">
              Choose your role to get a personalised experience
            </p>

            <div className="space-y-3">
              {ROLES.map((r) => (
                <button
                  key={r.key}
                  onClick={() => handleRoleSelect(r)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all hover:shadow-md"
                  style={{ borderColor: r.border, backgroundColor: r.bg }}
                >
                  <img src={r.icon} alt={r.title} className="w-12 h-12 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-bold" style={{ color: r.color }}>
                      {r.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{r.desc}</p>
                  </div>
                  <ArrowRight
                    size={16}
                    style={{ color: r.color }}
                    className="flex-shrink-0"
                  />
                </button>
              ))}
            </div>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-green-600 font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Render Step 1 — Account form ──────────────────────────────────────────
  const pwStrength = passwordRules.filter((r) => r.test(form.password)).length;
  const strengthLabel = ["", "Weak", "Fair", "Strong"];
  const strengthColor = ["", "#ef4444", "#f59e0b", "#22c55e"];
  const activeRole = ROLES.find((r) => r.key === role?.key);

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#f3f4f6" }}>
      {/* Left branding */}
      <div
        className="hidden lg:flex lg:w-5/12 flex-col justify-between p-10 relative overflow-hidden"
        style={{
          background: activeRole
            ? `linear-gradient(145deg, ${activeRole.color}dd 0%, ${activeRole.color} 100%)`
            : "linear-gradient(145deg, #14532d 0%, #1a6b3a 100%)",
        }}
      >
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-10 bg-white"></div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/20">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-xl">FoodLoop</p>
            <p className="text-white/60 text-xs">Cook Smart. Share More.</p>
          </div>
        </div>
        <div className="relative z-10">
          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white/30 flex items-center justify-center">
                <CheckCircle2 size={14} className="text-white" />
              </div>
              <span className="text-white/80 text-sm">Role Selected</span>
            </div>
            <div className="flex-1 h-px bg-white/20"></div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <span className="text-white text-sm font-medium">
                Create Account
              </span>
            </div>
            <div className="flex-1 h-px bg-white/20"></div>
            <div className="flex items-center gap-2 opacity-50">
              <div className="w-7 h-7 rounded-full border-2 border-white/50 flex items-center justify-center">
                <span className="text-white/70 text-xs font-bold">3</span>
              </div>
              <span className="text-white/70 text-sm">Profile</span>
            </div>
          </div>

          {/* <div className="text-4xl mb-3">{activeRole?.icon}</div> */}
          <h2 className="text-white text-3xl font-bold mb-2">
            {activeRole?.title}
          </h2>
          <p className="text-white/70 text-sm leading-relaxed mb-6">
            {activeRole?.desc}
          </p>

          <button
            onClick={() => setStep(0)}
            className="text-xs text-white/60 hover:text-white underline"
          >
            ← Change role
          </button>
        </div>
        <p className="relative z-10 text-white/40 text-xs">
          Good Food · Brighter Tomorrows 🌱
        </p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md py-4">
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: activeRole?.color || "#1a6b3a" }}
            >
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">FoodLoop</span>
            <button
              onClick={() => setStep(0)}
              className="ml-auto text-xs text-gray-400 hover:text-gray-600 underline"
            >
              ← Change role
            </button>
          </div>

          {/* Role tag */}
          <div className="flex items-center gap-2 mb-5">
            {/* <span className="text-sm">{activeRole?.icon}</span> */}
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: activeRole?.bg,
                color: activeRole?.color,
              }}
            >
              Registering as: {activeRole?.title}
            </span>
            <span className="text-xs text-gray-400">Step 2 of 3</span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Create your account
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              Start reducing food waste today — it&apos;s free
            </p>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
                <AlertCircle size={15} className="flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleAccountSubmit} className="space-y-4">
              {/* Full name */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Full name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Jane Smith"
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Email address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500"
                  />
                </div>
              </div>

              {/* Restaurant / Org */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  {role?.key === "kitchen"
                    ? "Kitchen / Restaurant Name"
                    : role?.key === "ngo"
                      ? "Organization Name"
                      : "Full Name / Agency"}{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <Building2
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    name="restaurant"
                    value={form.restaurant}
                    onChange={handleChange}
                    placeholder={
                      role?.key === "kitchen"
                        ? "e.g. The Green Plate"
                        : role?.key === "ngo"
                          ? "e.g. Asha Foundation"
                          : "e.g. QuickDeliver Logistics"
                    }
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    className="w-full pl-9 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {form.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-1 flex-1 rounded-full"
                          style={{
                            backgroundColor:
                              i <= pwStrength
                                ? strengthColor[pwStrength]
                                : "#e5e7eb",
                          }}
                        ></div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                      {passwordRules.map((r) => (
                        <span
                          key={r.label}
                          className={`text-xs flex items-center gap-1 ${r.test(form.password) ? "text-green-600" : "text-gray-400"}`}
                        >
                          <CheckCircle2 size={11} />
                          {r.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Confirm password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirm"
                    value={form.confirm}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    className={`w-full pl-9 pr-10 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors ${form.confirm && form.confirm !== form.password ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:ring-green-200 focus:border-green-500"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {form.confirm && form.confirm !== form.password && (
                  <p className="text-xs text-red-500 mt-1">
                    Passwords do not match
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
                style={{ backgroundColor: activeRole?.color || "#16a34a" }}
              >
                {loading && (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                )}
                {loading
                  ? "Creating account…"
                  : `Continue to ${activeRole?.title} Profile →`}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold hover:underline"
                style={{ color: activeRole?.color || "#16a34a" }}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
