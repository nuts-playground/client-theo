import Image from "next/image";

export default ({
    title,
    tags,
    id,
}: {
    title: String;
    tags: String[];
    id: string;
}) => {
    return (
        <div
            className={`relative h-48 border rounded-xl border-gray-400 overflow-hidden`}
        >
            <Image
                className="absolute inset-0 w-full h-full"
                src={`/images/bg_${id}.jpg`}
                alt="title"
                width={100}
                height={100}
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-[rgba(0,0,0,0.4)]">
                <h3 className="mb-1 text-2xl font-bold text-white">{title}</h3>
                <ul className="flex space-x-2">
                    {tags.map((tag, index) => {
                        return (
                            <li
                                className="px-2 text-sm rounded-xl border border-gray-100 text-white"
                                key={index}
                            >
                                {tag}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};
