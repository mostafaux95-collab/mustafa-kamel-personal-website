-- CreateTable
CREATE TABLE "cv_education" (
    "id" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "degreeAr" TEXT,
    "school" TEXT NOT NULL,
    "schoolAr" TEXT,
    "years" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "cv_education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_languages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameAr" TEXT,
    "level" TEXT NOT NULL,
    "levelAr" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "cv_languages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cv_education_status_sortOrder_idx" ON "cv_education"("status", "sortOrder");

-- CreateIndex
CREATE INDEX "cv_languages_status_sortOrder_idx" ON "cv_languages"("status", "sortOrder");
