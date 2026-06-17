CREATE TABLE `notice_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`noticeId` int NOT NULL,
	`fileKey` varchar(500) NOT NULL,
	`url` varchar(1000) NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notice_images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `noticeImages_noticeId_idx` ON `notice_images` (`noticeId`);