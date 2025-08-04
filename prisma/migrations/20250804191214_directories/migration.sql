-- CreateTable
CREATE TABLE "public"."Directories" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "parent_dir" INTEGER NOT NULL,

    CONSTRAINT "Directories_pkey" PRIMARY KEY ("id")
);
