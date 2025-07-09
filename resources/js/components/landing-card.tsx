import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';

interface LandingCardProps {
    title: string;
    color: string;
    description: string;
    icon: React.ReactNode;
}

const colorClasses = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    red: 'bg-red-100',
    yellow: 'bg-yellow-100',
    purple: 'bg-purple-100',
    indigo: 'bg-indigo-100',
    pink: 'bg-pink-100',
    gray: 'bg-gray-100',
} as const;

export default function LandingCard({ title, description, color, icon }: LandingCardProps) {
    return (
        <Card className="border-0 p-3 shadow-md transition-shadow hover:shadow-lg">
            <CardHeader className="p-4">
                <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${colorClasses[color as keyof typeof colorClasses] || 'bg-gray-100'}`}
                >
                    {icon}
                </div>
                <CardTitle className="mb-1 text-xl font-bold">{title}</CardTitle>
                <CardDescription className="text-sm">{description}</CardDescription>
            </CardHeader>
        </Card>
    );
}
