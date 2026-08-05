'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Scale, Users, BookOpen, Shield, Heart, ArrowRight } from 'lucide-react';
import Sidebar from '@/components/Sidebar/Sidebar';
import Navbar from '@/components/Navbar/Navbar';
import AnimatedLines from '@/components/AnimatedLines/AnimatedLines';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

const values = [
  {
    icon: Scale,
    title: 'Accuracy',
    description: 'We strive to provide accurate legal information backed by proper citations and references.',
  },
  {
    icon: Shield,
    title: 'Privacy',
    description: 'Your data is encrypted and secure. We never share your conversations with third parties.',
  },
  {
    icon: Users,
    title: 'Accessibility',
    description: 'Making legal information accessible to everyone, regardless of their background.',
  },
  {
    icon: Heart,
    title: 'Empathy',
    description: 'Understanding that legal issues can be stressful and providing compassionate assistance.',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export default function AboutPage() {
  const { user, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-black text-white">
      {isAuthenticated && <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col min-w-0">
        {isAuthenticated && <Navbar onMenuClick={() => setSidebarOpen(true)} user={user} />}

        <main className="flex-1 relative">
          <AnimatedLines opacity={0.35} />

          {/* Hero */}
          <section className="relative z-10 py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                    About Legal Advisor AI
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                  We&apos;re on a mission to make legal information accessible to everyone through
                  artificial intelligence.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Mission */}
          <section className="relative z-10 py-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold mb-6">
                    <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                      Our Mission
                    </span>
                  </h2>
                  <p className="text-gray-400 mb-4 leading-relaxed">
                    Legal Advisor AI was created to bridge the gap between complex legal systems
                    and the common person. We believe that everyone deserves access to legal
                    information and guidance.
                  </p>
                  <p className="text-gray-400 leading-relaxed">
                    Our AI-powered platform provides instant, accurate responses to legal questions,
                    backed by citations from Nepal legal databases including the Constitution,
                    Nepal Penal Code, and various acts.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm"
                >
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { value: '10K+', label: 'Questions Answered' },
                      { value: '5K+', label: 'Active Users' },
                      { value: '500+', label: 'Legal Sections' },
                      { value: '99%', label: 'Accuracy Rate' },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center">
                        <div className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                          {stat.value}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Values */}
          <section className="relative z-10 py-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-bold text-center mb-12"
              >
                <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Our Values
                </span>
              </motion.h2>
              <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid md:grid-cols-2 gap-6"
              >
                {values.map((value, index) => (
                  <motion.div
                    key={index}
                    variants={item}
                    whileHover={{ y: -4, borderColor: 'rgba(255,255,255,0.15)' }}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                        <value.icon className="h-5 w-5 text-gray-300" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {value.title}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{value.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* How It Works */}
          <section className="relative z-10 py-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-bold text-center mb-12"
              >
                <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  How Our AI Works
                </span>
              </motion.h2>
              <div className="space-y-6">
                {[
                  {
                    step: 1,
                    title: 'Natural Language Processing',
                    description:
                      "Our AI understands your questions in plain language. You don't need to know legal jargon to get help.",
                  },
                  {
                    step: 2,
                    title: 'Legal Database Search',
                    description:
                      'The AI searches through Nepal legal databases to find relevant sections, acts, and precedents.',
                  },
                  {
                    step: 3,
                    title: 'Citation-Backed Response',
                    description:
                      'You receive a comprehensive answer with proper legal citations, so you can verify the information yourself.',
                  },
                ].map((s, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                    className="flex items-start gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 text-white flex items-center justify-center font-bold flex-shrink-0 text-sm">
                      {s.step}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {s.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{s.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="relative z-10 py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 backdrop-blur-sm"
              >
                <h2 className="text-3xl font-bold text-white mb-4">
                  Ready to Get Legal Help?
                </h2>
                <p className="text-lg text-gray-400 mb-8">
                  Start your journey with AI-powered legal assistance today.
                </p>
                <Link
                  href={isAuthenticated ? '/chat' : '/register'}
                  className="inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-200 transition-colors"
                >
                  {isAuthenticated ? 'Start Chatting' : 'Get Started Free'}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
