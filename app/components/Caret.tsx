import { memo } from "react";

interface CaretComponentProps {
    color: string;
    name: string;
}

export const CaretComponent = memo(({ color, name }: CaretComponentProps) => {
    const player=name.split('').map((w)=>w[0]);
    return (
        <>
            <span
                className={`absolute w-0.6 h-10 ${color} rounded animate-pulse`}
                style={{ transform: 'translateY(0.3em)' }}
            ></span>
            <span className="text-tb-grey text-xs absolute" style={{ transform: 'translateY(-0.7em)' }}>{player}</span>
        </>
    );
});
