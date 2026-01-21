DROP INDEX `name_address_unique_constraint`;--> statement-breakpoint
CREATE UNIQUE INDEX `name_address_unique_constraint` ON `persons` (`name`,`fullname`,`address`);