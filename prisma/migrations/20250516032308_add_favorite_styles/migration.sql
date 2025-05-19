-- AlterTable
ALTER TABLE "UserSettings" ADD COLUMN     "recentStyles" TEXT[];

-- CreateTable
CREATE TABLE "FavoriteStyle" (
    "id" TEXT NOT NULL,
    "styleId" TEXT NOT NULL,
    "useCount" INTEGER NOT NULL DEFAULT 1,
    "lastUsed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "settingsId" TEXT NOT NULL,

    CONSTRAINT "FavoriteStyle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteStyle_settingsId_styleId_key" ON "FavoriteStyle"("settingsId", "styleId");

-- AddForeignKey
ALTER TABLE "FavoriteStyle" ADD CONSTRAINT "FavoriteStyle_settingsId_fkey" FOREIGN KEY ("settingsId") REFERENCES "UserSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
