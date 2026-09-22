"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { ChevronRightIcon, AlertIcon } from "@/components/icons";
import { useTransitionNav } from "@/components/PageTransitionProvider";

type Service = { id: string; name: string };

type FormErrors = Partial<Record<"name" | "mobile" | "dob" | "serviceId", string>>;

export default function RegistrationForm({
  services,
  prebookingAmount
}: {
  services: Service[];
  prebookingAmount: number;
}) {
  const { navigate } = useTransitionNav();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function validateClientSide(): FormErrors {
    const next: FormErrors = {};
    if (!name.trim()) next.name = "Please enter your full name.";
    const digits = mobile.replace(/\D/g, "");
    if (!digits) next.mobile = "Please enter your mobile number.";
    if (!serviceId) next.serviceId = "Please select a service.";
    return next;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;

    const clientErrors = validateClientSide();
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) return;

    setSubmitting(true);
    setServerError(null);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, mobile, dob: dob || undefined, serviceId })
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        setServerError(data.message || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      navigate(`/pay/${data.registrationId}`);
    } catch {
      setServerError("Network error. Please check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-dvh bg-cream">
      <div className="container-narrow py-10">
        <div className="mb-8 flex items-center gap-3">
          <Logo size={40} />
          <div>
            <p className="text-xs uppercase tracking-widest text-gold-600">Birari Unisex Salon</p>
            <h1 className="font-display text-xl font-bold text-ink">Complete Your Registration</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label htmlFor="name" className="label-text">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`input-field ${errors.name ? "input-error" : ""}`}
              placeholder="e.g. Priya Sharma"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className="field-error-text">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="mobile" className="label-text">
              Mobile Number
            </label>
            <input
              id="mobile"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={10}
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
              className={`input-field ${errors.mobile ? "input-error" : ""}`}
              placeholder="10-digit mobile number"
              aria-invalid={!!errors.mobile}
              aria-describedby={errors.mobile ? "mobile-error" : undefined}
            />
            {errors.mobile && (
              <p id="mobile-error" className="field-error-text">
                {errors.mobile}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="dob" className="label-text">
              Date of Birth <span className="normal-case text-black/30">(optional)</span>
            </label>
            <input
              id="dob"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className={`input-field ${errors.dob ? "input-error" : ""}`}
            />
            {errors.dob && <p className="field-error-text">{errors.dob}</p>}
          </div>

          <div>
            <label htmlFor="service" className="label-text">
              Select Service
            </label>
            <select
              id="service"
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className={`input-field ${errors.serviceId ? "input-error" : ""}`}
              aria-invalid={!!errors.serviceId}
            >
              <option value="">Choose a service</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
            {errors.serviceId && <p className="field-error-text">{errors.serviceId}</p>}
          </div>

          <div className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-black/60">
            Pre-booking amount:{" "}
            <span className="font-semibold text-ink">₹{prebookingAmount}</span>
          </div>

          {serverError && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? "Submitting..." : "Complete Registration"}
            {!submitting && <ChevronRightIcon className="h-4 w-4" />}
          </button>

          <Link
            href="/"
            className="block text-center text-xs font-medium text-black/40 hover:text-black/60"
          >
            Back to home
          </Link>
        </form>
      </div>
    </main>
  );
}
