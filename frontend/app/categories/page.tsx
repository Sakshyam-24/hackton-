'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Scale,
  Users,
  Briefcase,
  Shield,
  FileText,
  Home,
  Car,
  Heart,
  Building,
  Gavel,
  Search,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const categories = [
  {
    id: 'constitutional',
    icon: Shield,
    title: 'Constitutional Law',
    description: 'Fundamental rights, duties, and constitutional provisions of India.',
    color: 'from-blue-500 to-cyan-400',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    questions: ['What are my fundamental rights?', 'Can fundamental rights be suspended?'],
  },
  {
    id: 'criminal',
    icon: Gavel,
    title: 'Criminal Law',
    description: 'IPC, CrPC, and criminal procedures in India.',
    color: 'from-red-500 to-rose-400',
    bgColor: 'bg-red-50',
    textColor: 'text-red-600',
    questions: ['What is Section 302 IPC?', 'How does bail work?'],
  },
  {
    id: 'family',
    icon: Heart,
    title: 'Family Law',
    description: 'Marriage, divorce, child custody, and maintenance.',
    color: 'from-pink-500 to-rose-400',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-600',
    questions: ['Grounds for divorce', 'Child custody laws'],
  },
  {
    id: 'property',
    icon: Home,
    title: 'Property Law',
    description: 'Transfer of property, tenancy rights, and real estate regulations.',
    color: 'from-amber-500 to-orange-400',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-600',
    questions: ['Tenant rights in India', 'How to transfer property?'],
  },
  {
    id: 'corporate',
    icon: Briefcase,
    title: 'Corporate Law',
    description: 'Company formation, compliance, and business regulations.',
    color: 'from-purple-500 to-violet-400',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    questions: ['How to register a company?', 'What is GST compliance?'],
  },
  {
    id: 'labor',
    icon: Users,
    title: 'Labor Law',
    description: 'Employment rights, workplace safety, and labor regulations.',
    color: 'from-emerald-500 to-teal-400',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    questions: ['Minimum wage laws', 'Workplace harassment laws'],
  },
  {
    id: 'consumer',
    icon: FileText,
    title: 'Consumer Protection',
    description: 'Consumer rights, complaints, and remedies.',
    color: 'from-indigo-500 to-blue-400',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    questions: ['How to file consumer complaint', 'Consumer protection act'],
  },
  {
    id: 'cyber',
    icon: Scale,
    title: 'Cyber Law',
    description: 'IT Act, data protection, and cybercrime regulations.',
    color: 'from-teal-500 to-cyan-400',
    bgColor: 'bg-teal-50',
    textColor: 'text-teal-600',
    questions: ['What is cybercrime?', 'Data privacy laws'],
  },
  {
    id: 'tax',
    icon: Building,
    title: 'Tax Law',
    description: 'Income tax, GST, and tax compliance.',
    color: 'from-orange-500 to-amber-400',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600',
    questions: ['Income tax slabs', 'How to file ITR?'],
  },
  {
    id: 'traffic',
    icon: Car,
    title: 'Traffic Law',
    description: 'Motor vehicle act, traffic rules, and penalties.',
    color: 'from-gray-500 to-slate-400',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-600',
    questions: ['Traffic violation penalties', 'Driving license process'],
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-dark-900 mb-2">Legal Categories</h1>
          <p className="text-dark-600">
            Explore different areas of Indian law. Click on a category to get started.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {categories.map((category) => (
            <motion.div
              key={category.id}
              variants={item}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`relative p-6 rounded-2xl bg-white border border-dark-100 hover:border-dark-200 transition-all duration-300 hover:shadow-xl cursor-pointer overflow-hidden ${
                selectedCategory === category.id ? 'ring-2 ring-primary-500 border-primary-300' : ''
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 hover:opacity-5 transition-opacity duration-500`}
              />

              <div
                className={`relative w-14 h-14 rounded-xl ${category.bgColor} flex items-center justify-center mb-4`}
              >
                <category.icon className={`w-7 h-7 ${category.textColor}`} />
              </div>

              <h3 className="relative text-xl font-bold text-dark-900 mb-2">{category.title}</h3>
              <p className="relative text-dark-600 text-sm mb-4">{category.description}</p>

              <div className="relative space-y-2">
                {category.questions.slice(0, 2).map((q, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-dark-500">
                    <Search className="w-3 h-3" />
                    <span>{q}</span>
                  </div>
                ))}
              </div>

              <Link
                href={`/chat?category=${category.id}`}
                className="absolute top-4 right-4 p-2 text-dark-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Scale className="w-5 h-5" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
