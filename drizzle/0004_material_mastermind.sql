PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`email` text,
	`password_hash` text,
	`role` text,
	`session_token` text,
	`profile_image` text,
	`phone_number` text,
	`created_at` text,
	`updated_at` text
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "name", "email", "password_hash", "role", "session_token", "profile_image", "phone_number", "created_at", "updated_at") SELECT "id", "name", "email", "password_hash", "role", "session_token", "profile_image", "phone_number", "created_at", "updated_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);