import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md p-8 text-center bg-gray-800 rounded-2xl shadow-2xl"
      >
        <h1 className="text-4xl font-extrabold mb-4 text-teal-400">
          Faizur Rahman
        </h1>
        <p className="text-lg text-gray-300 leading-relaxed">
          Heyo! <span className="text-xl">😊</span> I'm a{" "}
          <span className="text-teal-300 font-semibold">Full-Stack Developer</span>, Web 3 Enthusiast, AI Art Creator & more.  
        </p>
        <p className="text-gray-400 mt-3">
          Passionate about coding, problem-solving & building cool things on the web.
        </p>
      </motion.div>
    </div>
  );
}
