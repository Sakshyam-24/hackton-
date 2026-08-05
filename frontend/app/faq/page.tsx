'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, HelpCircle, ChevronDown, ChevronRight } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    id: '1',
    question: 'What is Legal Advisor AI?',
    answer:
      'Legal Advisor AI is an AI-powered platform that provides instant legal guidance and information about Indian law. It uses advanced natural language processing to understand your questions and provide accurate, citation-backed responses.',
    category: 'General',
  },
  {
    id: '2',
    question: 'Is the legal advice provided by the AI legally binding?',
    answer:
      'No. The information provided by Legal Advisor AI is for general informational and educational purposes only. It should not be construed as professional legal advice. Always consult with a qualified legal professional for specific legal matters.',
    category: 'General',
  },
  {
    id: '3',
    question: 'What types of legal questions can I ask?',
    answer:
      'You can ask questions about various areas of Indian law including constitutional law, criminal law, family law, property law, corporate law, labor law, consumer protection, cyber law, and tax law.',
    category: 'General',
  },
  {
    id: '4',
    question: 'How accurate is the legal information provided?',
    answer:
      'Our AI is trained on comprehensive Indian legal databases including the Constitution, Indian Penal Code, and various acts. While we strive for accuracy, legal information is subject to change and may vary by jurisdiction. Always verify critical information through official sources.',
    category: 'General',
  },
  {
    id: '5',
    question: 'Is my data secure and private?',
    answer:
      'Yes. We take data privacy very seriously. All conversations are encrypted and stored securely. We never share your personal information or conversations with third parties. You can delete your data at any time from the settings page.',
    category: 'Privacy & Security',
  },
  {
    id: '6',
    question: 'Can I use this service for free?',
    answer:
      'Yes, Legal Advisor AI offers a free tier that allows you to ask a limited number of questions per day. For unlimited access and additional features, we offer premium subscription plans.',
    category: 'Pricing',
  },
  {
    id: '7',
    question: 'How do I file a consumer complaint in India?',
    answer:
      'To file a consumer complaint: 1) Send a legal notice to the seller/service provider. 2) Wait for 15 days for a response. 3) If no response, file a complaint on the National Consumer Helpline (NCH) or E-Daakhil portal. 4) For higher claims, file directly before the appropriate Consumer Commission.',
    category: 'Legal Process',
  },
  {
    id: '8',
    question: 'What are my fundamental rights under the Indian Constitution?',
    answer:
      'The Indian Constitution guarantees six fundamental rights: 1) Right to Equality (Articles 14-18), 2) Right to Freedom (Articles 19-22), 3) Right against Exploitation (Articles 23-24), 4) Right to Freedom of Religion (Articles 25-28), 5) Cultural and Educational Rights (Articles 29-30), and 6) Right to Constitutional Remedies (Article 32).',
    category: 'Legal Knowledge',
  },
  {
    id: '9',
    question: 'How do I check if a property has a clear title?',
    answer:
      'To verify property title: 1) Obtain an Encumbrance Certificate from the Sub-Registrar office. 2) Check property tax receipts and records. 3) Verify the chain of title deeds. 4) Check for any court cases or disputes. 5) Get a legal opinion from a property lawyer.',
    category: 'Legal Process',
  },
  {
    id: '10',
    question: 'What is the process for getting a divorce in India?',
    answer:
      'The divorce process varies by religion but generally includes: 1) Consulting a family lawyer. 2) Sending a legal notice to your spouse. 3) Attempting mediation for reconciliation. 4) Filing a divorce petition in family court. 5) Attending court proceedings. 6) Receiving the decree absolute after the waiting period.',
    category: 'Legal Process',
  },
  {
    id: '11',
    question: 'How can I protect myself from cybercrime?',
    answer:
      'To protect against cybercrime: 1) Use strong, unique passwords. 2) Enable two-factor authentication. 3) Be cautious of phishing emails and messages. 4) Keep software updated. 5) Use secure Wi-Fi networks. 6) Report cybercrime to the National Cyber Crime Reporting Portal (cybercrime.gov.in).',
    category: 'Legal Knowledge',
  },
  {
    id: '12',
    question: 'What should I do if my employer is not paying minimum wage?',
    answer:
      'If your employer is not paying minimum wage: 1) Document all evidence of work and payment. 2) File a complaint with the Labour Commissioner. 3) Approach the appropriate Labour Court. 4) You can also file a complaint under the Payment of Wages Act, 1936.',
    category: 'Legal Knowledge',
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const categories = ['all', 'General', 'Privacy & Security', 'Pricing', 'Legal Process', 'Legal Knowledge'];

  const filteredFAQs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesSearch =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || faq.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-dark-900 mb-2">Frequently Asked Questions</h1>
          <p className="text-dark-600">
            Find answers to common questions about Legal Advisor AI and Indian law.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative mb-6"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-dark-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-dark-200 bg-white text-dark-900 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            placeholder="Search questions..."
          />
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
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

        {/* FAQ List */}
        <div className="space-y-3">
          <AnimatePresence>
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-xl bg-white border overflow-hidden transition-all duration-200 ${
                  expandedFAQ === faq.id
                    ? 'border-primary-300 ring-2 ring-primary-100'
                    : 'border-dark-100 hover:border-dark-200'
                }`}
              >
                <button
                  onClick={() =>
                    setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)
                  }
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                      <HelpCircle className="w-4 h-4 text-primary-600" />
                    </div>
                    <span className="font-medium text-dark-900">{faq.question}</span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-dark-400 flex-shrink-0 transition-transform ${
                      expandedFAQ === faq.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {expandedFAQ === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-0 pl-15">
                        <p className="text-dark-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="w-12 h-12 text-dark-300 mx-auto mb-4" />
              <p className="text-dark-500">No questions found matching your search</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
