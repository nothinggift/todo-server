/*
  Warnings:

  - You are about to drop the column `title` on the `Todo` table. All the data in the column will be lost.
  - Made the column `content` on table `Todo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Todo" DROP COLUMN "title",
ALTER COLUMN "content" SET NOT NULL;
