CREATE INDEX `guestOtps_phone_idx` ON `guestOtps` (`phone`);--> statement-breakpoint
CREATE INDEX `guestOtps_phone_expires_idx` ON `guestOtps` (`phone`,`expiresAt`);--> statement-breakpoint
CREATE INDEX `reservations_userId_idx` ON `reservations` (`userId`);--> statement-breakpoint
CREATE INDEX `reservations_phone_idx` ON `reservations` (`phone`);--> statement-breakpoint
CREATE INDEX `reservations_status_idx` ON `reservations` (`status`);--> statement-breakpoint
CREATE INDEX `reservations_userId_status_idx` ON `reservations` (`userId`,`status`);