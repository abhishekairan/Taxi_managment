PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_expense` (
	`id` integer PRIMARY KEY NOT NULL,
	`driver_id` integer,
	`trip_id` integer,
	`amount` integer,
	`description` text,
	`created_at` text DEFAULT (current_timestamp),
	FOREIGN KEY (`driver_id`) REFERENCES `users`(`name`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_expense`("id", "driver_id", "trip_id", "amount", "description", "created_at") SELECT "id", "driver_id", "trip_id", "amount", "description", "created_at" FROM `expense`;--> statement-breakpoint
DROP TABLE `expense`;--> statement-breakpoint
ALTER TABLE `__new_expense` RENAME TO `expense`;--> statement-breakpoint
PRAGMA foreign_keys=ON;