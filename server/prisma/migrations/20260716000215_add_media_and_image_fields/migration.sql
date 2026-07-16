-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "logoUrl" TEXT,
ALTER COLUMN "logoInitial" DROP NOT NULL,
ALTER COLUMN "logoBg" DROP NOT NULL,
ALTER COLUMN "logoFg" DROP NOT NULL;

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "coverImageUrl" TEXT,
ADD COLUMN     "thumbnailUrl" TEXT;

-- AlterTable
ALTER TABLE "testimonials" ADD COLUMN     "avatarUrl" TEXT;

-- CreateTable
CREATE TABLE "media_assets" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "altText" TEXT,
    "altTextAr" TEXT,
    "folder" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "media_assets_folder_idx" ON "media_assets"("folder");
