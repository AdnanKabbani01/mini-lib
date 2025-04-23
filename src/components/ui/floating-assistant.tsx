"use client";

import React, { useState } from "react";
import { Button } from "./button";
import { Assistant } from "./assistant";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

export function FloatingAssistantButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <Button
          className="fixed bottom-6 right-6 rounded-full shadow-lg w-14 h-14 p-0 flex items-center justify-center z-50 bg-emerald-600 hover:bg-emerald-700 transition-all hover:scale-110"
          variant="default"
        >
          <span className="sr-only">Open assistant</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed bottom-[80px] right-6 max-w-md w-[95%] md:w-full z-50 rounded-xl overflow-hidden shadow-2xl">
          <div className="flex flex-col bg-gray-900 rounded-xl shadow-xl h-[600px]">
            <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
              <div className="flex items-center">
                <div className="w-7 h-7 mr-2 rounded-full bg-emerald-600 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">G</span>
                </div>
                <Dialog.Title className="text-lg font-semibold text-white">
                  Library Assistant (Gemini)
                </Dialog.Title>
              </div>
              <Dialog.Close asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-700"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </Dialog.Close>
            </div>

            <Dialog.Description className="sr-only">
              Chat with the Library Assistant AI powered by Google Gemini to
              find books, check availability, and get recommendations
            </Dialog.Description>

            <div className="w-full flex-1 flex">
              <Assistant darkMode={true} />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
