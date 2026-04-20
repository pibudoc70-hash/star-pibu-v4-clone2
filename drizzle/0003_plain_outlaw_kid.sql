ALTER TABLE `events` ADD `isSpecialEvent` enum('0','1') DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE `events` ADD `productName` varchar(200) DEFAULT '';--> statement-breakpoint
ALTER TABLE `events` ADD `normalPrice` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `events` ADD `discountPrice` int DEFAULT 0;