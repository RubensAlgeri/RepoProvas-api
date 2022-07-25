/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `disciplines` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pdfUrl]` on the table `tests` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,pdfUrl]` on the table `tests` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "disciplines_name_key" ON "disciplines"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tests_pdfUrl_key" ON "tests"("pdfUrl");

-- CreateIndex
CREATE UNIQUE INDEX "tests_name_pdfUrl_key" ON "tests"("name", "pdfUrl");
