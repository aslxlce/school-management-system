// src/types/assignment.d.ts

// Who gave the assignment
declare interface AssignmentTeacherInfo {
    id: string;
    name: string;
    surname: string;
}

// Main DTO used on the client (default DATE = string)
declare interface IAssignment<DATE extends string | Date = string> {
    id: string;
    title: string;
    description: string;
    dueDate: DATE; // ISO string on the wire
    classId: string;
    teacher: AssignmentTeacherInfo;
    createdAt: DATE; // ISO string on the wire
}

// Body sent from the client to /api/assignments
declare interface AssignmentCreateBody {
    title: string;
    description: string;
    // From <input type="date">, e.g. "2025-11-30"
    dueDate: string;
    classId: string;
}

// Internal server-side input for createAssignment (after adding teacherId)
declare interface CreateAssignmentInput extends AssignmentCreateBody {
    teacherId: string;
}
