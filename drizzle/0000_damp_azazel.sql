CREATE TABLE `bills` (
	`id` int AUTO_INCREMENT NOT NULL,
	`meter_id` int NOT NULL,
	`customer_id` int,
	`previous_reading` decimal(12,2) NOT NULL,
	`current_reading` decimal(12,2) NOT NULL,
	`units_used` decimal(12,2) NOT NULL,
	`bill_amount` decimal(12,2) NOT NULL,
	`status` varchar(50) NOT NULL DEFAULT 'NOT PAID',
	`createdAt` date NOT NULL,
	CONSTRAINT `bills_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `complaints` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customer_id` int NOT NULL,
	`subject` varchar(255) NOT NULL,
	`complaint_text` text NOT NULL,
	`status` varchar(50) NOT NULL DEFAULT 'PENDING',
	`response` text,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `complaints_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone` varchar(50),
	`nic` varchar(50),
	`address` text,
	`customer_type` varchar(50) NOT NULL DEFAULT 'HOUSEHOLD',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `customers_id` PRIMARY KEY(`id`),
	CONSTRAINT `customers_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `meter_customer_assignments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`meter_id` int NOT NULL,
	`customer_id` int NOT NULL,
	`assigned_at` timestamp NOT NULL DEFAULT (now()),
	`unassigned_at` timestamp,
	CONSTRAINT `meter_customer_assignments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `meter_reader_assignments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`meter_id` int NOT NULL,
	`meter_reader_id` int NOT NULL,
	`period` varchar(20) NOT NULL,
	`status` varchar(50) NOT NULL DEFAULT 'PENDING',
	CONSTRAINT `meter_reader_assignments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `meter_readings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`meter_id` int NOT NULL,
	`reading_date` date NOT NULL,
	`previous_reading` decimal(12,2) NOT NULL,
	`current_reading` decimal(12,2) NOT NULL,
	`units_used` decimal(12,2) NOT NULL,
	`bill_amount` decimal(12,2) NOT NULL DEFAULT '0',
	CONSTRAINT `meter_readings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `meters` (
	`id` int AUTO_INCREMENT NOT NULL,
	`meter_number` varchar(100) NOT NULL,
	`status` varchar(50) NOT NULL DEFAULT 'ACTIVE',
	`utility_type` varchar(50) NOT NULL,
	`unit` varchar(20) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `meters_id` PRIMARY KEY(`id`),
	CONSTRAINT `meters_meter_number_unique` UNIQUE(`meter_number`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bill_id` int NOT NULL,
	`amount` decimal(12,2) NOT NULL,
	`payment_method` varchar(50) NOT NULL,
	`payment_date` datetime NOT NULL,
	`reference_number` varchar(100),
	`notes` text,
	`recorded_by` int,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tariff_slabs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tariff_id` int NOT NULL,
	`min_units` decimal(12,2) NOT NULL,
	`max_units` decimal(12,2),
	`rate_per_unit` decimal(12,4) NOT NULL,
	`fixed_charge` decimal(12,2) DEFAULT '0',
	CONSTRAINT `tariff_slabs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tariffs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`utility_type` varchar(50) NOT NULL,
	`status` varchar(50) NOT NULL DEFAULT 'ACTIVE',
	`fixed_charge` decimal(12,2),
	`rate_per_unit` decimal(12,4),
	CONSTRAINT `tariffs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`role` varchar(50) NOT NULL,
	`phone` varchar(50),
	`nic` varchar(50),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `bills` ADD CONSTRAINT `bills_meter_id_meters_id_fk` FOREIGN KEY (`meter_id`) REFERENCES `meters`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bills` ADD CONSTRAINT `bills_customer_id_customers_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `complaints` ADD CONSTRAINT `complaints_customer_id_customers_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `meter_customer_assignments` ADD CONSTRAINT `meter_customer_assignments_meter_id_meters_id_fk` FOREIGN KEY (`meter_id`) REFERENCES `meters`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `meter_customer_assignments` ADD CONSTRAINT `meter_customer_assignments_customer_id_customers_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `meter_reader_assignments` ADD CONSTRAINT `meter_reader_assignments_meter_id_meters_id_fk` FOREIGN KEY (`meter_id`) REFERENCES `meters`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `meter_reader_assignments` ADD CONSTRAINT `meter_reader_assignments_meter_reader_id_users_id_fk` FOREIGN KEY (`meter_reader_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `meter_readings` ADD CONSTRAINT `meter_readings_meter_id_meters_id_fk` FOREIGN KEY (`meter_id`) REFERENCES `meters`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_bill_id_bills_id_fk` FOREIGN KEY (`bill_id`) REFERENCES `bills`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_recorded_by_users_id_fk` FOREIGN KEY (`recorded_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tariff_slabs` ADD CONSTRAINT `tariff_slabs_tariff_id_tariffs_id_fk` FOREIGN KEY (`tariff_id`) REFERENCES `tariffs`(`id`) ON DELETE no action ON UPDATE no action;