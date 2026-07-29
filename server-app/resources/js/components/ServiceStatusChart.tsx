import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

interface ServiceStatus {
    slug: string;
    label: string;
    count: number;
    color: string;
}

interface Props {
    services: ServiceStatus[];
}

export default function ServiceStatusChart({ services }: Props) {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <PieChart>
                <Pie
                    data={services}
                    dataKey="count"
                    nameKey="label"
                    innerRadius={70}
                    outerRadius={120}
                    paddingAngle={3}
                >
                    {services.map((item) => (
                        <Cell
                            key={item.slug}
                            fill={item.color}
                        />
                    ))}
                </Pie>

                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
}
