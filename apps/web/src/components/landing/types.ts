export type StatCardProps = {
    icon: React.ReactNode;
    value: number;
    label: string;
    suffix?: string;
    color: string;
};

export type FeatureCardProps = {
    icon: React.ReactNode;
    title: string;
    description: string;
    gradient: string;
    stats?: string;
    route?: string;
}