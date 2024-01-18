import Link from "next/link";

export const Nav = () => {
    return (
        <nav>
            <ul className="flex">
                <li className="text-lg hover:underline">
                    <Link href="/about">ABOUT</Link>
                </li>
            </ul>
        </nav>
    );
};
