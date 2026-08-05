'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { AnimatedLines } from '@/components/AnimatedLines/AnimatedLines';
import {
  Scale,
  MessageSquare,
  FileSearch,
  BookOpen,
  Shield,
  Search,
  Map,
  ArrowRight,
  Play,
  Star,
  Users,
  FileText,
  Zap,
  ChevronRight,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Sparkles,
  Brain,
  Landmark,
  Pause,
  Volume2,
  VolumeX,
} from 'lucide-react';

const features = [
  {
    icon: MessageSquare,
    title: 'AI Chat',
    description: 'Ask legal questions in plain language and get instant, intelligent responses powered by advanced AI.',
  },
  {
    icon: FileSearch,
    title: 'Document Analysis',
    description: 'Upload legal documents for AI-powered analysis, summarization, and key insight extraction.',
  },
  {
    icon: BookOpen,
    title: 'Legal Citations',
    description: 'Every response is backed by accurate citations from Nepal legal databases and statutes.',
  },
  {
    icon: Shield,
    title: 'Know Your Rights',
    description: 'Understand your fundamental rights with clear, accessible explanations of constitutional provisions.',
  },
  {
    icon: Map,
    title: 'Legal Roadmaps',
    description: 'Get step-by-step guidance through legal processes, from filing to resolution.',
  },
  {
    icon: Search,
    title: 'Smart Search',
    description: 'Search through comprehensive legal databases with natural language queries.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Ask Your Question',
    description: 'Type your legal question in plain language. Our AI understands context and nuance.',
    icon: MessageSquare,
  },
  {
    number: '02',
    title: 'Get AI-Powered Answer',
    description: 'Receive comprehensive, well-structured responses with relevant legal analysis.',
    icon: Brain,
  },
  {
    number: '03',
    title: 'Review Citations',
    description: 'Access verified legal citations, statutes, and precedents supporting the answer.',
    icon: Landmark,
  },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Legal Professional',
    content: 'Legal Advisor AI has revolutionized how I research case law. The citation accuracy is impressive, saving me hours of manual research.',
    rating: 5,
    avatar: 'PS',
  },
  {
    name: 'Rahul Mehta',
    role: 'Law Student',
    content: 'As a law student, this tool has been invaluable for understanding complex legal concepts. The explanations are clear and well-referenced.',
    rating: 5,
    avatar: 'RM',
  },
  {
    name: 'Ananya Patel',
    role: 'Small Business Owner',
    content: 'I used to spend thousands on legal consultations for basic queries. Legal Advisor AI gives me instant answers I can trust.',
    rating: 5,
    avatar: 'AP',
  },
];

