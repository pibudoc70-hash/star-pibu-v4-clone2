import { describe, expect, it } from "vitest";
import {
  escapeHtml,
  getAdminNotificationEmail,
  getReservationConfirmationEmail,
  getReservationStatusEmail,
} from "./email";

describe("email templates", () => {
  it("escapes HTML-sensitive characters", () => {
    expect(escapeHtml(`<script>alert("x")</script> & 'test'`)).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &#39;test&#39;",
    );
  });

  it("does not interpolate reservation data as executable HTML", () => {
    const html = getReservationConfirmationEmail({
      patientName: '<img src=x onerror="alert(1)">',
      treatmentName: "<b>treatment</b>",
      preferredDate: "2026-07-22",
      preferredTime: "10:00",
      phone: "010-1234-5678",
      notes: "<script>unsafe()</script>",
      reservationId: 42,
    });

    expect(html).not.toContain('<img src=x onerror="alert(1)">');
    expect(html).not.toContain("<script>unsafe()</script>");
    expect(html).toContain("&lt;img src=x onerror=&quot;alert(1)&quot;&gt;");
    expect(html).toContain("&lt;script&gt;unsafe()&lt;/script&gt;");
  });

  it("limits email status CSS classes to known status values", () => {
    const html = getReservationStatusEmail({
      patientName: "홍길동",
      treatmentName: "피부 관리",
      status: 'x" onclick="alert(1)',
      statusLabel: "<b>변경됨</b>",
      preferredDate: "2026-07-22",
      preferredTime: "10:00",
      reservationId: 42,
    });

    expect(html).toContain('class="status-badge status-updated"');
    expect(html).toContain("&lt;b&gt;변경됨&lt;/b&gt;");
    expect(html).not.toContain('onclick="alert(1)');
  });

  it("escapes user-provided data in administrator notifications", () => {
    const html = getAdminNotificationEmail({
      patientName: "<b>홍길동</b>",
      phone: "010-1234-5678",
      treatmentName: "<img src=x>",
      preferredDate: "2026-07-22",
      preferredTime: "10:00",
      notes: "<script>unsafe()</script>",
      reservationId: 42,
    });

    expect(html).toContain("&lt;b&gt;홍길동&lt;/b&gt;");
    expect(html).toContain("&lt;img src=x&gt;");
    expect(html).toContain("&lt;script&gt;unsafe()&lt;/script&gt;");
  });
});
