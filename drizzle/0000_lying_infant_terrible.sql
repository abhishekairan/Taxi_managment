CREATE TABLE `expense` (
	`id` int AUTO_INCREMENT NOT NULL,
	`driver_id` int,
	`trip_id` int,
	`amount` int,
	`description` text,
	`created_at` varchar(50) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `expense_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trips` (
	`id` int AUTO_INCREMENT NOT NULL,
	`driver_id` int NOT NULL,
	`vehicle_number` varchar(50) NOT NULL,
	`passenger_name` varchar(255) NOT NULL,
	`from_location` varchar(255) NOT NULL,
	`to_location` varchar(255) NOT NULL,
	`start_reading` int NOT NULL,
	`end_reading` int,
	`start_time` varchar(50) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`end_time` varchar(50),
	`running` boolean DEFAULT true,
	CONSTRAINT `trips_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255),
	`email` varchar(255),
	`password_hash` varchar(255),
	`role` varchar(50),
	`session_token` varchar(255),
	`profile_image` varchar(255),
	`phone_number` varchar(20),
	`created_at` varchar(50) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` varchar(50) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `vehicles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`vehicle_number` varchar(50) NOT NULL,
	`speedometer_reading` int,
	`default_passenger` varchar(255),
	`default_from_location` varchar(255),
	`default_to_location` varchar(255),
	CONSTRAINT `vehicles_id` PRIMARY KEY(`id`),
	CONSTRAINT `vehicles_vehicle_number_unique` UNIQUE(`vehicle_number`)
);
--> statement-breakpoint
ALTER TABLE `expense` ADD CONSTRAINT `expense_driver_id_users_id_fk` FOREIGN KEY (`driver_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `expense` ADD CONSTRAINT `expense_trip_id_trips_id_fk` FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `trips` ADD CONSTRAINT `trips_driver_id_users_id_fk` FOREIGN KEY (`driver_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `trips` ADD CONSTRAINT `trips_vehicle_number_vehicles_vehicle_number_fk` FOREIGN KEY (`vehicle_number`) REFERENCES `vehicles`(`vehicle_number`) ON DELETE no action ON UPDATE no action;