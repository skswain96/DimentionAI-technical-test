"use client";

import React, { useState } from "react";
import { EditorView } from "prosemirror-view";

import { useModal } from "@/context/modal";
import { Modal } from "@/components/Modal";
import { ModalAction } from "@/components/Modal/ModalAction";
import { PMEditorReact } from "@/components/ProseMirror/PMEditor";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Toolbar } from "@/components/ProseMirror/Toolbar";

type IssueData = {
  title?: string;
  content?: string;
  tags?: string;
  status?: string;
  assignee?: string;
  priority?: string;
  project?: string;
  dueDate?: string;
};

function removeIcons(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(removeIcons);
  } else if (typeof obj === "object" && obj !== null) {
    const { icon, ...rest } = obj; // Destructure to exclude 'icon'
    return Object.fromEntries(
      Object.entries(rest).map(([key, value]): any => [key, removeIcons(value)])
    );
  }
  return obj;
}

function getPayload(obj: any) {
  // Create a shallow copy of the object to avoid mutating the original
  const newObj: any = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    // If the current key is "icon", skip it
    if (key === "icon") continue;

    // If the value is an object or array, call the function recursively
    if (typeof obj[key] === "object" && obj[key] !== null) {
      // If the value is an array, filter out objects with key = 'none'
      if (Array.isArray(obj[key])) {
        const filteredArray = obj[key].filter(
          (item: any) => item.key !== "none"
        );

        // Set to null if the filtered array is empty
        newObj[key] = filteredArray.length > 0 ? filteredArray : null;
      } else {
        // Recursively get the payload for non-array objects
        const nestedPayload = getPayload(obj[key]);

        // Only add to newObj if the nested payload is not empty
        if (Object.keys(nestedPayload).length > 0) {
          newObj[key] = nestedPayload;
        }
      }
    } else {
      // Directly copy the value
      newObj[key] = obj[key];
    }
  }

  return newObj;
}

export default function CreateIssue() {
  // const router = useRouter();
  const [editorView, setEditorView] = useState<EditorView | null>(null);
  const [issueTitle, setIssueTitle] = useState<string>("");
  const [optInputData, setOptInputData] = useState<any>(null);
  const [markdown, setMarkdown] = useState<string>("");

  const { openModal, closeModal } = useModal();

  const handleSubmitTask: any = async (data: IssueData) => {
    const response = await fetch("/api/issue", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      console.log("Issue added:", result.data);
      closeModal();
    } else {
      console.error("Error adding issue:", result.error);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          openModal();
        }}
      >
        Create Issue
      </button>
      <Modal
        breadcrumb={<Breadcrumb />}
        footer={
          <ModalAction
            editorView={editorView!}
            handleOnClick={() => {
              const payload = {
                title: issueTitle,
                content: markdown,
                ...removeIcons(getPayload(optInputData)),
              };

              handleSubmitTask(payload);
            }}
          />
        }
      >
        <div className="inline-flex flex-col h-full w-full px-3 space-y-2">
          <input
            className="w-full text-gray-900 font-medium text-base outline-none p-1"
            placeholder="Task title"
            onChange={(e) => {
              setIssueTitle(e.target.value);
            }}
          />

          <PMEditorReact
            handleEditorViewState={(view: any) => {
              setEditorView(view);
            }}
            handleMarkdownValue={(markdownValue) => {
              setMarkdown(markdownValue);
            }}
          />

          <Toolbar
            issueTitle={issueTitle}
            handleInputData={(data: any) => {
              setOptInputData(data);
            }}
          />
        </div>
      </Modal>
    </>
  );
}
