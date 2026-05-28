ALTER TABLE `treatments` ADD `slug` varchar(200);--> statement-breakpoint
ALTER TABLE `treatments` ADD CONSTRAINT `treatments_slug_unique` UNIQUE(`slug`);