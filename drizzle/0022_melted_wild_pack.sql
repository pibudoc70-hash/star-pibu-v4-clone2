CREATE TABLE `notices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(300) NOT NULL,
	`content` text NOT NULL,
	`isPinned` enum('0','1') NOT NULL DEFAULT '0',
	`views` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `notices_isPinned_idx` ON `notices` (`isPinned`);--> statement-breakpoint
CREATE INDEX `notices_createdAt_idx` ON `notices` (`createdAt`);