-- CreateTable
CREATE TABLE "Status" (
    "id" TEXT NOT NULL,
    "cat" TEXT,
    "key" TEXT,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assignee" (
    "id" TEXT NOT NULL,
    "cat" TEXT,
    "key" TEXT,

    CONSTRAINT "Assignee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Priority" (
    "id" TEXT NOT NULL,
    "cat" TEXT,
    "key" TEXT,

    CONSTRAINT "Priority_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "cat" TEXT,
    "key" TEXT,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "cat" TEXT,
    "key" TEXT,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IssueList" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "statusId" TEXT,
    "priorityId" TEXT,
    "projectId" TEXT,
    "dueDate" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IssueList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_IssueAssignees" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_IssueTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_IssueAssignees_AB_unique" ON "_IssueAssignees"("A", "B");

-- CreateIndex
CREATE INDEX "_IssueAssignees_B_index" ON "_IssueAssignees"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_IssueTags_AB_unique" ON "_IssueTags"("A", "B");

-- CreateIndex
CREATE INDEX "_IssueTags_B_index" ON "_IssueTags"("B");

-- AddForeignKey
ALTER TABLE "IssueList" ADD CONSTRAINT "IssueList_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueList" ADD CONSTRAINT "IssueList_priorityId_fkey" FOREIGN KEY ("priorityId") REFERENCES "Priority"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IssueList" ADD CONSTRAINT "IssueList_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IssueAssignees" ADD CONSTRAINT "_IssueAssignees_A_fkey" FOREIGN KEY ("A") REFERENCES "Assignee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IssueAssignees" ADD CONSTRAINT "_IssueAssignees_B_fkey" FOREIGN KEY ("B") REFERENCES "IssueList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IssueTags" ADD CONSTRAINT "_IssueTags_A_fkey" FOREIGN KEY ("A") REFERENCES "IssueList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IssueTags" ADD CONSTRAINT "_IssueTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
