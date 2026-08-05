'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Map,
  FileText,
  Users,
  Scale,
  Home,
  Briefcase,
  CheckCircle,
  Circle,
  ArrowRight,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface Step {
  id: string;
  title: string;
  description: string;
  documents?: string[];
  timeline: string;
}

interface Roadmap {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  category: string;
  color: string;
  bgColor: string;
  textColor: string;
  steps: Step[];
}

const roadmaps: Roadmap[] = [
  {
    id: 'filing-fir',
    icon: FileText,
    title: 'Filing an FIR',
    description: 'Step-by-step guide to filing a First Information Report with police.',
    category: 'Criminal',
    color: 'from-red-500 to-rose-400',
    bgColor: 'bg-red-50',
    textColor: 'text-red-600',
    steps: [
      {
        id: '1',
        title: 'Visit the Nearest Police Station',
        description: 'Go to the police station within whose jurisdiction the offence has been committed.',
        timeline: 'Day 1',
      },
      {
        id: '2',
        title: 'Provide Information',
        description: 'Give oral or written information about the offence to the officer in charge.',
        documents: ['Identity proof', 'Evidence (if any)'],
        timeline: 'Day 1',
      },
      {
        id: '3',
        title: 'Get the FIR Registered',
        description: 'Ensure the FIR is registered under Section 154 CrPC. You have the right to get a copy.',
        timeline: 'Day 1',
      },
      {
        id: '4',
        title: 'Obtain Copy of FIR',
        description: 'Get a free copy of the FIR. Note the FIR number for future reference.',
        timeline: 'Day 1',
      },
      {
        id: '5',
        title: 'Follow Up',
        description: 'Cooperate with the investigation. You can track the status through the police station.',
        timeline: 'Ongoing',
      },
    ],
  },
  {
    id: 'consumer-complaint',
    icon: Users,
    title: 'Filing Consumer Complaint',
    description: 'How to file a complaint under the Consumer Protection Act, 2019.',
    category: 'Consumer',
    color: 'from-amber-500 to-orange-400',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-600',
    steps: [
      {
        id: '1',
        title: 'Send Legal Notice',
        description: 'First send a legal notice to the seller/service provider about your grievance.',
        timeline: 'Day 1-15',
      },
      {
        id: '2',
        title: 'Wait for Response',
        description: 'Wait for 15 days for the seller to respond to your notice.',
        timeline: 'Day 15-30',
      },
      {
        id: '3',
        title: 'File Complaint Online',
        description: 'If no response, file complaint on National Consumer Helpline (NCH) or E-Daakhil portal.',
        documents: ['Invoice/Bill', 'Legal Notice copy', 'Evidence of defect'],
        timeline: 'Day 30-45',
      },
      {
        id: '4',
        title: 'Consumer Commission',
        description: 'For higher claims, file directly before the appropriate Consumer Commission.',
        timeline: 'Day 45-60',
      },
      {
        id: '5',
        title: 'Hearing & Order',
        description: 'Attend hearings. The commission will pass an order within 3 months.',
        timeline: '3-4 months',
      },
    ],
  },
  {
    id: 'property-transfer',
    icon: Home,
    title: 'Property Transfer',
    description: 'Guide to transferring property ownership in India.',
    category: 'Property',
    color: 'from-amber-500 to-orange-400',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-600',
    steps: [
      {
        id: '1',
        title: 'Due Diligence',
        description: 'Verify property title, encumbrances, and ownership through a lawyer.',
        documents: ['Title deeds', 'Encumbrance certificate', 'Property tax receipts'],
        timeline: 'Week 1-2',
      },
      {
        id: '2',
        title: 'Agreement to Sell',
        description: 'Execute an agreement to sell with terms and conditions.',
        timeline: 'Week 2-3',
      },
      {
        id: '3',
        title: 'Pay Stamp Duty',
        description: 'Pay the applicable stamp duty and registration charges.',
        documents: ['Stamp paper', 'Demand draft'],
        timeline: 'Week 3-4',
      },
      {
        id: '4',
        title: 'Execute Sale Deed',
        description: 'Execute the sale deed in the office of Sub-Registrar.',
        documents: ['Sale deed', 'ID proofs of parties', 'Passport size photos'],
        timeline: 'Week 4-5',
      },
      {
        id: '5',
        title: 'Registration',
        description: 'Register the sale deed at the Sub-Registrar office.',
        timeline: 'Week 5',
      },
      {
        id: '6',
        title: 'Mutation',
        description: 'Apply for mutation of property in your name at local municipal authority.',
        timeline: 'Week 6-8',
      },
    ],
  },
  {
    id: 'divorce-process',
    icon: Scale,
    title: 'Divorce Process',
    description: 'Understanding the divorce procedure under Hindu Marriage Act.',
    category: 'Family',
    color: 'from-pink-500 to-rose-400',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-600',
    steps: [
      {
        id: '1',
        title: 'Consult a Lawyer',
        description: 'Consult a family lawyer to understand your options and grounds for divorce.',
        timeline: 'Week 1',
      },
      {
        id: '2',
        title: 'Send Legal Notice',
        description: 'Send a legal notice to your spouse about your intention to seek divorce.',
        timeline: 'Week 2-3',
      },
      {
        id: '3',
        title: 'Mediation Attempt',
        description: 'Court may refer the matter for mediation to attempt reconciliation.',
        timeline: 'Week 4-8',
      },
      {
        id: '4',
        title: 'File Divorce Petition',
        description: 'File divorce petition in the appropriate family court.',
        documents: ['Marriage certificate', 'Address proof', 'Income proof', 'Evidence'],
        timeline: 'Week 8-12',
      },
      {
        id: '5',
        title: 'Court Proceedings',
        description: 'Attend court hearings. Evidence and cross-examination.',
        timeline: '6 months - 2 years',
      },
      {
        id: '6',
        title: 'Decree Absolute',
        description: 'Court passes decree of divorce. Marriage is legally dissolved.',
        timeline: 'After waiting period',
      },
    ],
  },
  {
    id: 'company-registration',
    icon: Briefcase,
    title: 'Company Registration',
    description: 'How to register a private limited company in India.',
    category: 'Corporate',
    color: 'from-purple-500 to-violet-400',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    steps: [
      {
        id: '1',
        title: 'Obtain DSC',
        description: 'Obtain Digital Signature Certificate for proposed directors.',
        timeline: 'Day 1-3',
      },
      {
        id: '2',
        title: 'Obtain DIN',
        description: 'Apply for Director Identification Number (DIN) for all directors.',
        timeline: 'Day 3-7',
      },
      {
        id: '3',
        title: 'Name Approval',
        description: 'Apply for company name approval through RUN service.',
        timeline: 'Day 7-14',
      },
      {
        id: '4',
        title: 'Prepare Documents',
        description: 'Prepare MOA (Memorandum of Association) and AOA (Articles of Association).',
        documents: ['MOA', 'AOA', 'Identity proofs', 'Address proofs'],
        timeline: 'Day 14-21',
      },
      {
        id: '5',
        title: 'File Incorporation',
        description: 'File SPICe+ form for company incorporation.',
        timeline: 'Day 21-28',
      },
      {
        id: '6',
        title: 'Get Certificate',
        description: 'Receive Certificate of Incorporation. Company is now registered.',
        timeline: 'Day 28-35',
      },
    ],
  },
];

