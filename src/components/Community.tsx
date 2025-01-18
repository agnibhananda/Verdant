import React, { useState, useEffect } from 'react';
import { MessageSquare, Users, Trophy, Share2, ThumbsUp, Search, Plus, Flag, Edit, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { forumApi } from '../lib/forum';
import type { ForumCategory, ForumThread, ForumPost } from '../types/forum';

const Community = () => {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ForumCategory | null>(null);
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<ForumThread | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [newThreadData, setNewThreadData] = useState({ title: '', content: '' });
  const [newPostContent, setNewPostContent] = useState('');
  const [isReporting, setIsReporting] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportingPost, setReportingPost] = useState<ForumPost | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await forumApi.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadThreads = async (categoryId: string) => {
    try {
      const data = await forumApi.getThreadsByCategory(categoryId);
      setThreads(data);
    } catch (error) {
      console.error('Error loading threads:', error);
    }
  };

  const loadPosts = async (threadId: string) => {
    try {
      const data = await forumApi.getPostsByThread(threadId);
      setPosts(data);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const data = await forumApi.searchThreads(searchQuery);
      setThreads(data);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error searching threads:', error);
    }
  };

  const handleCreateThread = async () => {
    if (!selectedCategory || !newThreadData.title || !newThreadData.content) return;
    try {
      await forumApi.createThread(
        selectedCategory.id,
        newThreadData.title,
        newThreadData.content
      );
      setIsCreatingThread(false);
      setNewThreadData({ title: '', content: '' });
      loadThreads(selectedCategory.id);
    } catch (error) {
      console.error('Error creating thread:', error);
    }
  };

  const handleCreatePost = async () => {
    if (!selectedThread || !newPostContent) return;
    try {
      await forumApi.createPost(selectedThread.id, newPostContent);
      setNewPostContent('');
      loadPosts(selectedThread.id);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleReport = async () => {
    if (!reportingPost || !reportReason) return;
    try {
      await forumApi.createReport(reportingPost.id, reportReason);
      setIsReporting(false);
      setReportReason('');
      setReportingPost(null);
    } catch (error) {
      console.error('Error reporting post:', error);
    }
  };

  return (
    <div className="min-h-screen bg-eco-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-eco-primary">Community Forums</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search threads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-eco-primary focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-eco-primary text-white rounded-lg hover:bg-eco-secondary transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-eco-primary mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category);
                      loadThreads(category.id);
                      setSelectedThread(null);
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory?.id === category.id
                        ? 'bg-eco-accent text-eco-primary'
                        : 'hover:bg-eco-background'
                    }`}
                  >
                    <p className="font-medium">{category.name}</p>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Threads and Posts */}
          <div className="lg:col-span-3 space-y-6">
            {selectedCategory && !selectedThread && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-eco-primary">
                    {selectedCategory.name}
                  </h3>
                  <button
                    onClick={() => setIsCreatingThread(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-eco-primary text-white rounded-lg hover:bg-eco-secondary transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                    <span>New Thread</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {threads.map((thread) => (
                    <motion.button
                      key={thread.id}
                      onClick={() => {
                        setSelectedThread(thread);
                        loadPosts(thread.id);
                      }}
                      className="w-full text-left p-4 rounded-lg hover:bg-eco-background transition-colors"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-eco-primary">
                            {thread.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {thread.content.substring(0, 150)}...
                          </p>
                        </div>
                        {thread.is_pinned && (
                          <span className="px-2 py-1 bg-eco-accent text-eco-primary text-xs rounded-full">
                            Pinned
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>{new Date(thread.created_at).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{thread.view_count} views</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {selectedThread && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <button
                      onClick={() => setSelectedThread(null)}
                      className="text-gray-500 hover:text-gray-700 mb-2"
                    >
                      ← Back to Threads
                    </button>
                    <h3 className="text-xl font-bold text-eco-primary">
                      {selectedThread.title}
                    </h3>
                  </div>
                </div>

                <div className="space-y-6">
                  {posts.map((post) => (
                    <div key={post.id} className="border-b last:border-0 pb-6 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-eco-accent rounded-full flex items-center justify-center">
                              <span className="text-eco-primary font-semibold">
                                {post.user_id.substring(0, 2).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-600">{post.content}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <span>
                                {new Date(post.created_at).toLocaleDateString()}
                              </span>
                              {post.is_edited && (
                                <>
                                  <span>•</span>
                                  <span>Edited</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setReportingPost(post);
                            setIsReporting(true);
                          }}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Flag className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {!selectedThread.is_locked && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-eco-primary mb-2">Reply</h4>
                    <div className="space-y-4">
                      <textarea
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder="Write your reply..."
                        className="w-full h-32 p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-eco-primary focus:border-transparent resize-none"
                      />
                      <button
                        onClick={handleCreatePost}
                        className="px-6 py-2 bg-eco-primary text-white rounded-lg hover:bg-eco-secondary transition-colors"
                      >
                        Post Reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Thread Modal */}
      <AnimatePresence>
        {isCreatingThread && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-eco-primary">Create New Thread</h3>
                <button
                  onClick={() => setIsCreatingThread(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newThreadData.title}
                    onChange={(e) =>
                      setNewThreadData({ ...newThreadData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-eco-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    value={newThreadData.content}
                    onChange={(e) =>
                      setNewThreadData({ ...newThreadData, content: e.target.value })
                    }
                    className="w-full h-40 p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-eco-primary focus:border-transparent resize-none"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setIsCreatingThread(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateThread}
                    className="px-6 py-2 bg-eco-primary text-white rounded-lg hover:bg-eco-secondary transition-colors"
                  >
                    Create Thread
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report Modal */}
      <AnimatePresence>
        {isReporting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-eco-primary">Report Post</h3>
                <button
                  onClick={() => setIsReporting(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Report
                  </label>
                  <textarea
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder="Please explain why you're reporting this post..."
                    className="w-full h-32 p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-eco-primary focus:border-transparent resize-none"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setIsReporting(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReport}
                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Submit Report
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Community;