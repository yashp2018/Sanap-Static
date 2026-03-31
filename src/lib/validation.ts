// ── Validators ────────────────────────────────────────────────

export const isValidPhone = (v: string) => /^[6-9]\d{9}$/.test(v.replace(/\s|-/g, ""));

export const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export const isValidPincode = (v: string) => /^\d{6}$/.test(v);

export const isValidName = (v: string) => v.trim().length >= 2;

// ── Login ─────────────────────────────────────────────────────
export function validateLogin(email: string, password: string) {
  const errors: Record<string, string> = {};
  if (!email.trim()) {
    errors.email = "Email or phone is required";
  } else if (email.includes("@") && !isValidEmail(email)) {
    errors.email = "Enter a valid email address";
  } else if (!email.includes("@") && !isValidPhone(email)) {
    errors.email = "Enter a valid 10-digit phone number";
  }
  if (!password) errors.password = "Password is required";
  else if (password.length < 6) errors.password = "Password must be at least 6 characters";
  return errors;
}

// ── Register ──────────────────────────────────────────────────
export function validateRegister(form: {
  name: string; phone: string; email: string;
  password: string; confirmPassword: string;
}) {
  const errors: Record<string, string> = {};
  if (!isValidName(form.name))       errors.name     = "Name must be at least 2 characters";
  if (!form.phone.trim())            errors.phone    = "Phone number is required";
  else if (!isValidPhone(form.phone)) errors.phone   = "Enter a valid 10-digit Indian mobile number";
  if (form.email && !isValidEmail(form.email)) errors.email = "Enter a valid email address";
  if (!form.password)                errors.password = "Password is required";
  else if (form.password.length < 8) errors.password = "Password must be at least 8 characters";
  else if (!/[A-Z]/.test(form.password)) errors.password = "Include at least one uppercase letter";
  else if (!/\d/.test(form.password))    errors.password = "Include at least one number";
  if (form.password !== form.confirmPassword) errors.confirmPassword = "Passwords do not match";
  return errors;
}

// ── Checkout ──────────────────────────────────────────────────
export function validateCheckout(form: {
  fullName: string; phone: string; email: string;
  address: string; city: string; pincode: string;
}) {
  const errors: Record<string, string> = {};
  if (!isValidName(form.fullName))    errors.fullName = "Full name is required";
  if (!form.phone.trim())             errors.phone    = "Phone number is required";
  else if (!isValidPhone(form.phone)) errors.phone    = "Enter a valid 10-digit Indian mobile number";
  if (form.email && !isValidEmail(form.email)) errors.email = "Enter a valid email address";
  if (!form.address.trim())           errors.address  = "Delivery address is required";
  if (!form.city.trim())              errors.city     = "City is required";
  if (!form.pincode.trim())           errors.pincode  = "Pincode is required";
  else if (!isValidPincode(form.pincode)) errors.pincode = "Enter a valid 6-digit pincode";
  return errors;
}

// ── Contact ───────────────────────────────────────────────────
export function validateContact(form: {
  name: string; phone: string; email: string; message: string;
}) {
  const errors: Record<string, string> = {};
  if (!isValidName(form.name))        errors.name    = "Name must be at least 2 characters";
  if (!form.phone.trim())             errors.phone   = "Phone number is required";
  else if (!isValidPhone(form.phone)) errors.phone   = "Enter a valid 10-digit Indian mobile number";
  if (form.email && !isValidEmail(form.email)) errors.email = "Enter a valid email address";
  if (form.message.trim().length > 0 && form.message.trim().length < 10)
    errors.message = "Message must be at least 10 characters";
  return errors;
}

// ── Password strength ─────────────────────────────────────────
export function passwordStrength(p: string): { score: number; label: string; color: string } {
  if (!p) return { score: 0, label: "", color: "" };
  let score = 0;
  if (p.length >= 8)          score++;
  if (p.length >= 12)         score++;
  if (/[A-Z]/.test(p))        score++;
  if (/\d/.test(p))           score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  if (score <= 1) return { score, label: "Weak",   color: "bg-red-500" };
  if (score <= 3) return { score, label: "Medium", color: "bg-amber-500" };
  return              { score, label: "Strong", color: "bg-primary" };
}
