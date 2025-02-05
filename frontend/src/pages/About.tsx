import { motion } from "framer-motion";
import { FiGithub } from "react-icons/fi";

export default function About() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-2xl w-full p-8 text-center bg-gray-800/50 rounded-2xl shadow-2xl backdrop-blur-lg border border-gray-700"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mb-8"
        >
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
            Faizur Rahman
          </h1>
          <div className="flex justify-center space-x-4 mb-6">
            <motion.a
              href="https://github.com/rahmanfaizur"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
              aria-label="GitHub Profile"
            >
              <FiGithub className="text-2xl" />
            </motion.a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <p className="text-xl text-gray-300 leading-relaxed">
            Hey there! <span className="text-2xl">👋</span> I'm a passionate{" "}
            <span className="font-semibold bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
              Full-Stack Developer
            </span>{" "}
            with expertise in modern web technologies.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <motion.div
              whileHover={{ y: -2 }}
              className="px-4 py-2 bg-gray-700/50 rounded-full flex items-center"
            >
              <span className="text-teal-400 mr-2">🚀</span>
              Web 3.0 Enthusiast
            </motion.div>
            <motion.div
              whileHover={{ y: -2 }}
              className="px-4 py-2 bg-gray-700/50 rounded-full flex items-center"
            >
              <span className="text-cyan-400 mr-2">🎨</span>
              AI Art Creator
            </motion.div>
            <motion.div
              whileHover={{ y: -2 }}
              className="px-4 py-2 bg-gray-700/50 rounded-full flex items-center"
            >
              <span className="text-purple-400 mr-2">💡</span>
              Problem Solver
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}