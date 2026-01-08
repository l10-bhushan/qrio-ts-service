-- CreateTable
CREATE TABLE "ShortURL" (
    "id" TEXT NOT NULL,
    "longurl" TEXT NOT NULL,
    "shortcode" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "noOfVisits" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShortURL_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShortURL_longurl_key" ON "ShortURL"("longurl");

-- AddForeignKey
ALTER TABLE "ShortURL" ADD CONSTRAINT "ShortURL_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
