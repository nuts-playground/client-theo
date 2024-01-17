import Link from "next/link";

export const Nav = () => {
    return (
        <nav>
            <ul className="flex">
                <li className="text-2xl font-bold hover:underline">
                    <Link href="/">HOME</Link>
                </li>
            </ul>
        </nav>
    );
};
