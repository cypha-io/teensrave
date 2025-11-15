"use client";

import { motion } from "framer-motion";
import Hero3D from "../components/Hero3D";
import HeroCard from "@/components/HeroCard";
import WhoWeAre from "@/components/WhoWeAre";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      {/* <Hero3D /> */}
      <HeroCard />
      {/* Who We Are Section */}
      <WhoWeAre />
    </div>
  );
}
