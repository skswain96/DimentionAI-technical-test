import {
  backlogOptionIcon,
  toDoOptionIcon,
  inProgressOptionIcon,
  doneOptionIcon,
  assigneeOptionIcon,
  priorityOptionIcon,
  urgentPriorityIcon,
  highPriorityIcon,
  mediumPriorityIcon,
  lowPriorityIcon,
  tagsOptionIcon,
  projectOptionIcon,
  dueDateOptionIcon,
} from "@/public/icons";

export const createIssueOptions = [
  {
    label: "Todo",
    name: "status",
    placeholder: "Change status...",
    icon: toDoOptionIcon,
    options: [
      {
        cat: "Backlog",
        key: "backlog",
        icon: backlogOptionIcon,
      },
      {
        cat: "Todo",
        key: "todo",
        icon: toDoOptionIcon,
      },
      {
        cat: "In progress",
        key: "in_progress",
        icon: inProgressOptionIcon,
      },
      {
        cat: "Done",
        key: "done",
        icon: doneOptionIcon,
      },
    ],
  },
  {
    label: "Assignee",
    name: "assignee",
    type: "multi-select",
    placeholder: "Assign to...",
    icon: assigneeOptionIcon,
    options: [
      {
        cat: "No Assignee",
        key: "none",
        icon: assigneeOptionIcon,
      },
      {
        cat: "Sudhanshu",
        key: "itsskswain@gmail.com",
        icon: assigneeOptionIcon,
      },
      {
        cat: "John",
        key: "john@gmail.com",
        icon: assigneeOptionIcon,
      },
    ],
  },
  {
    label: "Priority",
    name: "priority",
    placeholder: "Set priority...",
    icon: priorityOptionIcon,
    options: [
      {
        cat: "No Priority",
        key: "none",
        icon: priorityOptionIcon,
      },
      {
        cat: "Urgent",
        key: "urgent",
        icon: urgentPriorityIcon,
      },
      {
        cat: "High",
        key: "high",
        icon: highPriorityIcon,
      },
      {
        cat: "Medium",
        key: "medium",
        icon: mediumPriorityIcon,
      },
      {
        cat: "Low",
        key: "low",
        icon: lowPriorityIcon,
      },
    ],
  },
  {
    label: "Tags",
    name: "tags",
    type: "multi-select",
    placeholder: "Add tags...",
    icon: tagsOptionIcon,
    options: [
      {
        cat: "Bug",
        key: "bug",
        icon: tagsOptionIcon,
      },
      {
        cat: "Feature",
        key: "feature",
        icon: tagsOptionIcon,
      },
      {
        cat: "Improvement",
        key: "improvement",
        icon: tagsOptionIcon,
      },
    ],
  },
  {
    label: "Project",
    name: "project",
    placeholder: "Select project...",
    icon: projectOptionIcon,
    options: [
      {
        cat: "No Project",
        key: "none",
        icon: projectOptionIcon,
      },
      {
        cat: "Cloud PC",
        key: "cloud_pc",
        icon: projectOptionIcon,
      },
      {
        cat: "Compliance",
        key: "compliance",
        icon: projectOptionIcon,
      },
    ],
  },
  {
    label: "Due Date",
    name: "dueDate",
    icon: dueDateOptionIcon,
    options: [],
  },
];
