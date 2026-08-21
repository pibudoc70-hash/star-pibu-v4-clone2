/**
 * ConsultationFormSection.tsx — 프리미엄 상담 폼 섹션
 *
 * 스팸 방지 3중 레이어:
 *   1. honeypot  — 숨겨진 website 필드 (봇이 채우면 서버에서 조용히 거부)
 *   2. Turnstile — Cloudflare invisible/managed 위젯 (사용자 경험 0 마찰)
 *   3. rate limit — 서버단 IP/연락처 기반 (10분 3회 / 2회)
 *
 * 배치: ReservationSection 바로 위, 기존 전환 흐름(Hero→FAQ→카카오→예약) 유지
 */
import { useState, useRef, useCallback, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useLang } from "@/contexts/LangContext";
import { CheckCircle2, Loader2, ChevronDown } from "lucide-react";

// ── Turnstile 위젯 타입 선언 ────────────────────────────────────────────────
declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "compact" | "invisible";
          appearance?: "always" | "execute" | "interaction-only";
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

// ── 상수 ────────────────────────────────────────────────────────────────────
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;
// Cloudflare 공식 테스트 키 (항상 성공, 개발용)
const TURNSTILE_TEST_KEY = "1x00000000000000000000AA";

// ── 연락처 자동 포맷 (010-1234-5678) ──────────────────────────────────────
function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  if (digits.length <= 11) return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
}

// ── 폼 상태 타입 ─────────────────────────────────────────────────────────────
interface FormState {
  name: string;
  phone: string;
  concern: string;
  message: string;
  privacyAgreed: boolean;
  website: string; // honeypot
}

interface FormErrors {
  name?: string;
  phone?: string;
  concern?: string;
  message?: string;
  privacyAgreed?: string;
  general?: string;
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
export default function ConsultationFormSection() {
  const { t } = useLang();
  const c = t.consultation;

  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    concern: "",
    message: "",
    privacyAgreed: false,
    website: "", // honeypot — 절대 표시하지 않음
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [turnstileReady, setTurnstileReady] = useState(false);
  const [concernOpen, setConcernOpen] = useState(false);

  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const concernRef = useRef<HTMLDivElement>(null);

  // ── Turnstile 스크립트 로드 ──────────────────────────────────────────────
  useEffect(() => {
    const siteKey = TURNSTILE_SITE_KEY || TURNSTILE_TEST_KEY;

    const initWidget = () => {
      if (!turnstileRef.current || !window.turnstile) return;
      if (widgetIdRef.current) return; // 이미 렌더링됨

      widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
        sitekey: siteKey,
        callback: (token: string) => {
          setTurnstileToken(token);
          setTurnstileReady(true);
        },
        "error-callback": () => {
          setTurnstileToken("");
          setTurnstileReady(false);
        },
        "expired-callback": () => {
          setTurnstileToken("");
          setTurnstileReady(false);
        },
        theme: "light",
        size: "normal",
        appearance: "interaction-only",
      });
    };

    if (window.turnstile) {
      initWidget();
    } else {
      window.onTurnstileLoad = initWidget;
      if (!document.querySelector('script[src*="turnstile"]')) {
        const script = document.createElement("script");
        script.src =
          "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad&render=explicit";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, []);

  // ── 드롭다운 외부 클릭 닫기 ──────────────────────────────────────────────
  useEffect(() => {
    if (!concernOpen) return;
    const handler = (e: MouseEvent) => {
      if (concernRef.current && !concernRef.current.contains(e.target as Node)) {
        setConcernOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [concernOpen]);

  // ── tRPC mutation ────────────────────────────────────────────────────────
  const submitMutation = trpc.consultation.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setErrors({});
    },
    onError: (err) => {
      const rawMessage = err.message ?? "";
      const normalizedMessage = rawMessage.toLowerCase();
      const isRateLimit = rawMessage.includes("잠시") || normalizedMessage.includes("rate") || normalizedMessage.includes("too many");
      const isTurnstileError = rawMessage.includes("보안") || normalizedMessage.includes("turnstile") || normalizedMessage.includes("token");

      if (isRateLimit) {
        setErrors({ general: c.errorRateLimit });
      } else {
        setErrors({ general: c.errorGeneric });

        if (!isTurnstileError) return;

        // Turnstile 리셋
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current);
          setTurnstileToken("");
          setTurnstileReady(false);
        }
      }
    },
  });

