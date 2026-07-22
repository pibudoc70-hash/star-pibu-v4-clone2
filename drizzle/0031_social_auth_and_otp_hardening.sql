CREATE TABLE `authIdentities` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `provider` enum('naver','kakao') NOT NULL,
  `providerUserId` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `authIdentities_id` PRIMARY KEY(`id`),
  CONSTRAINT `auth_identities_provider_user_unique` UNIQUE(`provider`,`providerUserId`)
);
--> statement-breakpoint
CREATE INDEX `auth_identities_user_id_idx` ON `authIdentities` (`userId`);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `openId` varchar(128) NOT NULL;
--> statement-breakpoint
ALTER TABLE `reservations` ADD COLUMN `privacyAgreed` enum('0','1') NOT NULL DEFAULT '0';
--> statement-breakpoint
ALTER TABLE `guestOtps` ADD COLUMN `codeHash` varchar(128) NULL;
--> statement-breakpoint
UPDATE `guestOtps` SET `codeHash` = SHA2(`code`, 256) WHERE `codeHash` IS NULL;
--> statement-breakpoint
ALTER TABLE `guestOtps` MODIFY COLUMN `codeHash` varchar(128) NOT NULL;
--> statement-breakpoint
ALTER TABLE `guestOtps` ADD COLUMN `consumedAt` timestamp NULL;
--> statement-breakpoint
ALTER TABLE `guestOtps` DROP COLUMN `code`;
