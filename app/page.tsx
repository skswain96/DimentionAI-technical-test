"use client";

import React, { useCallback, useEffect, useState } from "react";
import { EditorView } from "prosemirror-view";
import debounce from "lodash/debounce";

import { useModal } from "@/context/modal";
import { Modal } from "@/components/Modal";
import { ModalAction } from "@/components/Modal/ModalAction";
import { PMEditorReact } from "@/components/ProseMirror/PMEditor";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Toolbar } from "@/components/ProseMirror/Toolbar";

import { infoIcon, closeIcon, plusIcon } from "@/public/icons";

import { removeIcons, getPayload } from "@/utils/helper";

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

export default function Home() {
  const [editorView, setEditorView] = useState<EditorView | null>(null);
  const [issueTitle, setIssueTitle] = useState<string>("");
  const [optInputData, setOptInputData] = useState<any>(null);
  const [markdown, setMarkdown] = useState<string>("");
  const [issueList, setIssueList] = useState<any>([]);
  const [suggestionList, setSuggestionList] = useState<any>([]);

  const [alertMessage, setAlertMessage] = useState<any>(null);

  const { openModal, closeModal } = useModal();

  const handleSubmitTask: any = useCallback(async (data: IssueData) => {
    try {
      const response = await fetch("/api/createIssue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        setAlertMessage({
          title: "Something went wrong",
          body: "Failed to create issue.",
          type: "error",
        });

        return;
      }

      const result = await response.json();

      if (result?.data) {
        setAlertMessage({
          title: "Issue created successfully",
          body: "Your issue has been created.",
          type: "success",
        });

        await getIssueList();
      }

      closeModal();
    } catch (error) {
      setAlertMessage({
        title: "Something went wrong",
        body: "Failed to create issue.",
        type: "error",
      });
      console.error("Failed to create issue:", error);
    }
  }, []);

  const checkKeywordsForSuggestion: any = useCallback(
    debounce(async (data: any) => {
      try {
        const response = await fetch("/api/checkKeywords", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          setAlertMessage({
            title: "Something went wrong with Open AI",
            body: "Please try again.",
            type: "error",
          });

          return;
        }

        const result = await response.json();
        setSuggestionList(result?.data);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        // Optionally, set an error state here
        setSuggestionList([]);
      }
    }, 300),
    []
  );

  async function getIssueList() {
    try {
      const response = await fetch("/api/getIssuesList", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        setAlertMessage({
          title: "Something went wrong",
          body: "Failed to fetch issues.",
          type: "error",
        });

        return;
      }

      const result = await response.json();
      setIssueList(result.data);
    } catch (error) {
      console.error("Failed to fetch issue list:", error);

      setAlertMessage({
        title: "Something went wrong",
        body: "Failed to fetch issues.",
        type: "error",
      });
    }
  }

  useEffect(() => {
    getIssueList();

    console.log("here", process.env.NEXT_PUBLIC_TEST);
  }, []);

  useEffect(() => {
    let timeoutId: any;

    if (alertMessage) {
      timeoutId = setTimeout(() => {
        setAlertMessage(null);
      }, 5000);
    }

    return () => clearTimeout(timeoutId);
  }, [alertMessage]);

  return (
    <div className="w-screen h-screen relative overflow-hidden z-0 bg-[#ededed] p-3">
      <div className="inline-flex flex-col w-full h-full rounded-lg bg-white">
        <div className="inline-flex items-center justify-between w-full px-8 py-2 border-b-[1px] border-b-[#ededed]">
          <span className="text-sm text-gray-800">Tasks</span>

          <button
            className="inline-flex items-center space-x-2 text-sm py-2 px-3 rounded-lg text-white bg-[#533BE5] hover:bg-[#422fbb]"
            onClick={() => {
              openModal();
            }}
          >
            <span>Create Issue</span>

            {plusIcon}
          </button>
        </div>

        <div className="inline-flex flex-col w-full">
          <div
            className={`inline-flex items-center border-b-[1px] border-b-gray-200 py-2 px-8 bg-gray-50`}
          >
            <span className="text-xs text-gray-700">Title</span>
          </div>
          {issueList?.map((item: any, index: number) => {
            return (
              <div
                key={item?.title + "_" + index}
                className={`inline-flex items-center space-x-5 border-b-[1px] border-b-gray-100 py-2 px-8`}
              >
                <div>
                  <span className="text-xs text-gray-500">{item?.title}</span>
                </div>

                <div className="inline-flex items-center space-x-2">
                  {item?.tags?.map((tag: any, index: number) => {
                    return (
                      <button
                        key={tag?.key + "_" + index}
                        className="inline-flex items-center justify-center border-[1px] border-dashed border-[#DFE1E4] rounded-lg px-2 py-1 text-[#94989E] outline-none"
                      >
                        <span className="text-xs font-medium">{tag?.cat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Modal
        breadcrumb={<Breadcrumb />}
        footer={
          <ModalAction
            editorView={editorView!}
            disable={issueTitle && markdown ? false : true}
            handleOnClick={() => {
              if (issueTitle && markdown) {
                const payload = {
                  title: issueTitle,
                  content: markdown,
                  ...removeIcons(getPayload(optInputData)),
                };

                handleSubmitTask(payload);
              } else {
                setAlertMessage({
                  title: "Title and description required",
                  body: "Please enter a title and description before submitting",
                  type: "info",
                });
              }
            }}
          />
        }
      >
        <div className="inline-flex flex-col h-full w-full px-3 space-y-2">
          <input
            className="w-full text-gray-900 font-medium text-base outline-none p-1"
            placeholder="Task title"
            onChange={async (e) => {
              setIssueTitle(e.target.value);

              const data = {
                queryString: e.target.value || markdown,
                issuesList: issueList,
              };

              if (!data?.queryString) {
                return;
              }

              await checkKeywordsForSuggestion(data);
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
            suggestionList={suggestionList}
          />
        </div>
      </Modal>

      <div className="fixed bottom-0 right-0 mx-4 mb-4 min-w-[424px] h-auto z-[800]">
        {alertMessage ? (
          <div
            className={`inline-flex items-start bg-white rounded-lg shadow-alert w-full transition duration-500`}
          >
            <div
              className="inline-flex items-start w-full gap-3 p-3"
              style={{
                transformStyle: "preserve-3d",
                perspective: "700px",
                perspectiveOrigin: "50% 0px",
              }}
            >
              <div className="inline-flex items-start h-full pt-[2px]">
                {infoIcon}
              </div>

              <div className="inline-flex flex-col w-full text-sm space-y-1">
                <div className="inline-flex items-center justify-between w-full">
                  <span className="text-gray-900">{alertMessage?.title}</span>

                  <button
                    onClick={() => {
                      setAlertMessage(null);
                    }}
                    className="cursor-pointer inline-flex items-center justify-center hover:bg-gray-100 rounded-full p-1 outline-none"
                  >
                    {closeIcon}
                  </button>
                </div>

                <p className="text-gray-500">{alertMessage?.body}</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
