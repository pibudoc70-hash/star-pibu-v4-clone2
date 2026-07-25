CREATE TABLE `authIdentities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`provider` enum('naver','kakao') NOT NULL,
	`providerUserId` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `authIdentities_id` PRIMARY KEY(`id`),
	CONSTRAINT `auth_identities_provider_user_unique` UNIQUE(`provider`,`providerUserId`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `openId` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `reservations` ADD `privacyAgreed` enum('0','1') DEFAULT '0' NOT NULL;--> statement-breakpoint
CREATE INDEX `auth_identities_user_id_idx` ON `authIdentities` (`userId`);--> statement-breakpoint
CREATE INDEX `equipment3_sortOrder_idx` ON `equipment3` (`sortOrder`);--> statement-breakpoint
CREATE INDEX `equipment3_isActive_sortOrder_idx` ON `equipment3` (`isActive`,`sortOrder`);--> statement-breakpoint
CREATE INDEX `events_isActive_sortOrder_createdAt_idx` ON `events` (`isActive`,`sortOrder`,`createdAt`);--> statement-breakpoint
CREATE INDEX `notices_isPinned_createdAt_idx` ON `notices` (`isPinned`,`createdAt`);--> statement-breakpoint
CREATE INDEX `reservations_createdAt_idx` ON `reservations` (`createdAt`);--> statement-breakpoint
CREATE INDEX `youtubeVideos_sortOrder_idx` ON `youtubeVideos` (`sortOrder`);--> statement-breakpoint
CREATE INDEX `youtubeVideos_type_isActive_sortOrder_idx` ON `youtubeVideos` (`type`,`isActive`,`sortOrder`);