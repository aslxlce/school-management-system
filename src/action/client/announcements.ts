// src/action/client/announcement.ts

import axiosConfig from "./axiosConfig";

export async function fetchAnnouncementsClient(page = 1, limit = 10) {
    const { data } = await axiosConfig.get<PaginatedAnnouncements>(
        `/announcements?page=${page}&limit=${limit}`
    );
    return data;
}

export async function createAnnouncement(data: Omit<AnnouncementRow, "_id">): Promise<void> {
    await axiosConfig.post("/announcements", data);
}
