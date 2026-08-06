'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Users,
  Home,
  Briefcase,
  Heart,
  Scale,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface Right {
  id: string;
  title: string;
  description: string;
  article: string;
  details: string[];
}

interface Category {
  id: string;
  icon: React.ElementType;
  title: string;
  color: string;
  bgColor: string;
  textColor: string;
  rights: Right[];
}

const categories: Category[] = [
  {
    id: 'fundamental',
    icon: Shield,
    title: 'Fundamental Rights',
    color: 'from-blue-500 to-cyan-400',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    rights: [
      {
        id: '1',
        title: 'Right to Equality',
        description: 'Equality before law and equal protection of laws.',
        article: 'Article 14-18',
        details: [
          'Equality before law (Article 14)',
          'Prohibition of discrimination (Article 15)',
          'Equality of opportunity in public employment (Article 16)',
          'Abolition of untouchability (Article 17)',
          'Abolition of titles (Article 18)',
        ],
      },
      {
        id: '2',
        title: 'Right to Freedom',
        description: 'Freedom of speech, assembly, and movement.',
        article: 'Article 19-22',
        details: [
          'Freedom of speech and expression (Article 19(1)(a))',
          'Freedom of assembly (Article 19(1)(b))',
          'Freedom of association (Article 19(1)(c))',
          'Freedom of movement (Article 19(1)(d))',
          'Protection of life and personal liberty (Article 21)',
        ],
      },
      {
        id: '3',
        title: 'Right against Exploitation',
        description: 'Protection from human trafficking and forced labor.',
        article: 'Article 23-24',
        details: [
          'Prohibition of traffic in human beings (Article 23)',
          'Prohibition of child labor (Article 24)',
        ],
      },
      {
        id: '4',
        title: 'Right to Freedom of Religion',
        description: 'Freedom to practice any religion.',
        article: 'Article 25-28',
        details: [
          'Freedom of conscience (Article 25)',
          'Freedom to manage religious affairs (Article 26)',
          'Freedom from taxation for religious promotion (Article 27)',
          'Freedom from religious instruction in state institutions (Article 28)',
        ],
      },
      {
        id: '5',
        title: 'Cultural and Educational Rights',
        description: 'Protection of cultural and educational interests.',
        article: 'Article 29-30',
        details: [
          'Protection of interests of minorities (Article 29)',
          'Right of minorities to establish educational institutions (Article 30)',
        ],
      },
      {
        id: '6',
        title: 'Right to Constitutional Remedies',
        description: 'Right to move court for enforcement of fundamental rights.',
        article: 'Article 32',
        details: [
          'Right to move Supreme Court for enforcement of fundamental rights',
          'Power to issue writs (habeas corpus, mandamus, prohibition, quo warranto, certiorari)',
        ],
      },
    ],
  },
  {
    id: 'legal',
    icon: Scale,
    title: 'Legal Rights',
    color: 'from-purple-500 to-violet-400',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    rights: [
      {
        id: '7',
        title: 'Right to Fair Trial',
        description: 'Every person has the right to a fair and speedy trial.',
        article: 'Section 304 CrPC',
        details: [
          'Right to be informed of charges',
          'Right to legal representation',
          'Right to examine witnesses',
          'Right to appeal',
        ],
      },
      {
        id: '8',
        title: 'Right to Privacy',
        description: 'Protection of personal privacy and data.',
        article: 'Article 21 (Puttaswamy Judgment)',
        details: [
          'Right to be let alone',
          'Protection of personal data',
          'Right to bodily integrity',
          'Right to informational privacy',
        ],
      },
      {
        id: '9',
        title: 'Right to Education',
        description: 'Free and compulsory education for children.',
        article: 'Article 21A / RTE Act',
        details: [
          'Free education for children aged 6-14 years',
          'Compulsory admission and enrollment',
          'No detention policy',
        ],
      },
    ],
  },
  {
    id: 'labor',
    icon: Briefcase,
    title: 'Labor Rights',
    color: 'from-emerald-500 to-teal-400',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    rights: [
      {
        id: '10',
        title: 'Right to Minimum Wage',
        description: 'Every worker is entitled to minimum wage.',
        article: 'Minimum Wages Act, 1948',
        details: [
          'Fair wage based on work',
          'Regular wage revision',
          'Payment on time',
        ],
      },
      {
        id: '11',
        title: 'Right to Safe Workplace',
        description: 'Employers must provide safe working conditions.',
        article: 'Factories Act, 1948',
        details: [
          'Clean and hygienic workplace',
          'Safety equipment',
          'Proper ventilation and lighting',
        ],
      },
      {
        id: '12',
        title: 'Right against Sexual Harassment',
        description: 'Protection from workplace sexual harassment.',
        article: 'POSH Act, 2013',
        details: [
          'Internal Complaints Committee',
          'Prohibition of sexual harassment',
          'Confidentiality of complainant',
        ],
      },
    ],
  },
  {
    id: 'consumer',
    icon: Users,
    title: 'Consumer Rights',
    color: 'from-amber-500 to-orange-400',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-600',
    rights: [
      {
        id: '13',
        title: 'Right to Safety',
        description: 'Protection against hazardous goods and services.',
        article: 'Consumer Protection Act, 2019',
        details: [
          'Safe products and services',
          'Information about risks',
          'Recall of defective products',
        ],
      },
      {
        id: '14',
        title: 'Right to Information',
        description: 'Right to know about products and services.',
        article: 'Consumer Protection Act, 2019',
        details: [
          'Complete information about product',
          'Labeling and packaging',
          'Quality and purity standards',
        ],
      },
      {
        id: '15',
        title: 'Right to Choose',
        description: 'Freedom to choose from a variety of products.',
        article: 'Consumer Protection Act, 2019',
        details: [
          'Access to variety of products',
          'Competitive pricing',
          'No monopolistic practices',
        ],
      },
    ],
  },
  {
    id: 'family',
    icon: Heart,
    title: 'Family Rights',
    color: 'from-pink-500 to-rose-400',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-600',
    rights: [
      {
        id: '16',
        title: 'Right to Maintenance',
        description: 'Right to financial support from spouse or parents.',
        article: 'Section 125 CrPC / Hindu Adoption Act',
        details: [
          'Maintenance for wife and children',
          'Maintenance for dependent parents',
          'Interim maintenance during proceedings',
        ],
      },
      {
        id: '17',
        title: 'Right to Child Custody',
        description: 'Best interest of child determines custody.',
        article: 'Guardian and Wards Act, 1890',
        details: [
          'Best interest of child principle',
          'Joint custody options',
          'Visitation rights',
        ],
      },
      {
        id: '18',
        title: 'Right against Domestic Violence',
        description: 'Protection from domestic abuse.',
        article: 'DV Act, 2005',
        details: [
          'Protection order',
          'Residence order',
          'Monetary relief',
          'Custody order',
        ],
      },
    ],
  },
  {
    id: 'housing',
    icon: Home,
    title: 'Housing Rights',
    color: 'from-rose-500 to-red-400',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-600',
    rights: [
      {
        id: '19',
        title: 'Tenant Rights',
        description: 'Protection against arbitrary eviction.',
        article: 'Rent Control Acts',
        details: [
          'Fair rent',
          'Protection against eviction',
          'Essential services',
        ],
      },
      {
        id: '20',
        title: 'Right to Shelter',
        description: 'Right to adequate housing.',
        article: 'Article 21 (Right to Life)',
        details: [
          'Basic shelter',
          'Affordable housing',
          'Protection of slum dwellers',
        ],
      },
    ],
  },
];

