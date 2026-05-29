ALTER TABLE `events` ADD `targetLang` varchar(20) DEFAULT 'ko' NOT NULL;--> statement-breakpoint
ALTER TABLE `events` ADD `titleEn` varchar(200) DEFAULT '';--> statement-breakpoint
ALTER TABLE `events` ADD `titleJa` varchar(200) DEFAULT '';--> statement-breakpoint
ALTER TABLE `events` ADD `titleZh` varchar(200) DEFAULT '';--> statement-breakpoint
ALTER TABLE `events` ADD `subtitleEn` varchar(150) DEFAULT '';--> statement-breakpoint
ALTER TABLE `events` ADD `subtitleJa` varchar(150) DEFAULT '';--> statement-breakpoint
ALTER TABLE `events` ADD `subtitleZh` varchar(150) DEFAULT '';--> statement-breakpoint
ALTER TABLE `events` ADD `descEn` text;--> statement-breakpoint
ALTER TABLE `events` ADD `descJa` text;--> statement-breakpoint
ALTER TABLE `events` ADD `descZh` text;--> statement-breakpoint
ALTER TABLE `events` ADD `productNameEn` varchar(200) DEFAULT '';--> statement-breakpoint
ALTER TABLE `events` ADD `productNameJa` varchar(200) DEFAULT '';--> statement-breakpoint
ALTER TABLE `events` ADD `productNameZh` varchar(200) DEFAULT '';