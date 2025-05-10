CREATE TABLE `punches` (
	`id` integer PRIMARY KEY NOT NULL,
	`driver_id` integer,
	`vehicle_id` integer,
	`punch_type` text,
	`passenger_name` text,
	`from_location` text,
	`to_location` text,
	`speedometer_reading` integer,
	`timestamp` text,
	FOREIGN KEY (`driver_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`email` text,
	`password_hash` text,
	`role` text,
	`created_at` text,
	`session_token` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `vehicles` (
	`id` integer PRIMARY KEY NOT NULL,
	`vehicle_number` text,
	`speedometer_reading` integer,
	`default_passenger` text,
	`default_from_location` text,
	`default_to_location` text,
	`assigned_driver_id` integer,
	FOREIGN KEY (`assigned_driver_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
