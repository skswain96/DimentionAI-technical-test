/*
  Warnings:

  - Made the column `title` on table `IssueList` required. This step will fail if there are existing NULL values in that column.
  - Made the column `content` on table `IssueList` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Assignee" ALTER COLUMN "cat" DROP NOT NULL,
ALTER COLUMN "key" DROP NOT NULL;

-- AlterTable
ALTER TABLE "IssueList" ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "content" SET NOT NULL;

-- AlterTable
ALTER TABLE "Priority" ALTER COLUMN "cat" DROP NOT NULL,
ALTER COLUMN "key" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "cat" DROP NOT NULL,
ALTER COLUMN "key" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Status" ALTER COLUMN "cat" DROP NOT NULL,
ALTER COLUMN "key" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Tag" ALTER COLUMN "cat" DROP NOT NULL,
ALTER COLUMN "key" DROP NOT NULL;
