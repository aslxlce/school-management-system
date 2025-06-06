export const gradeLessonMap: Record<string, string[]> = {
    "1": ["Math", "Physics", "Science", "Arabe", "History", "Geography"],
    "2": ["Math", "Physics", "Science", "Arabe", "History", "Geography"],
    "3": ["Math", "Physics", "Science", "Arabe", "History", "Geography"],
    "4": ["Math", "Physics", "Science", "Arabe", "History", "Geography"],
    "5": ["Math", "Physics", "Science", "Arabe", "History", "Geography"],
    "6": ["Math", "Physics", "Science", "Arabe", "History", "Geography", "English", "Biology"],
    "7": ["Math", "Physics", "Science", "Arabe", "History", "Geography", "English", "Biology"],
    "8": ["Math", "Physics", "Science", "Arabe", "History", "Geography", "English", "Biology"],
    "9": ["Math", "Physics", "Science", "Arabe", "History", "Geography", "English", "Biology"],
    "10S": ["Math", "Physics", "Science", "Arabe", "History", "Geography", "English", "Biology"],
    "11S": ["Math", "Physics", "Science", "Arabe", "History", "Geography", "English", "Biology"],
    "11M": ["Math", "Physics", "Science", "Arabe", "History", "Geography", "English", "Biology"],
    "11Mt": ["Math", "Physics", "Arabe", "History", "Geography", "English"],
    "12S": ["Math", "Physics", "Science", "Arabe", "History", "Geography", "English", "Biology"],
    "12M": ["Math", "Physics", "Science", "Arabe", "History", "Geography", "English", "Biology"],
    "12Mt": ["Math", "Physics", "Arabe", "History", "Geography", "English"],
};

export const gradeOptions = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10S",
    "11S",
    "11M",
    "11Mt",
    "12S",
    "12M",
    "12Mt",
];

export const subjects = [
    "Math",
    "Physics",
    "Science",
    "Arabe",
    "History",
    "Geography",
    "English",
    "Biology",
] as const;

export function getGradeLevelFromGrade(grade: string): "primary" | "middle" | "high" {
    const numericGrade = parseInt(grade);

    if (!isNaN(numericGrade)) {
        if (numericGrade >= 1 && numericGrade <= 5) return "primary";
        if (numericGrade >= 6 && numericGrade <= 9) return "middle";
    }

    return "high";
}
