/*
  Warnings:

  - You are about to alter the column `noOfVisits` on the `ShortURL` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "ShortURL" ALTER COLUMN "noOfVisits" SET DATA TYPE INTEGER;