export default function KnowYourRightsPage() {
  const [expandedRight, setExpandedRight] = useState<string | null>(null);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-dark-900 mb-2">Know Your Rights</h1>
          <p className="text-dark-600">
            Understand your fundamental and legal rights under Nepal law.
          </p>
        </motion.div>

        <div className="space-y-8">
          {categories.map((category, catIndex) => (
            <motion.section
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-10 h-10 rounded-lg ${category.bgColor} flex items-center justify-center`}
                >
                  <category.icon className={`w-5 h-5 ${category.textColor}`} />
                </div>
                <h2 className="text-2xl font-bold text-dark-900">{category.title}</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {category.rights.map((right) => (
                  <motion.div
                    key={right.id}
                    whileHover={{ y: -4 }}
                    className={`rounded-xl bg-white border overflow-hidden transition-all duration-200 ${
                      expandedRight === right.id
                        ? 'border-primary-300 ring-2 ring-primary-100'
                        : 'border-dark-100 hover:border-dark-200'
                    }`}
                  >
                    <button
                      onClick={() =>
                        setExpandedRight(expandedRight === right.id ? null : right.id)
                      }
                      className="w-full p-4 text-left"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-dark-900 mb-1">{right.title}</h3>
                          <p className="text-sm text-dark-500 mb-2">{right.article}</p>
                          <p className="text-dark-600 text-sm">{right.description}</p>
                        </div>
                        {expandedRight === right.id ? (
                          <ChevronUp className="w-5 h-5 text-dark-400 flex-shrink-0 mt-1" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-dark-400 flex-shrink-0 mt-1" />
                        )}
                      </div>
                    </button>

                    <AnimatePresence>
                      {expandedRight === right.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-0 border-t border-dark-100">
                            <h4 className="font-medium text-dark-900 mb-2 mt-3">Key Provisions:</h4>
                            <ul className="space-y-2">
                              {right.details.map((detail, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-dark-600">
                                  <BookOpen className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                                  {detail}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
