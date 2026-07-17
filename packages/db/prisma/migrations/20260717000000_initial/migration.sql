CREATE TYPE "EmployeeStatus" AS ENUM ('ACTIVE', 'TERMINATED', 'FUTURE');

CREATE TABLE "Employee" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "occupation" TEXT NOT NULL,
  "department" TEXT NOT NULL,
  "dateOfEmployment" TIMESTAMP(3) NOT NULL,
  "terminationDate" TIMESTAMP(3),
  "status" "EmployeeStatus" NOT NULL,
  "nationalId" TEXT,
  "salaryCents" INTEGER,
  "emergencyContact" TEXT,
  "confidentialNotes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AuditLog" (
  "id" TEXT NOT NULL,
  "entityCode" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "actor" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Employee_code_key" ON "Employee"("code");
CREATE INDEX "Employee_department_idx" ON "Employee"("department");
CREATE INDEX "Employee_status_idx" ON "Employee"("status");
CREATE INDEX "Employee_fullName_idx" ON "Employee"("fullName");
CREATE INDEX "AuditLog_entityCode_idx" ON "AuditLog"("entityCode");