  // ── 유효성 검증 ──────────────────────────────────────────────────────────
  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = c.errorRequired;
    if (!form.phone.trim()) {
      newErrors.phone = c.errorRequired;
    } else if (!/^[0-9\s+()-]{9,20}$/.test(form.phone)) {
      newErrors.phone = c.errorPhone;
    }
    if (!form.concern) newErrors.concern = c.errorRequired;
    if (!form.message.trim() || form.message.trim().length < 5) {
      newErrors.message = c.errorMessage;
    }
    if (!form.privacyAgreed) newErrors.privacyAgreed = c.errorPrivacy;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form, c]);

  // ── 제출 핸들러 ──────────────────────────────────────────────────────────
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      // Turnstile 토큰이 없으면 테스트 토큰 사용 (개발 환경)
      const token = turnstileToken || (TURNSTILE_SITE_KEY ? "" : "XXXX.DUMMY.TOKEN.XXXX");
      if (!token) {
        setErrors({ general: c.errorGeneric });
        return;
      }

      submitMutation.mutate({
        name: form.name.trim(),
        phone: form.phone,
        concern: form.concern,
        message: form.message.trim(),
        privacyAgreed: form.privacyAgreed,
        turnstileToken: token,
        website: form.website, // honeypot
        lang: "ko",
      });
    },
    [form, turnstileToken, validate, submitMutation]
  );

  // ── 폼 리셋 ──────────────────────────────────────────────────────────────
  const handleReset = () => {
    setForm({ name: "", phone: "", concern: "", message: "", privacyAgreed: false, website: "" });
    setErrors({});
    setSubmitted(false);
    setTurnstileToken("");
    setTurnstileReady(false);
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  };

  const isLoading = submitMutation.isPending;

  // ── 성공 화면 ─────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <section
        id="consultation"
        className="consultation-section"
        aria-label={c.title}
      >
        <div className="container">
          <div className="consultation-success">
            <CheckCircle2
              className="consultation-success-icon"
              aria-hidden="true"
            />
            <h2 className="consultation-success-title">{c.successTitle}</h2>
            <p className="consultation-success-desc">{c.successDesc}</p>
            <p className="consultation-success-note">{c.successNote}</p>
            <button
              type="button"
              onClick={handleReset}
              className="consultation-reset-btn"
            >
              {c.resetBtn}
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ── 메인 폼 ──────────────────────────────────────────────────────────────
  return (
    <section
      id="consultation"
      className="consultation-section"
      aria-label={c.title}
    >
      <div className="container">
        {/* 섹션 헤더 */}
        <div className="consultation-header">
          <span className="section-eyebrow">{c.eyebrow}</span>
          <h2 className="section-title">{c.title}</h2>
          <p className="section-subtitle">{c.subtitle}</p>
        </div>

        {/* 폼 카드 */}
        <div className="consultation-card">
          <form
            onSubmit={handleSubmit}
            noValidate
            aria-label={c.title}
          >
            {/* Honeypot — 절대 표시하지 않음, 스크린리더도 무시 */}
            <div
              aria-hidden="true"
              className="sr-only"
            >
              <label htmlFor="cf-website">Website</label>
              <input
                id="cf-website"
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
              />
            </div>

            {/* 이름 + 연락처 */}
            <div className="consultation-row">
              {/* 이름 */}
              <div className="consultation-field">
                <label htmlFor="cf-name" className="consultation-label">
                  {c.nameLabel}
                  <span className="consultation-required" aria-hidden="true">*</span>
                </label>
                <input
                  id="cf-name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder={c.namePlaceholder}
                  value={form.name}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, name: e.target.value }));
                    if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
                  }}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "cf-name-error" : undefined}
                  className={`consultation-input${errors.name ? " consultation-input--error" : ""}`}
                  maxLength={50}
                />
                {errors.name && (
                  <span id="cf-name-error" role="alert" className="consultation-error">
                    {errors.name}
                  </span>
                )}
              </div>

              {/* 연락처 */}
              <div className="consultation-field">
                <label htmlFor="cf-phone" className="consultation-label">
                  {c.phoneLabel}
                  <span className="consultation-required" aria-hidden="true">*</span>
                </label>
                <input
                  id="cf-phone"
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  inputMode="numeric"
                  placeholder={c.phonePlaceholder}
                  value={form.phone}
                  onChange={(e) => {
                    const formatted = formatPhone(e.target.value);
                    setForm((p) => ({ ...p, phone: formatted }));
                    if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }));
                  }}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "cf-phone-error" : undefined}
                  className={`consultation-input${errors.phone ? " consultation-input--error" : ""}`}
                  maxLength={14}
                />
                {errors.phone && (
                  <span id="cf-phone-error" role="alert" className="consultation-error">
                    {errors.phone}
                  </span>
                )}
              </div>
            </div>

            {/* 희망 시술 / 고민 부위 — 커스텀 드롭다운 */}
            <div className="consultation-field" ref={concernRef}>
              <label htmlFor="cf-concern" className="consultation-label">
                {c.concernLabel}
                <span className="consultation-required" aria-hidden="true">*</span>
              </label>
              <div className="consultation-select-wrapper">
                <button
                  id="cf-concern"
                  type="button"
                  role="combobox"
                  aria-expanded={concernOpen}
                  aria-haspopup="listbox"
                  aria-invalid={!!errors.concern}
                  aria-describedby={errors.concern ? "cf-concern-error" : undefined}
                  onClick={() => setConcernOpen((p) => !p)}
                  className={`consultation-select-btn${errors.concern ? " consultation-input--error" : ""}${form.concern ? "" : " consultation-select-btn--placeholder"}`}
                >
                  <span>{form.concern || c.concernPlaceholder}</span>
                  <ChevronDown
                    className={`consultation-select-chevron${concernOpen ? " consultation-select-chevron--open" : ""}`}
                    aria-hidden="true"
                    size={16}
                  />
                </button>
                {concernOpen && (
                  <ul
                    role="listbox"
                    aria-label={c.concernLabel}
                    className="consultation-select-list"
                  >
                    {c.concerns.map((item: string) => (
                      <li
                        key={item}
                        role="option"
                        aria-selected={form.concern === item}
                        onClick={() => {
                          setForm((p) => ({ ...p, concern: item }));
                          setConcernOpen(false);
                          if (errors.concern) setErrors((p) => ({ ...p, concern: undefined }));
                        }}
                        className={`consultation-select-item${form.concern === item ? " consultation-select-item--selected" : ""}`}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {errors.concern && (
                <span id="cf-concern-error" role="alert" className="consultation-error">
                  {errors.concern}
                </span>
              )}
            </div>

            {/* 상담 내용 */}
            <div className="consultation-field">
              <label htmlFor="cf-message" className="consultation-label">
                {c.messageLabel}
                <span className="consultation-required" aria-hidden="true">*</span>
              </label>
              <textarea
                id="cf-message"
                name="message"
                rows={5}
                placeholder={c.messagePlaceholder}
                value={form.message}
                onChange={(e) => {
                  setForm((p) => ({ ...p, message: e.target.value }));
                  if (errors.message) setErrors((p) => ({ ...p, message: undefined }));
                }}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "cf-message-error" : undefined}
                className={`consultation-textarea${errors.message ? " consultation-input--error" : ""}`}
                maxLength={2000}
              />
              <div className="consultation-char-count">
                {form.message.length} / 2000
              </div>
              {errors.message && (
                <span id="cf-message-error" role="alert" className="consultation-error">
                  {errors.message}
                </span>
              )}
            </div>

            {/* Turnstile 위젯 */}
            <div
              ref={turnstileRef}
              className="consultation-turnstile"
              aria-label="보안 인증"
            />

            {/* 개인정보 동의 */}
            <div className="consultation-privacy">
              <label className="consultation-privacy-label">
                <input
                  type="checkbox"
                  checked={form.privacyAgreed}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, privacyAgreed: e.target.checked }));
                    if (errors.privacyAgreed) setErrors((p) => ({ ...p, privacyAgreed: undefined }));
                  }}
                  aria-invalid={!!errors.privacyAgreed}
                  aria-describedby={errors.privacyAgreed ? "cf-privacy-error" : undefined}
                  className="consultation-checkbox"
                />
                <span className="consultation-privacy-text">
                  {c.privacyLabel}
                  {" — "}
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="consultation-privacy-link"
                  >
                    {c.privacyLink}
                  </a>
                </span>
              </label>
              {errors.privacyAgreed && (
                <span id="cf-privacy-error" role="alert" className="consultation-error">
                  {errors.privacyAgreed}
                </span>
              )}
            </div>

            {/* 전체 오류 메시지 */}
            {errors.general && (
              <div role="alert" className="consultation-general-error">
                {errors.general}
              </div>
            )}

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={isLoading}
              className="consultation-submit-btn"
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="consultation-spinner" aria-hidden="true" size={18} />
                  {c.submitting}
                </>
              ) : (
                c.submitBtn
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
