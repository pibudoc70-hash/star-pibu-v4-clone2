-- authIdentities, reservations.privacyAgreed, and auth_identities_user_id_idx are created in 0031.
-- This migration retains only schema changes and indexes that are unique to 0032.
ALTER TABLE `users` MODIFY COLUMN `openId` varchar(128) NOT NULL;
--> statement-breakpoint
CREATE INDEX `equipment3_sortOrder_idx` ON `equipment3` (`sortOrder`);
--> statement-breakpoint
CREATE INDEX `equipment3_isActive_sortOrder_idx` ON `equipment3` (`isActive`,`sortOrder`);
--> statement-breakpoint
CREATE INDEX `events_isActive_sortOrder_createdAt_idx` ON `events` (`isActive`,`sortOrder`,`createdAt`);
--> statement-breakpoint
CREATE INDEX `notices_isPinned_createdAt_idx` ON `notices` (`isPinned`,`createdAt`);
--> statement-breakpoint
CREATE INDEX `reservations_createdAt_idx` ON `reservations` (`createdAt`);
--> statement-breakpoint
CREATE INDEX `youtubeVideos_sortOrder_idx` ON `youtubeVideos` (`sortOrder`);
--> statement-breakpoint
CREATE INDEX `youtubeVideos_type_isActive_sortOrder_idx` ON `youtubeVideos` (`type`,`isActive`,`sortOrder`);