const stats = [
  { label: 'Questions Answered', value: '10,000+', icon: MessageSquare },
  { label: 'Legal Sections', value: '500+', icon: FileText },
  { label: 'Active Users', value: '2,500+', icon: Users },
  { label: 'Accuracy Rate', value: '99%', icon: Zap },
];

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const totalSteps = 60;
      const increment = target / totalSteps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / totalSteps);
      return () => clearInterval(timer);
    }
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function HomePage() {
  const containerRef = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-black overflow-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 glass-strong"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <Scale className="h-8 w-8 text-white group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute -inset-1 bg-white/10 rounded-full blur group-hover:blur-md transition-all duration-300" />
              </div>
              <span className="text-xl font-bold text-white">
                Legal Advisor AI
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              <Link
                href="/about"
                className="px-4 py-2 text-gray-400 hover:text-white font-medium rounded-lg hover:bg-white/5 transition-all duration-200"
              >
                About
              </Link>
              <Link
                href="/disclaimer"
                className="px-4 py-2 text-gray-400 hover:text-white font-medium rounded-lg hover:bg-white/5 transition-all duration-200"
              >
                Disclaimer
              </Link>
              <div className="w-px h-6 bg-white/10 mx-2" />
              <Link
                href="/login"
                className="px-4 py-2 text-gray-300 hover:text-white font-medium rounded-lg hover:bg-white/5 transition-all duration-200"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="ml-2 px-5 py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </div>

            <button className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors">
              <div className="w-5 h-4 flex flex-col justify-between">
                <span className="w-full h-0.5 bg-white rounded-full" />
                <span className="w-full h-0.5 bg-white rounded-full" />
                <span className="w-full h-0.5 bg-white rounded-full" />
              </div>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section with Video Background */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          >
            <source src="/video/hero-bg.mp4" type="video/mp4" />
          </video>
          {/* Black overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
          {/* White animated line network */}
          <AnimatedLines opacity={0.65} density={1.1} className="z-[1]" />
          {/* Floating Elements */}
          <motion.div
            animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 left-[10%] opacity-10"
          >
            <Scale className="w-24 h-24 text-white" />
          </motion.div>
          <motion.div
            animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/3 right-[15%] opacity-10"
          >
            <BookOpen className="w-32 h-32 text-white" />
          </motion.div>
          <motion.div
            animate={{ y: [-5, 15, -5], rotate: [0, 10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-1/4 left-[20%] opacity-10"
          >
            <Landmark className="w-20 h-20 text-white" />
          </motion.div>
          <motion.div
            animate={{ y: [5, -15, 5] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-1/3 right-[10%] opacity-10"
          >
            <Shield className="w-28 h-28 text-white" />
          </motion.div>
        </div>

        {/* Video Controls */}
        <div className="absolute bottom-8 right-8 z-20 flex gap-2">
          <button
            onClick={toggleVideo}
            className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white hover:bg-white/20 transition-all"
            title={isVideoPlaying ? 'Pause' : 'Play'}
          >
            {isVideoPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button
            onClick={toggleMute}
            className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white hover:bg-white/20 transition-all"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>Powered by Advanced AI Technology</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[1.1] tracking-tight"
          >
            Legal Intelligence,{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-white via-gray-300 to-white bg-[length:200%_100%] bg-clip-text text-transparent animate-shine">
                Redefined
              </span>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 1.2, ease: 'easeOut' }}
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-white to-gray-400 rounded-full origin-left"
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10 text-balance leading-relaxed"
          >
            Experience the future of legal assistance. Our AI-powered platform delivers
            instant, accurate legal guidance with verified citations from Nepal law databases.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link
              href="/register"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-semibold text-lg rounded-xl overflow-hidden transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              <span className="relative z-10">Get Started Free</span>
              <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            <Link
              href="/chat"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-white font-semibold text-lg rounded-xl border-2 border-white/20 hover:border-white/40 hover:bg-white/5 transition-all duration-300"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                <Play className="w-4 h-4 ml-0.5" />
              </div>
              Try Demo
            </Link>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-wrap justify-center gap-8 md:gap-12"
          >
            {[
              { value: '10K+', label: 'Questions Answered' },
              { value: '500+', label: 'Legal Sections' },
              { value: '99%', label: 'Accuracy' },
            ].map((badge, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="text-2xl md:text-3xl font-bold text-white">
                  {badge.value}
                </div>
                <div className="text-sm text-gray-500 font-medium">{badge.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1"
          >
            <motion.div className="w-1.5 h-1.5 rounded-full bg-white/40" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32 bg-black relative overflow-hidden">
        <AnimatedLines opacity={0.3} density={0.6} className="z-0" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 md:mb-20"
          >
            <span className="inline-block px-4 py-1.5 bg-white/5 text-white text-sm font-semibold rounded-full mb-4 border border-white/10">
              Features
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Everything You Need for{' '}
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Legal Clarity
              </span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Our comprehensive suite of AI-powered tools makes understanding and navigating Nepal law accessible to everyone.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all duration-300 hover:shadow-xl cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="relative text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="relative text-gray-400 leading-relaxed">
                  {feature.description}
                </p>

                <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <ChevronRight className="w-5 h-5 text-white/50" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 md:py-32 bg-black relative overflow-hidden">
        <AnimatedLines opacity={0.35} density={0.7} className="z-0" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 md:mb-20"
          >
            <span className="inline-block px-4 py-1.5 bg-white/5 text-white text-sm font-semibold rounded-full mb-4 border border-white/10">
              How It Works
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Simple as{' '}
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                1-2-3
              </span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Get expert legal guidance in three effortless steps.
            </p>
          </motion.div>

          <div className="relative">
            <div className="hidden lg:block absolute top-24 left-[16.67%] right-[16.67%] h-px">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
                className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent origin-left"
              />
            </div>

            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="relative text-center"
                >
                  <div className="relative inline-flex mb-8">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="relative w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-xl"
                    >
                      <span className="text-2xl font-bold text-black">{step.number}</span>
                    </motion.div>
                    <div className="absolute -inset-2 bg-white/10 rounded-full animate-pulse-slow" />
                  </div>

                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white/5 border border-white/10 mb-4">
                    <step.icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed max-w-xs mx-auto">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 md:py-32 bg-black relative overflow-hidden">
        <AnimatedLines opacity={0.25} density={0.5} className="z-0" />
        <div
          className="absolute inset-0 opacity-5 z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Join a growing community of users who rely on Legal Advisor AI for their legal needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 rounded-2xl bg-white/[0.02] border border-white/5"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 mb-4">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  <AnimatedCounter
                    target={parseInt(stat.value.replace(/[^0-9]/g, ''))}
                    suffix={stat.value.includes('+') ? '+' : stat.value.includes('%') ? '%' : ''}
                  />
                </div>
                <div className="text-gray-500 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 md:py-32 bg-black relative overflow-hidden">
        <AnimatedLines opacity={0.3} density={0.6} className="z-0" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 md:mb-20"
          >
            <span className="inline-block px-4 py-1.5 bg-white/5 text-white text-sm font-semibold rounded-full mb-4 border border-white/10">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Loved by{' '}
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Legal Professionals
              </span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              See what our users have to say about their experience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="relative p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all duration-300 hover:shadow-xl"
              >
                <div className="absolute top-6 right-6 text-6xl text-white/5 font-serif leading-none">
                  &ldquo;
                </div>

                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-white text-white" />
                  ))}
                </div>

                <p className="text-gray-300 leading-relaxed mb-6 relative z-10">
                  {testimonial.content}
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-black font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 relative overflow-hidden bg-black">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)`,
          }}
        />
        <AnimatedLines opacity={0.4} density={0.8} className="z-0" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-8"
            >
              <Scale className="w-8 h-8 text-white" />
            </motion.div>

            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Legal Experience?
            </h2>
            <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
              Join thousands of users who are already benefiting from AI-powered legal assistance.
              Start your journey today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-semibold text-lg rounded-xl hover:bg-gray-200 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-white font-semibold text-lg rounded-xl border-2 border-white/20 hover:border-white/40 hover:bg-white/5 transition-all duration-300"
              >
                Learn More
              </Link>
            </div>

            <p className="mt-8 text-gray-500 text-sm">
              No credit card required. Free to start.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/5 text-gray-400 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <Scale className="h-8 w-8 text-white" />
                <span className="text-xl font-bold text-white">Legal Advisor AI</span>
              </Link>
              <p className="text-gray-500 mb-6 max-w-sm">
                Empowering individuals with AI-driven legal intelligence. Making Nepal law accessible, understandable, and actionable.
              </p>
              <div className="flex gap-4">
                {[
                  { icon: Twitter, href: '#', label: 'Twitter' },
                  { icon: Linkedin, href: '#', label: 'LinkedIn' },
                  { icon: Github, href: '#', label: 'GitHub' },
                  { icon: Mail, href: 'mailto:support@legaladvisor.ai', label: 'Email' },
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-3">
                {[
                  { label: 'AI Chat', href: '/chat' },
                  { label: 'History', href: '/history' },
                  { label: 'About', href: '/about' },
                  { label: 'Pricing', href: '/pricing' },
                ].map((link, i) => (
                  <li key={i}>
                    <Link href={link.href} className="text-gray-500 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-3">
                {[
                  { label: 'Disclaimer', href: '/disclaimer' },
                  { label: 'Privacy Policy', href: '/privacy' },
                  { label: 'Terms of Service', href: '/terms' },
                  { label: 'Cookie Policy', href: '/cookies' },
                ].map((link, i) => (
                  <li key={i}>
                    <Link href={link.href} className="text-gray-500 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-3">
                {[
                  { label: 'Help Center', href: '/help' },
                  { label: 'Contact Us', href: '/contact' },
                  { label: 'FAQ', href: '/faq' },
                  { label: 'Status', href: '/status' },
                ].map((link, i) => (
                  <li key={i}>
                    <Link href={link.href} className="text-gray-500 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              &copy; {new Date().getFullYear()} Legal Advisor AI. All rights reserved.
            </p>
            <p className="text-gray-700 text-xs">
              Built with AI for the legal community
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
