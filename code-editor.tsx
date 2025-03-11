"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { File, Plus, Save, Copy, Trash, Paperclip, Play, X, FolderOpen, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Editor from "react-simple-code-editor"
import Prism from "prismjs"
import "prismjs/components/prism-lua" // Base Lua syntax
import "./prism-luau.css" // Import our custom CSS

// Custom Luau syntax highlighting (extending Lua)
const luauSyntax = () => {
  // Extend Lua grammar for Luau
  if (Prism.languages.lua) {
    // Add Luau-specific keywords
    Prism.languages.lua.keyword =
      /\b(?:and|break|do|else|elseif|end|false|for|function|goto|if|in|local|nil|not|or|repeat|return|then|true|until|while|continue|export|type|typeof|task\.spawn|task\.wait|task\.delay)\b/

    // Add Luau type annotations
    Prism.languages.lua["class-name"] = {
      pattern: /(\b(?:type)\s+)(\w+)/,
      lookbehind: true,
    }

    // Add type annotation syntax
    Prism.languages.lua.operator = /[=+\-*/%^#<>]=?|[~:]/

    // Add Luau specific comments
    Prism.languages.lua.comment = [
      {
        pattern: /^--\[\[[\s\S]*?\]\]/m,
        greedy: true,
      },
      {
        pattern: /--\[\[[\s\S]*?\]\]/,
        greedy: true,
      },
      {
        pattern: /--.*$/m,
        greedy: true,
      },
    ]

    // Add string patterns
    Prism.languages.lua.string = {
      pattern: /(["'])(?:(?!\1)[^\\\r\n]|\\z(?:\r\n|\s)|\\(?:\r\n|[^z]))*\1|\[(=*)\[[\s\S]*?\]\2\]/,
      greedy: true,
    }
  }
}

// Initialize Luau syntax
luauSyntax()

interface Tab {
  id: string
  name: string
  content: string
  saved: boolean
  path?: string // Optional path for opened files
}

export default function CodeEditor() {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: "tab-1",
      name: "New Script",
      content:
        '',
      saved: true,
    },
  ])
  const [activeTabId, setActiveTabId] = useState<string>("tab-1")
  const [lineCount, setLineCount] = useState<number>(1)
  const [copySuccess, setCopySuccess] = useState<boolean>(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const lineNumbersRef = useRef<HTMLDivElement>(null)

  // Get the active tab
  const activeTab = tabs.find((tab) => tab.id === activeTabId) || tabs[0]

  // Update line count when content changes
  useEffect(() => {
    if (activeTab) {
      const lines = (activeTab.content.match(/\n/g) || []).length + 1
      setLineCount(lines)
    }
  }, [activeTab])

  // Create a new tab
  const createNewTab = () => {
    const newTabId = `tab-${Date.now()}`
    const newTab = {
      id: newTabId,
      name: `Script ${tabs.length + 1}`,
      content: "",
      saved: true,
    }
    setTabs([...tabs, newTab])
    setActiveTabId(newTabId)
  }

  // Close a tab
  const closeTab = (tabId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }

    const tab = tabs.find((t) => t.id === tabId)

    // Check if the tab has unsaved changes
    if (tab && !tab.saved) {
      if (!confirm(`The file "${tab.name}" has unsaved changes. Do you want to close it anyway?`)) {
        return
      }
    }

    if (tabs.length === 1) {
      // Don't close the last tab, just clear it
      setTabs([{ id: "tab-1", name: "New Script", content: "", saved: true }])
      setActiveTabId("tab-1")
      return
    }

    const newTabs = tabs.filter((tab) => tab.id !== tabId)
    setTabs(newTabs)

    // If we're closing the active tab, switch to another tab
    if (tabId === activeTabId) {
      setActiveTabId(newTabs[newTabs.length - 1].id)
    }
  }

  // Update tab content
  const updateTabContent = (content: string) => {
    setTabs(tabs.map((tab) => (tab.id === activeTabId ? { ...tab, content, saved: false } : tab)))
  }

  // Handle file open button click
  const handleOpenClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const content = await file.text()
      const newTabId = `tab-${Date.now()}`
      const newTab = {
        id: newTabId,
        name: file.name,
        content,
        saved: true,
        path: file.name,
      }

      setTabs([...tabs, newTab])
      setActiveTabId(newTabId)

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      console.error("Error reading file:", error)
      alert("Error reading file. Please try again.")
    }
  }

  // Handle save file
  const handleSaveFile = () => {
    if (!activeTab) return

    // Create a blob with the content
    const blob = new Blob([activeTab.content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)

    // Create a temporary link and trigger download
    const a = document.createElement("a")
    a.href = url
    a.download = activeTab.path || `${activeTab.name.endsWith(".lua") ? activeTab.name : activeTab.name + ".lua"}`
    document.body.appendChild(a)
    a.click()

    // Clean up
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    // Mark the tab as saved
    setTabs(tabs.map((tab) => (tab.id === activeTabId ? { ...tab, saved: true } : tab)))
  }

  // Handle copy to clipboard
  const handleCopyToClipboard = async () => {
    if (!activeTab) return

    try {
      await navigator.clipboard.writeText(activeTab.content)

      // Show success indicator
      setCopySuccess(true)

      // Hide success indicator after 2 seconds
      setTimeout(() => {
        setCopySuccess(false)
      }, 2000)
    } catch (error) {
      console.error("Failed to copy text: ", error)
      alert("Failed to copy to clipboard. Please try again.")
    }
  }

  const inject = async () => {
    fetch("https://dark-exec-web.vercel.app/", { // make sure they match
        method: "post",
        headers: {
            "content-type": "text/plain"
        },
        
        body: "inject"
    })
    .then(response => response.text())
    .then(data =>{
        console.log(": ", data);
    })
    .catch(error =>{
        console.error("ERM! ", error);
    });
  }

  // Handle delete tab
  const handleDeleteTab = () => {
    if (!activeTab) return

    // Ask for confirmation
    if (!confirm(`Are you sure you want to close the "${activeTab.name}" tab?`)) {
      return
    }

    // Close the active tab
    closeTab(activeTabId)
  }

  function handleExecute(){
    const code = activeTab.content

    fetch("https://dark-exec-web.vercel.app/", { // make sure they match
        method: "post",
        headers: {
            "content-type": "text/plain"
        },
        
        body: code
    })
    .then(response => response.text())
    .then(data =>{
        console.log(": ", data);
    })
    .catch(error =>{
        console.error("ERM! ", error);
    });
  }

  // Highlight Luau code
  const highlightLuau = (code: string) => {
    return Prism.highlight(code, Prism.languages.lua, "lua")
  }

  // Synchronize scrolling between editor and line numbers
  useEffect(() => {
    const editorElement = editorRef.current
    const lineNumbersElement = lineNumbersRef.current

    if (!editorElement || !lineNumbersElement) return

    const handleScroll = () => {
      lineNumbersElement.scrollTop = editorElement.scrollTop
    }

    editorElement.addEventListener("scroll", handleScroll)
    return () => {
      editorElement.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div className="flex flex-col h-screen bg-black">
      <div className="flex-1 flex flex-col mx-auto w-full max-w-5xl my-16 rounded-lg overflow-hidden border border-gray-800 bg-[#121212]">
        {/* Tab bar */}
        <div className="flex items-center px-2 py-2 bg-[#1e1e1e] border-b border-gray-800 overflow-x-auto">
          <div className="flex items-center space-x-1">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={cn(
                  "flex items-center px-3 py-1.5 rounded-md text-sm cursor-pointer",
                  tab.id === activeTabId
                    ? "bg-[#252525] text-gray-300"
                    : "bg-[#1e1e1e] text-gray-500 hover:text-gray-300",
                )}
              >
                <File className="h-4 w-4 mr-2" />
                <span>
                  {tab.name}
                  {!tab.saved && " *"}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-2 text-gray-500 hover:text-gray-300"
                  onClick={(e) => closeTab(tab.id, e)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
            ))}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-gray-300"
              onClick={createNewTab}
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">New Tab</span>
            </Button>
          </div>
          <div className="ml-auto flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-gray-300"
              onClick={handleOpenClick}
            >
              <FolderOpen className="h-4 w-4" />
              <span className="sr-only">Open</span>
            </Button>
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".lua,.txt" className="hidden" />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-gray-300"
              onClick={handleSaveFile}
            >
              <Save className="h-4 w-4" />
              <span className="sr-only">Save</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-gray-300 relative"
              onClick={handleCopyToClipboard}
            >
              {copySuccess ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              <span className="sr-only">Copy</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-gray-300"
              onClick={handleDeleteTab}
            >
              <Trash className="h-4 w-4" />
              <span className="sr-only">Delete Tab</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-300" onClick={inject}>
              <Paperclip className="h-4 w-4" />
              <span className="sr-only">Paperclip</span>
            </Button>
            <Button
              variant="ghost"
              className="ml-2 bg-[#252525] hover:bg-[#303030] text-gray-300 rounded-md px-3 py-1.5 flex items-center"
              onClick={handleExecute}
            >
              <Play className="h-4 w-4 mr-1" />
              <span>Execute</span>
            </Button>
          </div>
        </div>

        {/* Editor area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Line numbers */}
          <div
            ref={lineNumbersRef}
            className="bg-[#1a1a1a] text-gray-500 text-right p-2 select-none w-12 font-mono text-sm overflow-hidden"
          >
            {Array.from({ length: lineCount }).map((_, i) => (
              <div key={i} className="h-6">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Code editor with syntax highlighting */}
          <div className="flex-1 overflow-auto bg-[#1a1a1a] custom-scrollbar" ref={editorRef}>
            <Editor
              value={activeTab.content}
              onValueChange={updateTabContent}
              highlight={highlightLuau}
              padding={8}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 14,
                backgroundColor: "#1a1a1a",
                color: "#D4D4D4",
                minHeight: "100%",
              }}
              textareaClassName="outline-none"
              className="editor-wrapper"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

