"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Join } from "./join";

export const Footer = () => {
    return (
        <AnimatePresence>
            <motion.div className="sticky bottom-0 w-full p-6 pt-4 backdrop-blur z-10">
                <Join />
            </motion.div>
        </AnimatePresence>
    );
};
