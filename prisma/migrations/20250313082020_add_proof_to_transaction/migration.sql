-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "proof" TEXT,
ALTER COLUMN "status" SET DEFAULT 'pending';
