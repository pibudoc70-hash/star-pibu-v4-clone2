# Mobile Pain Management accordion notes

The supplied 1465×442 reference was reviewed in three overlapping horizontal tiles. The first two verified cards are dark rounded panels with a gold icon/ordinal, a short gold eyebrow, a white treatment heading, and a multi-line explanatory paragraph. The requested mobile design should preserve those clinically approved labels and ordering, but keep only the essential header/summary in the collapsed state and reveal the longer detail/media within an explicit accessible accordion control. Desktop card presentation is outside this change.

The development preview loaded normally after the implementation. Direct initial navigation with `#events` resolved before the lazy event/pain-management content mounted and remained at the top hero, so this browser path could not provide a visual section capture. The mobile accordion DOM and native disclosure behavior are therefore verified by focused component tests; a later rendered-section browser capture will be attempted after forced in-page scrolling.

After the lazy section mounted, the rendered DOM contained three `details` disclosures in the mobile-only `grid gap-3 md:hidden` group and three unchanged `article` cards in the `hidden md:grid md:grid-cols-3` desktop group. The screenshot service could not capture the 390px page, so the responsive switch is verified through these rendered class contracts and the native disclosure test. `pnpm check`, lint (0 errors; 106 existing warnings), the complete 223-file/1,970-test unit suite, and the production build passed.

## Mobile composition refinement

The mobile disclosure header is now a stable three-column grid: a fixed 40px icon column, a flexible title column, and a separate action column. This prevents the label and chevron from competing with long localized titles. The header has a 68px minimum height, which exceeds the mobile 44px touch-target baseline, while the surrounding vertical rhythm remains a compact 12px card gap.

The outer heading spacing is reduced slightly only on mobile to bring the first card into the visual group without crowding the introductory caption. Card corners and shadows are softened into a consistent editorial unit; the gold action is contained in its own padded area; and expanded copy has a narrow, readable measure with a quiet top divider. Desktop keeps the existing independent three-column cards and its original spacing.

The focused accordion suite passed after this adjustment. TypeScript, ESLint (0 errors; existing warnings unchanged), the full unit-test command, and production build completed successfully. The screenshot service again did not return a 390px capture, so final visual confirmation uses the rendered mobile/desktop DOM class contract and test coverage rather than an unavailable screenshot.

## Mobile guidance-panel height compression

The supplied tall light-greige panel corresponds to the three-row `pain-trust-strip` beneath the stage cards. On mobile, its implicit grid rows can now use only their content height through `auto-rows-max content-start`. Each row's vertical padding is reduced from `p-4` to `py-3`, and the preceding section margin is reduced from `mt-4` to `mt-3`. This removes the visually excessive top/bottom air without reducing the 40px icon, two-line text allowance, row dividers, or reading contrast.

The desktop breakpoint explicitly restores the previous `sm:mt-4` and `sm:p-4` values, so the three-column desktop guide is unaffected. The mobile accordion test now protects the compact implicit rows, content-start alignment, and the desktop spacing restoration. Focused tests passed 22/22; TypeScript, ESLint with 0 errors, the full unit test command, and production build completed successfully. The 390px screenshot service did not return an image, and that environment limitation is recorded rather than represented as a visual pass.

## Mobile heading and FAQ density refinement

The mobile heading block now uses a smaller heading-to-caption rhythm: header bottom margin is `mb-4`, while the heading and caption each use `mt-2`. The pre-existing desktop `sm:mb-8` and `sm:mt-3` values remain explicit. This shortens the transition into the first summary card without changing title size, line height, wording, or the mobile accordion target height.

The FAQ card is aligned to the same compact language. On mobile, its preceding margin is `mt-4`, outer padding is `p-3.5`, header gap is `mb-1.5`, question summary padding is `py-2.5`, and expanded answer bottom padding is `pb-3`. The 44px minimum interactive height remains in place. At the `sm` breakpoint the prior `mt-5`, `p-5`, header spacing, `py-3`, and `pb-4` values are restored, so the desktop FAQ remains unchanged.

The mobile regression suite now tests the title/caption compact classes, the FAQ outer spacing, question target height/padding, expanded-answer spacing, and their desktop restoration values. Focused tests passed 23/23. The full suite passed 223 files / 1,972 tests; TypeScript, ESLint with 0 errors, and production build completed successfully.
