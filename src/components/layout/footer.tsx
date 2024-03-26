import { Join } from "../join";
import { selectPlayer } from "@/app/redux/playerSlice";
import { useAppSelector } from "@/app/redux/hook";
import { motion, AnimatePresence } from "framer-motion";

export const Footer = () => {
    const player = useAppSelector(selectPlayer);
    console.log(player);
    return (
        <AnimatePresence>
            <motion.div
                layout
                className="sticky bottom-0 w-full p-6 pt-4 backdrop-blur z-10"
            >
                {!player.id && <Join />}
            </motion.div>
        </AnimatePresence>
    );
};
