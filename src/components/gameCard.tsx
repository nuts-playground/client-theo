export default ({ title, tags }: { title: String; tags: String[] }) => {
    return (
        <div className="flex flex-col justify-end h-48 p-4 border rounded-xl border-gray-400 bg-gray-100">
            <h3 className="mb-1 text-2xl font-bold">{title}</h3>
            <ul className="flex space-x-2">
                {tags.map((tag, index) => {
                    return (
                        <li
                            className="px-2 text-sm rounded-xl border border-gray-400"
                            key={index}
                        >
                            {tag}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
