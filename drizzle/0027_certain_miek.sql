ALTER TABLE `notices` ADD `targetLang` enum('all','ko','en','ja','zh') DEFAULT 'all' NOT NULL;--> statement-breakpoint
ALTER TABLE `notices` ADD `sourceNoticeId` int;--> statement-breakpoint
CREATE INDEX `notices_targetLang_idx` ON `notices` (`targetLang`);