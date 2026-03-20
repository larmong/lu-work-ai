"use client"

import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Plus, Paperclip, ArrowUp, Copy, Check, Menu, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogMedia,
} from "@/components/ui/alert-dialog"

interface BlogPost {
  id: string
  title: string
  tags: string[]
  outline: string[]
  content: string
  prompt: string
  createdAt: string
}

export default function NaverBlogPage() {
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [copiedItem, setCopiedItem] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<string | null>(null)

  useEffect(() => {
    const savedPosts = localStorage.getItem("naver-blog-posts")
    if (savedPosts) {
      const parsed = JSON.parse(savedPosts)
      // 기존 데이터 마이그레이션: tableOfContents -> outline
      const migratedPosts = parsed.map((post: any) => ({
        ...post,
        title: Array.isArray(post.title) ? post.title[0] : (post.title || "제목 없음"),
        outline: post.outline || post.tableOfContents || [],
      }))
      setPosts(migratedPosts)
      // 처음 들어오면 새 프롬프트 입력창 표시 (포스트 선택 안 함)
    }
    
    const checkScreenSize = () => {
      setSidebarOpen(window.innerWidth >= 768)
    }
    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  const savePosts = (newPosts: BlogPost[]) => {
    localStorage.setItem("naver-blog-posts", JSON.stringify(newPosts))
    setPosts(newPosts)
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    const userPrompt = prompt.trim()
    setLoading(true)
    setError(null)
    
    const tempId = Date.now().toString()
    const tempPost: BlogPost = {
      id: tempId,
      title: "생성 중...",
      tags: [],
      outline: [],
      content: "",
      prompt: userPrompt,
      createdAt: new Date().toISOString(),
    }
    
    // 선택된 글이 있으면 해당 글을 삭제하고 새 글로 교체
    const postsWithoutSelected = selectedPostId 
      ? posts.filter((p) => p.id !== selectedPostId)
      : posts
    
    const newPosts = [tempPost, ...postsWithoutSelected]
    savePosts(newPosts)
    setSelectedPostId(tempId)
    setPrompt("")

    try {
      const response = await fetch("/api/naver-blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: userPrompt }),
      })

      const data = await response.json()

      if (response.ok) {
        const updatedPost: BlogPost = {
          ...tempPost,
          title: data.title || "제목 없음",
          tags: data.tags || [],
          outline: data.outline || [],
          content: data.content || data.blogPost || "",
        }

        const updatedPosts = newPosts.map((p) => (p.id === tempId ? updatedPost : p))
        savePosts(updatedPosts)
      } else {
        setError(data.error || "블로그 포스트 생성에 실패했습니다.")
        const updatedPosts = newPosts.filter((p) => p.id !== tempId)
        savePosts(updatedPosts)
        if (updatedPosts.length > 0) {
          setSelectedPostId(updatedPosts[0].id)
        } else {
          setSelectedPostId(null)
        }
      }
    } catch (error) {
      console.error("생성 실패:", error)
      setError("네트워크 오류가 발생했습니다.")
      const updatedPosts = newPosts.filter((p) => p.id !== tempId)
      savePosts(updatedPosts)
      if (updatedPosts.length > 0) {
        setSelectedPostId(updatedPosts[0].id)
      } else {
        setSelectedPostId(null)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (text: string, itemId: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedItem(itemId)
    setTimeout(() => setCopiedItem(null), 2000)
  }

  const handleDeleteClick = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setPostToDelete(postId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (!postToDelete) return
    
    const updatedPosts = posts.filter((p) => p.id !== postToDelete)
    savePosts(updatedPosts)
    if (selectedPostId === postToDelete) {
      setSelectedPostId(updatedPosts.length > 0 ? updatedPosts[0].id : null)
    }
    
    setDeleteDialogOpen(false)
    setPostToDelete(null)
  }

  const groupPostsByDate = () => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const groups: { [key: string]: BlogPost[] } = {
      Today: [],
      Yesterday: [],
      "7 Days Ago": [],
      Older: [],
    }

    posts.forEach((post) => {
      const postDate = new Date(post.createdAt)
      const postDay = new Date(postDate.getFullYear(), postDate.getMonth(), postDate.getDate())

      if (postDay.getTime() === today.getTime()) {
        groups.Today.push(post)
      } else if (postDay.getTime() === yesterday.getTime()) {
        groups.Yesterday.push(post)
      } else if (postDay >= sevenDaysAgo) {
        groups["7 Days Ago"].push(post)
      } else {
        groups.Older.push(post)
      }
    })

    return groups
  }

  const selectedPost = posts.find((p) => p.id === selectedPostId)
  const groupedPosts = groupPostsByDate()
  const filteredGroups = Object.entries(groupedPosts).reduce((acc, [key, posts]) => {
    const filtered = posts.filter((post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.prompt.toLowerCase().includes(searchQuery.toLowerCase())
    )
    if (filtered.length > 0) {
      acc[key] = filtered
    }
    return acc
  }, {} as { [key: string]: BlogPost[] })

  const renderSidebar = (isMobile: boolean = false) => (
    <>
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {Object.entries(filteredGroups).map(([group, groupPosts]) => (
            <div key={group}>
              <div className="text-xs text-muted-foreground mb-2 px-2">{group}</div>
              <div className="space-y-1">
                {groupPosts.map((post) => (
                  <div
                    key={post.id}
                    className={`group relative w-full rounded-lg transition-colors overflow-hidden ${
                      selectedPostId === post.id
                        ? "bg-muted"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <button
                      onClick={() => {
                        setSelectedPostId(post.id)
                        if (isMobile) setSidebarOpen(false)
                      }}
                      className={`w-full text-left px-3 py-2 pr-10 text-sm ${
                        selectedPostId === post.id
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      <div className="truncate">{post.title}</div>
                    </button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={(e) => handleDeleteClick(post.id, e)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 flex items-center justify-center p-0 active:!translate-y-[-50%]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <Button
          onClick={() => {
            setSelectedPostId(null)
            setPrompt("")
            if (isMobile) setSidebarOpen(false)
          }}
          className="w-full bg-black text-white hover:bg-black/80"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>
    </>
  )

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <div className={`${sidebarOpen ? 'w-72' : 'w-0'} hidden md:flex border-r border-border transition-all duration-300 flex-col overflow-hidden`}>
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {Object.entries(filteredGroups).map(([group, groupPosts]) => (
              <div key={group}>
                <div className="text-xs text-muted-foreground mb-2 px-2">{group}</div>
                <div className="space-y-1">
                  {groupPosts.map((post) => (
                    <div
                      key={post.id}
                      className={`group relative w-full rounded-lg transition-colors overflow-hidden ${
                        selectedPostId === post.id
                          ? "bg-muted"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <button
                        onClick={() => setSelectedPostId(post.id)}
                        className={`w-full text-left px-3 py-2 pr-10 text-sm ${
                          selectedPostId === post.id
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        <div className="truncate overflow-hidden text-ellipsis text-sm whitespace-nowrap max-w-[200px]">
                          {post.title}
                        </div>
                      </button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={(e) => handleDeleteClick(post.id, e)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 bg-transparent hover:bg-transparent flex items-center justify-center p-0 active:!translate-y-[-50%]"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4">
          <Button
            onClick={() => {
              setSelectedPostId(null)
              setPrompt("")
            }}
            className="w-full bg-black text-white hover:bg-black/80 py-5"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-72 bg-background border-r border-border flex flex-col">
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-6">
                {Object.entries(filteredGroups).map(([group, groupPosts]) => (
                  <div key={group}>
                    <div className="text-xs text-muted-foreground mb-2 px-2">{group}</div>
                    <div className="space-y-1">
                      {groupPosts.map((post) => (
                        <div
                          key={post.id}
                          className={`group relative w-full rounded-lg transition-colors overflow-hidden ${
                            selectedPostId === post.id
                              ? "bg-muted"
                              : "hover:bg-muted/50"
                          }`}
                        >
                          <button
                            onClick={() => {
                              setSelectedPostId(post.id)
                              setSidebarOpen(false)
                            }}
                            className={`w-full text-left px-3 py-2 pr-10 text-sm ${
                              selectedPostId === post.id
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            <div className="truncate overflow-hidden text-ellipsis whitespace-nowrap">
                              {post.title}
                            </div>
                          </button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={(e) => handleDeleteClick(post.id, e)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 flex items-center justify-center p-0 active:!translate-y-[-50%]"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border">
              <Button
                onClick={() => {
                  setSelectedPostId(null)
                  setPrompt("")
                  setSidebarOpen(false)
                }}
                className="w-full bg-black text-white hover:bg-black/80"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Chat
              </Button>
            </div>
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-14 border-b border-border flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-emerald-600">blog</span>
          </div>
          <div className="flex items-center gap-3">
            <div>
              <Search className="h-4 w-4" />
            </div>
            <div>
              <Menu className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Content Area with Scroll */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="max-w-4xl mx-auto p-4 md:p-8 pb-8">
              {error && (
                <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
                  {error}
                </div>
              )}
              {selectedPost ? (
                <>
                  {/* 생성 중 화면 */}
                  {selectedPost.title === "생성 중..." ? (
                    <div className="flex items-center justify-center min-h-[600px]">
                      <div className="text-center space-y-6">
                        {/* 스피너 애니메이션 */}
                        <div className="flex justify-center">
                          <div className="relative w-10 h-10">
                            <div className="absolute inset-0 border-4 border-emerald-200 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
                          </div>
                        </div>
                        
                        {/* 메시지 */}
                        <div className="space-y-2">
                          <p className="text-lg font-medium text-foreground animate-pulse">
                            블로그 지수가 쑥쑥 올라가는 소리가 들리시나요? 📈✨
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* 완성된 포스트 화면 */
                    <div className="space-y-6">
                      {/* Title */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h2 className="text-sm font-semibold">제목</h2>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleCopy(selectedPost.title, "title")}
                          >
                            {copiedItem === "title" ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-5">
                          <h1 className="text-2xl font-bold text-foreground leading-relaxed">
                            {selectedPost.title}
                          </h1>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <span>이루몽</span>
                          <span className="mx-2">•</span>
                          <span>{new Date(selectedPost.createdAt).toLocaleDateString("ko-KR")}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      {selectedPost.tags && selectedPost.tags.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold">태그</h2>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleCopy(selectedPost.tags.join(", "), "tags")}
                            >
                              {copiedItem === "tags" ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {selectedPost.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-muted rounded-full text-sm"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Outline */}
                      {selectedPost.outline && selectedPost.outline.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold">목차</h2>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleCopy(selectedPost.outline.join("\n"), "outline")}
                            >
                              {copiedItem === "outline" ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <div className="bg-muted/30 rounded-lg p-4">
                            <ul className="space-y-1">
                              {selectedPost.outline.map((item, idx) => (
                                <li key={idx} className="text-sm">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Content */}
                      {selectedPost.content && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold">내용</h2>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleCopy(selectedPost.content, "content")}
                            >
                              {copiedItem === "content" ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <div className="bg-muted/30 rounded-lg p-6">
                            <div className="whitespace-pre-wrap text-sm leading-relaxed">
                              {selectedPost.content}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center min-h-[500px] text-muted-foreground">
                  <div className="text-center max-w-md">
                    <h2 className="text-2xl font-medium mb-3">블로그 글 작성 시작하기</h2>
                    <p className="text-sm leading-relaxed">
                      주제를 입력하면 AI가 자동으로 포스트를 작성해드립니다.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-4 flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon-sm" 
                className="absolute left-4 top-4 z-10"
              >
                <Paperclip className="h-5 w-5" />
              </Button>
              <Textarea
                placeholder="Ask me anything..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !loading && prompt.trim()) {
                    e.preventDefault()
                    handleGenerate()
                  }
                }}
                className="min-h-[120px] pl-14 pr-16 py-4 rounded-3xl text-base resize-none"
                disabled={loading}
                rows={4}
              />
              <Button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                size="icon"
                className="absolute right-3 bottom-3 rounded-full bg-black text-white hover:bg-black/80 h-10 w-10"
              >
                <ArrowUp className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="sm:max-w-[320px] p-4 gap-3">
          <AlertDialogMedia className="bg-destructive/10 h-9 w-9 mb-1">
            <Trash2 className="h-4 w-4 text-destructive" />
          </AlertDialogMedia>
          <AlertDialogHeader className="space-y-1.5">
            <AlertDialogTitle className="text-base">채팅을 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="grid grid-cols-2 gap-2 sm:gap-2">
            <AlertDialogCancel 
              onClick={() => setDeleteDialogOpen(false)}
              className="m-0 h-8 text-sm"
            >
              취소
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-0 m-0 h-8 text-sm"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
