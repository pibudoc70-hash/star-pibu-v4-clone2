import { Fragment } from "react";

interface MobileCommaBreakProps {
  text: string;
}

/**
 * Keeps one shared locale string for every viewport while exposing an optional
 * comma break only through the mobile stylesheet.
 */
export function MobileCommaBreak({ text }: MobileCommaBreakProps) {
  return (
    <>
      {text.split(",").map((segment, index) => (
        <Fragment key={`${index}-${segment}`}>
          {index > 0 && <br aria-hidden="true" className="mobile-comma-break hidden" />}
          {segment.trim()}
        </Fragment>
      ))}
    </>
  );
}
