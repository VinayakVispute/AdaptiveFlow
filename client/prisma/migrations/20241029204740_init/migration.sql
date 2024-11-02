/*
  Warnings:

  - You are about to drop the column `transcodedVideoId` on the `UploadedVideo` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[apiKey]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sourceVideoId` to the `TranscodedVideo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UploadedVideo" DROP CONSTRAINT "UploadedVideo_transcodedVideoId_fkey";

-- AlterTable
ALTER TABLE "TranscodedVideo" ADD COLUMN     "sourceVideoId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UploadedVideo" DROP COLUMN "transcodedVideoId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "apiKey" TEXT,
ADD COLUMN     "maxVideosAllowed" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "videosUploaded" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "User_apiKey_key" ON "User"("apiKey");

-- AddForeignKey
ALTER TABLE "TranscodedVideo" ADD CONSTRAINT "TranscodedVideo_sourceVideoId_fkey" FOREIGN KEY ("sourceVideoId") REFERENCES "UploadedVideo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
