CREATE TABLE `consultationRequests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`concern` varchar(200) NOT NULL,
	`message` text NOT NULL,
	`privacyAgreed` varchar(1) NOT NULL DEFAULT '1',
	`ipAddress` varchar(45),
	`turnstileVerified` varchar(1) NOT NULL DEFAULT '0',
	`status` enum('pending','contacted','done','spam') NOT NULL DEFAULT 'pending',
	`lang` varchar(5) DEFAULT 'ko',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `consultationRequests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `idx_consultation_ip_created` ON `consultationRequests` (`ipAddress`,`createdAt`);--> statement-breakpoint
CREATE INDEX `idx_consultation_phone_created` ON `consultationRequests` (`phone`,`createdAt`);