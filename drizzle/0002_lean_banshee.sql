ALTER TABLE `users` ADD `profile_image` text;--> statement-breakpoint
ALTER TABLE `users` ADD `phone_number` text;--> statement-breakpoint
ALTER TABLE `users` ADD `created_at` text DEFAULT (current_timestamp);--> statement-breakpoint
ALTER TABLE `users` ADD `updated_at` text DEFAULT (current_timestamp);