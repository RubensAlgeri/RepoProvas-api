/*
  Warnings:

  - A unique constraint covering the columns `[disciplineId,teacherId]` on the table `teacherDisciplines` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "teacherDisciplines_disciplineId_teacherId_key" ON "teacherDisciplines"("disciplineId", "teacherId");
