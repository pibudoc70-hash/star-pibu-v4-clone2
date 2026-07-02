ALTER TABLE `popupEvents` ADD `targetLang` enum('all','ko','en','ja','zh') DEFAULT 'all' NOT NULL;--> statement-breakpoint
CREATE INDEX `popupEvents_targetLang_idx` ON `popupEvents` (`targetLang`);