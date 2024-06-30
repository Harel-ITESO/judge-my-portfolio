/*
  Warnings:

  - Made the column `postName` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "postName" SET NOT NULL;
