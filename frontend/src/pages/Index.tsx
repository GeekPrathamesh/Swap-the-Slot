import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-6 text-center">
      {/* Floating gradient accents */}
      <motion.div
        className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-200 blur-3xl opacity-30"
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-indigo-200 blur-3xl opacity-30"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main card */}
      <motion.div
        className="z-10 flex max-w-2xl flex-col items-center justify-center space-y-6 rounded-2xl bg-white/70 p-10 shadow-xl backdrop-blur-sm"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Logo + Title */}
        <motion.div
          className="flex items-center justify-center gap-3"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md">
            <span className="text-xl font-semibold text-white">S</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
            SlotSwapper
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="max-w-md text-lg text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Simplify your schedule — easily <strong>swap</strong>, <strong>manage</strong>, and{" "}
          <strong>coordinate</strong> your time slots with peers in one place.
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="flex flex-col gap-3 sm:flex-row sm:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link to="/login">
            <Button
              size="lg"
              className="w-40 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transition-transform hover:scale-105 hover:shadow-xl"
            >
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button
              variant="outline"
              size="lg"
              className="w-40 border-2 border-indigo-500 text-indigo-600 transition-transform hover:bg-indigo-50 hover:scale-105"
            >
              Sign Up
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Footer text */}
      <motion.p
        className="mt-10 text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Built for students and professionals — Manage time the smart way.
      </motion.p>
    </div>
  );
};

export default Index;
