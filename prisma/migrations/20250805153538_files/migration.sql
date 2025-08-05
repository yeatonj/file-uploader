-- CreateTable
CREATE TABLE "public"."File" (
    "id" SERIAL NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "dir_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "disk_name" TEXT NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."File" ADD CONSTRAINT "File_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."File" ADD CONSTRAINT "File_dir_id_fkey" FOREIGN KEY ("dir_id") REFERENCES "public"."Directories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
