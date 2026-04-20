CREATE TABLE `guestOtps` (
	`id` int AUTO_INCREMENT NOT NULL,
	`phone` varchar(20) NOT NULL,
	`code` varchar(6) NOT NULL,
	`verified` enum('0','1') NOT NULL DEFAULT '0',
	`expiresAt` bigint NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `guestOtps_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reservations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`isGuest` enum('0','1') NOT NULL DEFAULT '0',
	`patientName` varchar(100) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`treatmentCategory` varchar(100) NOT NULL,
	`treatmentName` varchar(200) NOT NULL,
	`preferredDate` bigint NOT NULL,
	`preferredTime` varchar(10) NOT NULL,
	`notes` text,
	`status` enum('pending','confirmed','completed','cancelled') NOT NULL DEFAULT 'pending',
	`adminNote` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reservations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `events` MODIFY COLUMN `content` text NOT NULL;