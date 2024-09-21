"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "An interactive bar chart"



interface DashboardChartProps{
    chartData: any[]
}

const chartConfig = {
    views: {
        label: "Page Views",
    },
    server: {
        label: "server",
        color: "hsl(var(--chart-1))",
    },
    profile: {
        label: "profile",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

export function DashboardChart({
    chartData
}: DashboardChartProps) {
    const [activeChart, setActiveChart] =
        React.useState<keyof typeof chartConfig>("server")

    const total = React.useMemo(
        () => ({
            server: chartData.reduce((acc, curr) => acc + curr.server, 0),
            profile: chartData.reduce((acc, curr) => acc + curr.profile, 0),
        }),
        []
    )

    return (
        <Card>
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row dark:bg-[#323438] bg-[#F2F3F5]">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle>Bar Chart - Interactive</CardTitle>
                    <CardDescription>
                        Displays the number of newly created Profile or server
                    </CardDescription>
                </div>
                <div className="flex">
                    {["server", "profile"].map((key) => {
                        const chart = key as keyof typeof chartConfig
                        return (
                            <button
                                key={chart}
                                data-active={activeChart === chart}
                                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                                onClick={() => setActiveChart(chart)}
                            >
                                <span className="text-xs text-muted-foreground">
                                    {chartConfig[chart].label}
                                </span>
                                <span className="text-lg font-bold leading-none sm:text-3xl">
                                    {total[key as keyof typeof total].toLocaleString()}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6 dark:bg-[#323438] bg-[#F2F3F5]">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px]"
                                    nameKey="views"
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })
                                    }}
                                />
                            }
                        />
                        <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
