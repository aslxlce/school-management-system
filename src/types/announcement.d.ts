// // src/types/announcement.d.ts

// declare interface AnnouncementRow<DATE = string> {
//     _id: string;
//     title: string;
//     date: DATE;
//     description: string;
// }

// declare interface PaginatedAnnouncements {
//     data: AnnouncementRow[];
//     page: number;
//     total: number;
//     totalPages: number;
// }

// src/types/announcement.d.ts

// Single announcement row
declare interface AnnouncementRow<DATE extends string | Date = string> {
    _id: string;
    title: string;
    date: DATE;
    description: string;
}

// Server returns pagination with DATE = string (default)
declare interface PaginatedAnnouncements {
    data: AnnouncementRow[]; // AnnouncementRow<string> by default
    page: number;
    total: number;
    totalPages: number;
}

// Optional helper: shape used when creating an announcement
// (you already use Omit<AnnouncementRow, "_id">, but this can be handy)
declare type AnnouncementPayload = Omit<AnnouncementRow, "_id">;
