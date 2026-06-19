import type { LoanApplication, LoanApplicationDraft } from "./loan-types";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.trim() || "";
const STORAGE_KEY = "loan_applications_v1";
const ADMIN_TOKEN_KEY = "loan_admin_token";

// ---------- Helpers ----------
function uid() {
  return "app_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function readLocal(): LoanApplication[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeLocal(apps: LoanApplication[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

// ---------- Public API ----------
export interface SubmitPayload {
  fields: LoanApplicationDraft;
  files: {
    passportPhoto?: File | null;
    idDocument?: File | null;
    proofOfIncome?: File | null;
    proofOfAddress?: File | null;
  };
}

export const api = {
  isMock: !API_BASE,

  async submitApplication(payload: SubmitPayload): Promise<{ id: string }> {
    if (API_BASE) {
      const fd = new FormData();
      Object.entries(payload.fields).forEach(([k, v]) => fd.append(k, String(v ?? "")));
      Object.entries(payload.files).forEach(([k, f]) => {
        if (f) fd.append(k, f);
      });
      const res = await fetch(`${API_BASE}/applications`, { method: "POST", body: fd });
      if (!res.ok) throw new Error("Submission failed");
      return res.json();
    }
    // Mock
    const filesEnc: Record<string, string | undefined> = {};
    for (const [k, f] of Object.entries(payload.files)) {
      if (f) {
        filesEnc[k] = await fileToDataUrl(f);
        filesEnc[`${k}Name`] = f.name as unknown as string;
      }
    }
    const app: LoanApplication = {
      id: uid(),
      createdAt: new Date().toISOString(),
      status: "pending",
      ...payload.fields,
      ...filesEnc,
    };
    const all = readLocal();
    all.unshift(app);
    writeLocal(all);
    return { id: app.id };
  },

  async listApplications(): Promise<LoanApplication[]> {
    if (API_BASE) {
      const res = await fetch(`${API_BASE}/applications`, {
        headers: { Authorization: `Bearer ${getAdminToken() ?? ""}` },
      });
      if (!res.ok) throw new Error("Failed to load applications");
      return res.json();
    }
    return readLocal();
  },

  async getApplication(id: string): Promise<LoanApplication | null> {
    if (API_BASE) {
      const res = await fetch(`${API_BASE}/applications/${id}`, {
        headers: { Authorization: `Bearer ${getAdminToken() ?? ""}` },
      });
      if (!res.ok) return null;
      return res.json();
    }
    return readLocal().find((a) => a.id === id) ?? null;
  },

  async adminLogin(email: string, password: string): Promise<{ token: string }> {
    if (API_BASE) {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Invalid credentials");
      const data = await res.json();
      setAdminToken(data.token);
      return data;
    }
    // Mock credentials
    if (email === "admin@loan.com" && password === "admin123") {
      const token = "mock-token-" + Date.now();
      setAdminToken(token);
      return { token };
    }
    throw new Error("Invalid credentials. Try admin@loan.com / admin123");
  },
};

// ---------- Admin token ----------
export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}
export function setAdminToken(token: string) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}
export function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}