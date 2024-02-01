import Image from "next/image";
import { Card, CardHeader, CardFooter, Chip } from "@nextui-org/react";

interface IGameCard {
    title: string;
    tags: string[];
    id: string;
}

export default ({ title, tags, id }: IGameCard) => {
    return (
        <Card className="col-span-12 sm:col-span-4 h-52">
            <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                <p className="text-tiny text-white/60 uppercase font-bold">
                    What to watch
                </p>
                <h4 className="text-white font-medium text-large">{title}</h4>
            </CardHeader>
            <div className="relative h-full">
                <Image
                    width={100}
                    height={100}
                    alt={title}
                    className="z-0 w-full h-full object-cover"
                    src={`/images/bg_${id}.jpg`}
                />
                <div className="absolute inset-0 bg-black opacity-50"></div>
            </div>
            <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
                <ul className="flex space-x-2">
                    {tags.map((tag) => {
                        return (
                            <li>
                                <Chip color="primary" size="sm">
                                    {tag}
                                </Chip>
                            </li>
                        );
                    })}
                </ul>
            </CardFooter>
        </Card>
    );
};
