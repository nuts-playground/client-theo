import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
    size?: number;
};

export interface ProviderProps {
    children: React.ReactNode;
}

export interface Player {
    id: string;
    name: string;
    location: string;
}
