'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Users,
  MessageSquare,
  FileText,
  Search,
  Activity,
  Settings,
  Scale,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { AnimatedLines } from '@/components/AnimatedLines/AnimatedLines';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'suspended';
  joined: string;
}

const MOCK_USERS: AdminUser[] = [
  { id: '1', name: 'Priya Sharma', email: 'priya@example.com', role: 'user', status: 'active', joined: '2025-01-12' },
  { id: '2', name: 'Rahul Mehta', email: 'rahul@example.com', role: 'user', status: 'active', joined: '2025-02-03' },
  { id: '3', name: 'Ananya Patel', email: 'ananya@example.com', role: 'admin', status: 'active', joined: '2024-11-20' },
  { id: '4', name: 'Vikram Singh', email: 'vikram@example.com', role: 'user', status: 'suspended', joined: '2025-03-15' },
  { id: '5', name: 'Sita Gurung', email: 'sita@example.com', role: 'user', status: 'active', joined: '2025-04-01' },
];

const MOCK_ACTIVITY = [
  { action: 'User registered', target: 'Sita Gurung', time: '2 minutes ago' },
  { action: 'Document uploaded', target: 'employment_contract.pdf', time: '18 minutes ago' },
  { action: 'Search performed', target: 'grounds for divorce', time: '32 minutes ago' },
  { action: 'User suspended', target: 'Vikram Singh', time: '1 hour ago' },
  { action: 'New conversation', target: 'Rahul Mehta', time: '2 hours ago' },
];

const STATS = [
  { label: 'Total Users', value: '2,540', change: '+12%', icon: Users },
  { label: 'Conversations', value: '18,240', change: '+8%', icon: MessageSquare },
  { label: 'Documents', value: '1,204', change: '+5%', icon: FileText },
  { label: 'Queries/Searches', value: '32,780', change: '+21%', icon: Search },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'moderation'>('overview');
  const [users, setUsers] = useState<AdminUser[]>(MOCK_USERS);

  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' }
          : u
      )
    );
  };

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
              <ShieldCheck className="w-4 h-4 text-white" />
              Admin Console
            </span>
            <h1 className="text-3xl md:text-4xl font-bold">Administration Dashboard</h1>
            <p className="text-gray-400 mt-2">Manage users, monitor activity, and moderate content.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400 glass rounded-xl px-4 py-3">
            <Activity className="w-4 h-4 text-white" />
            <span>System status:</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              All systems operational
            </span>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -3 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 glass rounded-2xl p-2 w-fit">
          {([
            ['overview', 'Overview', TrendingUp],
            ['users', 'Users', Users],
            ['moderation', 'Moderation', AlertTriangle],
          ] as const).map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === key
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-white" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {MOCK_ACTIVITY.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-white/40 mt-2 shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm text-white">
                        <span className="font-medium">{item.action}</span>
                      </div>
                      <div className="text-sm text-gray-500">{item.target}</div>
                    </div>
                    <span className="text-xs text-gray-600 shrink-0">{item.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Moderation Queue */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-white" />
                Moderation Queue
              </h3>
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5">
                    <div>
                      <div className="text-sm text-white font-medium">Flagged response #{i + 1}</div>
                      <div className="text-xs text-gray-500">Reported for low confidence answer</div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 rounded-lg bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 hover:bg-emerald-400/20">
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-red-400/10 border border-red-400/20 text-red-400 hover:bg-red-400/20">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Users */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-white" />
                Registered Users
              </h3>
              <span className="text-sm text-gray-500">{users.length} total</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-white/5">
                    <th className="px-6 py-4 font-medium">User</th>
                    <th className="px-6 py-4 font-medium">Role</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Joined</th>
                    <th className="px-6 py-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-xs font-bold">
                            {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <div className="text-white font-medium">{user.name}</div>
                            <div className="text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border border-white/10 bg-white/5 text-gray-300">
                          {user.role === 'admin' ? <Scale className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${
                          user.status === 'active'
                            ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20'
                            : 'bg-red-400/10 text-red-400 border border-red-400/20'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{user.joined}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                            user.status === 'active'
                              ? 'border-red-400/20 text-red-400 hover:bg-red-400/10'
                              : 'border-emerald-400/20 text-emerald-400 hover:bg-emerald-400/10'
                          }`}
                        >
                          {user.status === 'active' ? 'Suspend' : 'Reactivate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Moderation */}
        {activeTab === 'moderation' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-8 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-4">
              <Settings className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Content Moderation</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Review flagged AI responses, user reports, and enforce community
              guidelines from this panel.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
