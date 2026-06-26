CREATE TABLE `keywordTrends` (
	`id` int AUTO_INCREMENT NOT NULL,
	`keyword` varchar(100) NOT NULL,
	`searchVolume` int NOT NULL DEFAULT 0,
	`trendScore` real NOT NULL DEFAULT 0,
	`category` varchar(50) DEFAULT 'general',
	`source` varchar(50) DEFAULT 'google',
	`collectedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `keywordTrends_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `keywordTrends_keyword_idx` ON `keywordTrends` (`keyword`);--> statement-breakpoint
CREATE INDEX `keywordTrends_category_idx` ON `keywordTrends` (`category`);--> statement-breakpoint
CREATE INDEX `keywordTrends_collectedAt_idx` ON `keywordTrends` (`collectedAt`);--> statement-breakpoint
CREATE INDEX `keywordTrends_category_collected_idx` ON `keywordTrends` (`category`,`collectedAt`);