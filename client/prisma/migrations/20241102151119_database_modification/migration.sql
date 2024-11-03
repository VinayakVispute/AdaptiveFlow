/*
  Warnings:

  - A unique constraint covering the columns `[sourceVideoId]` on the table `TranscodedVideo` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TranscodedVideo_sourceVideoId_key" ON "TranscodedVideo"("sourceVideoId");
