-- Remove side-effect audit storage and derive employment status from dates at read time.
DROP INDEX IF EXISTS "AuditLog_entityCode_idx";
DROP TABLE IF EXISTS "AuditLog";

DROP INDEX IF EXISTS "Employee_status_idx";
ALTER TABLE "Employee" DROP COLUMN IF EXISTS "status";
DROP TYPE IF EXISTS "EmployeeStatus";
