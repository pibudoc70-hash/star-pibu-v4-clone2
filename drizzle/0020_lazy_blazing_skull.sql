CREATE INDEX `events_isActive_idx` ON `events` (`isActive`);--> statement-breakpoint
CREATE INDEX `events_isActive_special_idx` ON `events` (`isActive`,`isSpecialEvent`);--> statement-breakpoint
CREATE INDEX `events_isActive_lang_idx` ON `events` (`isActive`,`targetLang`);--> statement-breakpoint
CREATE INDEX `events_sortOrder_idx` ON `events` (`sortOrder`);--> statement-breakpoint
CREATE INDEX `popupEvents_isActive_idx` ON `popupEvents` (`isActive`);--> statement-breakpoint
CREATE INDEX `youtubeVideos_isActive_idx` ON `youtubeVideos` (`isActive`);--> statement-breakpoint
CREATE INDEX `youtubeVideos_type_isActive_idx` ON `youtubeVideos` (`type`,`isActive`);