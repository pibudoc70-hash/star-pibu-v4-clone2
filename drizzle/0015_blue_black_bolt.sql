ALTER TABLE `guestOtps` ADD `attemptCount` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `guestOtps` ADD `lockedUntil` bigint;