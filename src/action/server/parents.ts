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
    childrenIds: string[];
    children: string[];
}

/**
 * @param page
 * @param limit
 * @returns { data: IParentWithChildren[]; totalPages: number }
 */
export const fetchParents = async (
    page: number,
    limit: number
): Promise<{ data: IParentWithChildren[]; totalPages: number }> => {
    await dbConnect();

    const skip = (page - 1) * limit;

    const [parentsRaw, count] = await Promise.all([
        ParentModel.find().skip(skip).limit(limit).lean(),
        ParentModel.countDocuments(),
    ]);

    const allChildIds: string[] = parentsRaw.flatMap((p) =>
        Array.isArray(p.childrenIds) ? p.childrenIds.map((oid) => String(oid)) : []
    );

    const studentDocs =
        allChildIds.length > 0
            ? await StudentModel.find({ _id: { $in: allChildIds } })
                  .select("name surname")
                  .lean()
            : [];

    const studentMap = studentDocs.reduce<Record<string, string>>((acc, s) => {
        acc[String(s._id)] = `${s.name} ${s.surname}`;
        return acc;
    }, {});

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
            childrenIds: rawIds,
            children: childrenNames,
        };
    });

    const totalPages = Math.ceil(count / limit);

    return { data, totalPages };
};
