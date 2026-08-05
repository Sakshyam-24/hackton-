'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Users,
  MessageSquare,
  Clock,
  Zap,
  Languages,
  FileSearch,
  PieChart,
  Calendar,
} from 'lucide-react';
import { AnimatedLines } from '@/components/AnimatedLines/AnimatedLines';

const WEEKLY = [
  { day: 'Mon', chats: 320, docs: 45, search: 180 },
  { day: 'Tue', chats: 380, docs: 52, search: 210 },
  { day: 'Wed', chats: 350, docs: 48, search: 195 },
  { day: 'Thu', chats: 460, docs: 61, search: 240 },
  { day: 'Fri', chats: 520, docs: 70, search: 275 },
  { day: 'Sat', chats: 410, docs: 38, search: 160 },
  { day: 'Sun', chats: 300, docs: 25, search: 120 },
];

const CATEGORIES = [
  { label: 'Constitutional Law', value: 32, color: 'bg-white' },
  { label: 'Family Law', value: 24, color: 'bg-gray-300' },
  { label: 'Criminal Law', value: 18, color: 'bg-gray-400' },
  { label: 'Property Law', value: 14, color: 'bg-gray-500' },
  { label: 'Others', value: 12, color: 'bg-gray-600' },
];

const LANGUAGES = [
  { label: 'English', value: 78 },
  { label: 'Nepali', value: 22 },
];

const INSIGHTS = [
  { icon: Clock, label: 'Avg. Response Time', value: '1.8s', change: '-0.3s', good: true },
  { icon: Zap, label: 'Confidence Avg', value: '92%', change: '+4%', good: true },
  { icon: Languages, label: 'Nepali Queries', value: '22%', change: '+9%', good: true },
  { icon: FileSearch, label: 'RAG Hit Rate', value: '87%', change: '+6%', good: true },
];

function BarChart() {
  const max = Math.max(...WEEKLY.map((d) => Math.max(d.chats, d.docs, d.search)));
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-white" />
          Usage Over the Week
        </h3>
        <span className="text-sm text-gray-500 flex items-center gap-4">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-white" />Chats</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-gray-400" />Documents</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-gray-600" />Searches</span>
        </span>
      </div>
      <div className="flex items-end justify-between gap-3 h-52">
        {WEEKLY.map((d) => (
          <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
            <div className="flex items-end gap-1 w-full h-40">
              <div className="flex-1 flex flex-col justify-end items-center gap-0.5 h-full">
                <div
                  className="w-full max-w-[14px] rounded-t bg-white/90"
                  style={{ height: `${(d.chats / max) * 100}%` }}
                  title={`${d.chats} chats`}
                />
              </div>
              <div className="flex-1 flex flex-col justify-end items-center gap-0.5 h-full">
                <div
                  className="w-full max-w-[14px] rounded-t bg-gray-400/70"
                  style={{ height: `${(d.docs / max) * 100}%` }}
                  title={`${d.docs} docs`}
                />
              </div>
              <div className="flex-1 flex flex-col justify-end items-center gap-0.5 h-full">
                <div
                  className="w-full max-w-[14px] rounded-t bg-gray-600/70"
                  style={{ height: `${(d.search / max) * 100}%` }}
                  title={`${d.search} searches`}
                />
              </div>
            </div>
            <span className="text-xs text-gray-500">{d.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('7d');
  const totalChats = WEEKLY.reduce((s, d) => s + d.chats, 0);

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 relative overflow-hidden">
      <AnimatedLines opacity={0.25} density={0.5} className="z-0" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10"
        >
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm font-semibold mb-4">
              <BarChart3 className="w-4 h-4 text-white" />
              Analytics
            </span>
            <h1 className="text-3xl md:text-4xl font-bold">Platform Insights</h1>
            <p className="text-gray-400 mt-2">Track usage, engagement, and AI performance metrics.</p>
          </div>
          <div className="flex items-center gap-2 glass rounded-2xl p-2 w-fit">
            {(['7d', '30d', '90d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  range === r ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Insights */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {INSIGHTS.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -3 }}
              className="glass rounded-2xl p-6"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold">{item.value}</div>
              <div className="text-sm text-gray-500 mt-1">{item.label}</div>
              <span className={`inline-flex items-center gap-1 text-xs mt-2 ${item.good ? 'text-emerald-400' : 'text-red-400'}`}>
                <TrendingUp className="w-3 h-3" />
                {item.change}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Main chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-6 lg:col-span-2"
          >
            <BarChart />
          </motion.div>

          {/* Category breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
              <PieChart className="w-5 h-5 text-white" />
              Query Categories
            </h3>
            <div className="space-y-5">
              {CATEGORIES.map((cat) => (
                <div key={cat.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-300">{cat.label}</span>
                    <span className="text-gray-500 font-medium">{cat.value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.value}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className={`h-full rounded-full ${cat.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h4 className="text-sm font-semibold text-gray-300 mb-4">Language Split</h4>
              <div className="flex h-8 rounded-full overflow-hidden border border-white/10">
                {LANGUAGES.map((lang, i) => (
                  <div
                    key={lang.label}
                    className={`${i === 0 ? 'bg-white/80' : 'bg-gray-500/60'} flex items-center justify-center text-[11px] font-semibold`}
                    style={{ width: `${lang.value}%` }}
                  >
                    {lang.value}%
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>English</span>
                <span>Nepali</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mini stat row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Users, label: 'Active Users', value: '1,280' },
            { icon: MessageSquare, label: `Chats (${range})`, value: totalChats.toLocaleString() },
            { icon: Zap, label: 'Avg Confidence', value: '91.6%' },
            { icon: Calendar, label: 'Days Tracked', value: '90' },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + index * 0.06 }}
              className="glass rounded-2xl p-5 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold">{item.value}</div>
                <div className="text-xs text-gray-500">{item.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
