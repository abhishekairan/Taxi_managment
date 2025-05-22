CREATE TABLE `expense` (
	`id` integer PRIMARY KEY NOT NULL,
	`driver_id` integer,
	`trip_id` integer,
	`amount` integer,
	`description` text,
	`created_at` text DEFAULT (current_timestamp),
	FOREIGN KEY (`driver_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `trips` (
	`id` integer PRIMARY KEY NOT NULL,
	`driver_id` integer NOT NULL,
	`vehicle_number` text NOT NULL,
	`passenger_name` text NOT NULL,
	`from_location` text NOT NULL,
	`to_location` text NOT NULL,
	`start_reading` integer NOT NULL,
	`end_reading` integer,
	`start_time` text DEFAULT (current_timestamp),
	`end_time` text,
	`running` integer DEFAULT true,
	FOREIGN KEY (`driver_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`vehicle_number`) REFERENCES `vehicles`(`vehicle_number`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`email` text,
	`password_hash` text,
	`role` text,
	`session_token` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `vehicles` (
	`id` integer PRIMARY KEY NOT NULL,
	`vehicle_number` text NOT NULL,
	`speedometer_reading` integer,
	`default_passenger` text,
	`default_from_location` text,
	`default_to_location` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `vehicles_vehicle_number_unique` ON `vehicles` (`vehicle_number`);