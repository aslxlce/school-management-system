import React from "react";

const subjects = [
    "Arts",
    "Ordinateur",
    "Français",
    "Histoire",
    "Maths",
    "Musique",
    "Science",
    "Sciences sociales",
    "Éducation physique",
];

const BulletinScolaire = () => {
    return (
        <div className="max-w-4xl mx-auto p-8 border-2 border-[#d3d3f3]">
            <header className="text-center mb-8">
                <h1 className="text-3xl font-bold text-[#1b2c4c]">RESULTS</h1>
                <p className="text-sm mt-2">AuroraCampus</p>
            </header>

            <div className="grid grid-cols-2 gap-6 text-sm mb-6">
                <div>
                    <p>
                        <strong>NAME :</strong> ______________________________________
                    </p>
                    <p>
                        <strong>SUVERPISOR :</strong> ______________________________
                    </p>
                </div>
                <div>
                    <p>
                        <strong>YEAR :</strong> _____________________________
                    </p>
                    <p>
                        <strong>PERIOD :</strong> __________________
                    </p>
                </div>
            </div>

            <table className="w-full border-collapse text-sm mb-6">
                <thead>
                    <tr className="bg-[#1b2c4c] text-white">
                        <th className="p-2 border">SUBJECT</th>
                        <th className="p-2 border">NOTE</th>
                        <th className="p-2 border">COMMENT</th>
                    </tr>
                </thead>
                <tbody>
                    {subjects.map((subject, idx) => (
                        <tr key={idx} className="text-center">
                            <td className="p-2 border">{subject}</td>
                            <td className="p-2 border"></td>
                            <td className="p-2 border"></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="grid grid-cols-2 gap-6 text-sm">
                {/* <div>
                    <p className="font-semibold mb-2">ÉCHELLE DE NOTATION :</p>
                    <ul className="list-none space-y-1">
                        <li>A+ = 96 - 100</li>
                        <li>A = 91 - 95</li>
                        <li>B+ = 86 - 90</li>
                        <li>B = 81 - 85</li>
                        <li>C = 76 - 80</li>
                        <li>D = 75 - 70</li>
                        <li>Échec = 69 et moins</li>
                    </ul>
                </div> */}

                <div>
                    <p className="font-semibold mb-2">TOTAL DE JOURNÉES D’ÉCOLE :</p>
                    <p>Jours de présence : ____________________</p>
                    <p>Jours d’absence : ____________________</p>
                </div>
            </div>
        </div>
    );
};

export default BulletinScolaire;