export default function RoadmapPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedRoadmap, setExpandedRoadmap] = useState<string | null>(null);

  const categories = ['all', 'Criminal', 'Consumer', 'Property', 'Family', 'Corporate'];

  const filteredRoadmaps =
    selectedCategory === 'all'
      ? roadmaps
      : roadmaps.filter((r) => r.category === selectedCategory);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-dark-900 mb-2">Legal Roadmaps</h1>
          <p className="text-dark-600">
            Step-by-step guides through various legal processes in India.
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-100 text-dark-600 hover:bg-dark-200'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </motion.div>

        {/* Roadmaps */}
        <div className="space-y-6">
          {filteredRoadmaps.map((roadmap, index) => (
            <motion.div
              key={roadmap.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl bg-white border border-dark-100 overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedRoadmap(expandedRoadmap === roadmap.id ? null : roadmap.id)
                }
                className="w-full p-6 text-left hover:bg-dark-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl ${roadmap.bgColor} flex items-center justify-center`}
                  >
                    <roadmap.icon className={`w-6 h-6 ${roadmap.textColor}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-dark-900">{roadmap.title}</h3>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-dark-100 text-dark-600">
                        {roadmap.category}
                      </span>
                    </div>
                    <p className="text-dark-600">{roadmap.description}</p>
                  </div>
                  <ArrowRight
                    className={`w-5 h-5 text-dark-400 transition-transform ${
                      expandedRoadmap === roadmap.id ? 'rotate-90' : ''
                    }`}
                  />
                </div>
              </button>

              {expandedRoadmap === roadmap.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-dark-100"
                >
                  <div className="p-6">
                    {/* Timeline */}
                    <div className="relative">
                      {roadmap.steps.map((step, stepIndex) => (
                        <div key={step.id} className="relative flex gap-4 pb-8 last:pb-0">
                          {/* Vertical Line */}
                          {stepIndex < roadmap.steps.length - 1 && (
                            <div className="absolute left-4 top-8 w-0.5 h-full bg-primary-200" />
                          )}

                          {/* Step Circle */}
                          <div className="relative flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-bold">
                              {stepIndex + 1}
                            </div>
                          </div>

                          {/* Step Content */}
                          <div className="flex-1 pt-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-dark-900">{step.title}</h4>
                              <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary-50 text-primary-600">
                                {step.timeline}
                              </span>
                            </div>
                            <p className="text-dark-600 text-sm mb-2">{step.description}</p>
                            {step.documents && step.documents.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {step.documents.map((doc, i) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-dark-50 text-dark-600 text-xs"
                                  >
                                    <FileText className="w-3 h-3" />
                                    {doc}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
