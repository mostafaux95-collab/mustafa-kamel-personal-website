-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleAr" TEXT,
    "company" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "taglineAr" TEXT,
    "role" TEXT NOT NULL,
    "roleAr" TEXT,
    "category" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "coverGradientFrom" TEXT NOT NULL,
    "coverGradientTo" TEXT NOT NULL,
    "challenge" TEXT NOT NULL,
    "challengeAr" TEXT,
    "solution" TEXT NOT NULL,
    "solutionAr" TEXT,
    "metrics" JSONB NOT NULL,
    "techStack" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "hasCaseStudy" BOOLEAN NOT NULL DEFAULT false,
    "metaTitle" TEXT,
    "metaTitleAr" TEXT,
    "metaDescription" TEXT,
    "metaDescriptionAr" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");

-- CreateIndex
CREATE INDEX "projects_status_sortOrder_idx" ON "projects"("status", "sortOrder");
