"use client";

import Image from "next/image";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

interface CountChartProps {
    boys: number;
    girls: number;
}

const CountChart = ({ boys, girls }: CountChartProps) => {
    const total = boys + girls;

    const boyPercent = total > 0 ? Math.round((boys / total) * 100) : 0;
    const girlPercent = total > 0 ? Math.round((girls / total) * 100) : 0;

    const data = [
        {
            name: "Total",
            count: total,
            fill: "white",
        },
        {
            name: "Girls",
            count: girls,
            fill: "#fae27c",
        },
        {
            name: "Boys",
            count: boys,
            fill: "#c3ebfa",
        },
    ];

    return (
        <div className="bg-white rounded-xl w-full h-full p-4">
            {/* Title */}
            <div className="flex justify-between items-center ">
                <h1 className="text-lg font-semibold">Students</h1>
                <Image
                    src="/moreDark.png"
                    alt=""
                    width={20}
                    height={20}
                    className="cursor-pointer"
                />
            </div>

            {/* Chart */}
            <div className="relative w-full h-[75%]">
                <ResponsiveContainer>
                    <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="40%"
                        outerRadius="100%"
                        barSize={32}
                        data={data}
                    >
                        <RadialBar background dataKey="count" />
                    </RadialBarChart>
                </ResponsiveContainer>
                <Image
                    src="/maleFemale.png"
                    alt=""
                    width={50}
                    height={50}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                />
            </div>

            {/* Bottom legend */}
            <div className="flex justify-center gap-16">
                <div className="flex flex-col gap-1">
                    <div className="w-5 h-5 bg-[var(--sky-color)] rounded-full" />
                    <h1 className="font-bold">{boys.toLocaleString()}</h1>
                    <h2 className="text-xs text-gray-400">Boys ({boyPercent}%)</h2>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="w-5 h-5 bg-[var(--yelloww-color)] rounded-full" />
                    <h1 className="font-bold">{girls.toLocaleString()}</h1>
                    <h2 className="text-xs text-gray-400">Girls ({girlPercent}%)</h2>
                </div>
            </div>
        </div>
    );
};

export default CountChart;
