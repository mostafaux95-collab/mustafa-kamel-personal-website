-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "galleryUrls" TEXT[] DEFAULT ARRAY[]::TEXT[];
