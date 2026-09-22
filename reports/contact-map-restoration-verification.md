# Shared contact surface verification

The common `ContactSection` renders a responsive Google Maps iframe centered on the clinic coordinates `35.1572312,129.0581932`. The iframe endpoint returned HTTP 200 with `text/html; charset=UTF-8`, and the application CSP authorizes `https://www.google.com` and `https://maps.google.com` in `frame-src`.

The contact section now uses the existing warm-beige brand token `--brand-bg-warm` (`#EDE8E0`) rather than the stronger gold accent. On desktop, the map and the ContactInfoPanel sit inside a single rounded outer surface. The information panel has no separated card backgrounds or shadows: address, phone, hours, and transit/parking are separated only by thin dividers. The map uses `lg:h-full` to fill the shared surface height defined by the information column. At smaller breakpoints, the map uses 360px and 440px heights before the integrated information panel stacks underneath.

The map-area Kakao handoff remains removed. The existing Kakao directions and Naver Map buttons remain in the final action row. The shared component is rendered from Footer, so the update applies across public pages.

Focused regression coverage passed for the shared map, global footer, map fallback, i18n, and layout contracts. Screenshot capture through the project tool failed in this environment; no screenshot-based visual claim is recorded.
