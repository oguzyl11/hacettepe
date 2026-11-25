-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('ACTIVE', 'SOLD');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "ratingAverage" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN "ratingCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN "soldCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Item" ADD COLUMN "status" "ItemStatus" NOT NULL DEFAULT 'ACTIVE';
ALTER TABLE "Item" ADD COLUMN "buyerId" TEXT;
ALTER TABLE "Item" ADD COLUMN "soldAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Rating" (
    "id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "itemId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "raterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rating_itemId_key" ON "Rating"("itemId");
CREATE INDEX "Rating_sellerId_idx" ON "Rating"("sellerId");
CREATE INDEX "Rating_raterId_idx" ON "Rating"("raterId");
CREATE INDEX "User_soldCount_idx" ON "User"("soldCount");
CREATE INDEX "User_ratingAverage_idx" ON "User"("ratingAverage");
CREATE INDEX "Item_status_createdAt_idx" ON "Item"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_raterId_fkey" FOREIGN KEY ("raterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Search indexes. Prisma schema does not model trigram operators.
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX "Item_title_trgm_idx" ON "Item" USING gin ("title" gin_trgm_ops);
CREATE INDEX "Item_description_trgm_idx" ON "Item" USING gin ("description" gin_trgm_ops);
