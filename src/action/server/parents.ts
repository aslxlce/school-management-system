// action/server/parents.ts

import dbConnect from "@/lib/dbConnection";
import { ParentModel, StudentModel } from "@/models/User";

export interface IParentWithChildren {
    id: string;
    username: string;
    name: string;
    surname: string;
    email?: string;
    phone?: string;
    address?: string;
    children: string[]; // array of “Child Name Surname”
}

/**
 * Fetches a paginated list of parents, each with their children’s full names.
 * @param page 1-based page number
 * @param limit number of parents per page
 * @returns { data: IParentWithChildren[]; totalPages: number }
 */
export const fetchParents = async (
    page: number,
    limit: number
): Promise<{ data: IParentWithChildren[]; totalPages: number }> => {
    await dbConnect();

    const skip = (page - 1) * limit;

    // 1) Fetch parents for this page and the total count
    const [parentsRaw, count] = await Promise.all([
        ParentModel.find().skip(skip).limit(limit).lean(),
        ParentModel.countDocuments(),
    ]);

    // 2) Collect all childrenIds across these parents
    const allChildIds = parentsRaw.flatMap((p) =>
        Array.isArray(p.childrenIds) ? p.childrenIds.map((oid) => String(oid)) : []
    );

    // 3) Fetch student documents for those IDs to get name + surname
    const studentDocs =
        allChildIds.length > 0
            ? await StudentModel.find({ _id: { $in: allChildIds } })
                  .select("name surname")
                  .lean()
            : [];

    // 4) Build a lookup map: studentId -> "Name Surname"
    const studentMap = studentDocs.reduce<Record<string, string>>((acc, s) => {
        acc[String(s._id)] = `${s.name} ${s.surname}`;
        return acc;
    }, {});

    // 5) Map each parent to IParentWithChildren, replacing childrenIds with names
    const data: IParentWithChildren[] = parentsRaw.map((p) => {
        const rawIds: string[] = Array.isArray(p.childrenIds)
            ? p.childrenIds.map((oid) => String(oid))
            : [];

        const childrenNames: string[] = rawIds
            .map((cid) => studentMap[cid])
            .filter((fullName): fullName is string => typeof fullName === "string");

        return {
            id: String(p._id),
            username: p.username,
            name: p.name,
            surname: p.surname,
            email: p.email,
            phone: p.phone,
            address: p.address,
            children: childrenNames,
        };
    });

    const totalPages = Math.ceil(count / limit);

    return { data, totalPages };
};
