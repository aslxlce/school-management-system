// // action/client/events.ts
// import axiosConfig from "./axiosConfig";

// export async function fetchEvents(): Promise<IEvent[]> {
//     const { data } = await axiosConfig.get<IEvent[]>("/events");
//     return data;
// }

// export async function createEvent(event: Omit<IEvent, "id">): Promise<IEvent> {
//     const { data } = await axiosConfig.post<IEvent>("/events", event);
//     return data;
// }

// action/client/events.ts
import axiosConfig from "./axiosConfig";
import axios, { AxiosError } from "axios";

export interface PaginatedEvents {
    events: IEvent[];
    total: number;
    page: number;
    limit: number;
}

// Accept payload without `id` or `createdBy`—server injects `createdBy`
export async function createEvent(event: Omit<IEvent, "id" | "createdBy">): Promise<IEvent> {
    try {
        const response = await axiosConfig.post<IEvent>("/events", event);
        return response.data;
    } catch (error: unknown) {
        let message = "Failed to create event";

        if (axios.isAxiosError(error)) {
            const axiosErr = error as AxiosError<unknown>;
            if (
                axiosErr.response?.data &&
                typeof axiosErr.response.data === "object" &&
                "error" in axiosErr.response.data &&
                typeof (axiosErr.response.data as Record<string, unknown>).error === "string"
            ) {
                message = (axiosErr.response.data as Record<string, string>).error;
            } else if (axiosErr.message) {
                message = axiosErr.message;
            }
        } else if (error instanceof Error) {
            message = error.message;
        }

        throw new Error(message);
    }
}
