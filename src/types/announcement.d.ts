// src/types/announcement.d.ts

/**
 * One announcement row as seen by the UI.
 */
declare interface AnnouncementRow<DATE = string> {
    _id: string;
    title: string;
    date: DATE; // ISO-formatted timestamp
    description: string;
}

/**
 * The envelope returned when you page through announcements:
 *  - `data` is the array of AnnouncementRow
 *  - `page` is the current page number
 *  - `total` is total record count
 *  - `totalPages` is ceil(total/limit)
 */
declare interface PaginatedAnnouncements {
    data: AnnouncementRow[];
    page: number;
    total: number;
    totalPages: number;
}
