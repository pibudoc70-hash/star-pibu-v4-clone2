CREATE TABLE `youtubeVideos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`videoId` varchar(50) NOT NULL,
	`type` enum('video','shorts') NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	`isActive` enum('0','1') NOT NULL DEFAULT '1',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `youtubeVideos_id` PRIMARY KEY(`id`)
);
