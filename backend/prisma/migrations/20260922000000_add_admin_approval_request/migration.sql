-- CreateTable
CREATE TABLE "AdminApprovalRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminApprovalRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminApprovalRequest_userId_key" ON "AdminApprovalRequest"("userId");

-- CreateIndex
CREATE INDEX "AdminApprovalRequest_status_idx" ON "AdminApprovalRequest"("status");

-- CreateIndex
CREATE INDEX "AdminApprovalRequest_reviewerId_idx" ON "AdminApprovalRequest"("reviewerId");

-- AddForeignKey
ALTER TABLE "AdminApprovalRequest"
ADD CONSTRAINT "AdminApprovalRequest_userId_fkey" FOREIGN KEY ("userId")
REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminApprovalRequest"
ADD CONSTRAINT "AdminApprovalRequest_reviewerId_fkey" FOREIGN KEY ("reviewerId")
REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;