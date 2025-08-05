/*
  Warnings:

  - A unique constraint covering the columns `[disk_name]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "File_disk_name_key" ON "public"."File"("disk_name");
