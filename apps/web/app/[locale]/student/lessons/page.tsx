'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { lessonService, Lesson } from '@/lib/services/lesson.service';

export default function StudentLessonsPage() {
    const t = useTranslations('teacher');
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

    useEffect(() => {
        fetchLessons();
    }, []);

    const fetchLessons = async () => {
        setLoading(true);
        try {
            const data = await lessonService.getAll();
            setLessons(data);
        } catch (error) {
            console.error('Failed to fetch lessons', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                {t('lessons')}
            </h1>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-500 dark:text-gray-400">Loading...</div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lessons.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 col-span-full">{t('noLessons')}</p>
                    ) : (
                        lessons.map((lesson) => (
                            <div
                                key={lesson.id}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                                onClick={() => setSelectedLesson(lesson)}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                                        {lesson.title}
                                    </h3>
                                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                        {lesson.subject?.name}
                                    </span>
                                </div>

                                {lesson.content && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                                        {lesson.content}
                                    </p>
                                )}

                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                    {lesson.videoUrl && (
                                        <div className="flex items-center gap-1">
                                            <span>🎥</span>
                                            <span>Video</span>
                                        </div>
                                    )}
                                    {lesson.attachments && lesson.attachments.length > 0 && (
                                        <div className="flex items-center gap-1">
                                            <span>📎</span>
                                            <span>{lesson.attachments.length} {t('files')}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 text-xs text-gray-400 dark:text-gray-500">
                                    {lesson.author?.name || lesson.author?.email}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Lesson Details Modal */}
            {selectedLesson && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {selectedLesson.title}
                            </h2>
                            <button
                                onClick={() => setSelectedLesson(null)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="mb-4">
                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                {selectedLesson.subject?.name}
                            </span>
                        </div>

                        {selectedLesson.content && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                                    المحتوى
                                </h3>
                                <div className="prose dark:prose-invert max-w-none">
                                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                        {selectedLesson.content}
                                    </p>
                                </div>
                            </div>
                        )}

                        {selectedLesson.videoUrl && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                                    🎥 الفيديو
                                </h3>
                                <a
                                    href={selectedLesson.videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    {selectedLesson.videoUrl}
                                </a>
                            </div>
                        )}

                        {selectedLesson.attachments && selectedLesson.attachments.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                                    📎 المرفقات
                                </h3>
                                <div className="space-y-2">
                                    {selectedLesson.attachments.map((url, index) => (
                                        <a
                                            key={index}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block p-3 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            <span className="text-blue-600 dark:text-blue-400 hover:underline">
                                                📄 {url.split('/').pop()}
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            المعلم: {selectedLesson.author?.name || selectedLesson.author?.email}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
