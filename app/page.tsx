"use client";

import { motion } from "framer-motion";
import Hero3D from "../components/Hero3D";
import HeroCard from "@/components/homepage/HeroCard";
import WhoWeAre from "@/components/homepage/WhoWeAre";
import Countdown from "@/components/homepage/Countdown";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      {/* <Hero3D /> */}
      <HeroCard />
      {/* Who We Are Section */}
      <WhoWeAre />
      <Countdown />
    </div>
  );
}
