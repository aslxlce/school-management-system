// src/types/announcement.d.ts

declare interface AnnouncementRow<DATE = string> {
    _id: string;
    title: string;
    date: DATE;
    description: string;
}

declare interface PaginatedAnnouncements {
    data: AnnouncementRow[];
    page: number;
    total: number;
    totalPages: number;
}
