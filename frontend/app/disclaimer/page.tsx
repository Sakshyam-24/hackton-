'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertTriangle, Scale, Shield, BookOpen, ArrowRight } from 'lucide-react';
import Sidebar from '@/components/Sidebar/Sidebar';
import Navbar from '@/components/Navbar/Navbar';
import { useAuth } from '@/hooks/useAuth';

const sections = [
  {
    icon: AlertTriangle,
    title: 'Not Legal Advice',
    iconColor: 'text-yellow-500',
    content: [
      'The information provided by Legal Advisor AI is for general informational and educational purposes only. Nothing on this platform should be construed as professional legal advice, legal opinion, or an endorsement of any particular legal strategy.',
      'The AI-generated responses are based on patterns in training data and should not be used as a substitute for consultation with a qualified legal professional. Laws and regulations change frequently, and the information provided may not reflect the most current legal developments.',
    ],
  },
  {
    icon: Scale,
    title: 'No Attorney-Client Relationship',
    iconColor: 'text-primary-600',
    content: [
      'Use of this platform does not create an attorney-client relationship between you and Legal Advisor AI or its operators. Communication through this platform does not constitute privileged or confidential information.',
      'If you require legal representation, please consult with a licensed attorney in your jurisdiction.',
    ],
  },
  {
    icon: BookOpen,
    title: 'Accuracy of Information',
    iconColor: 'text-primary-600',
    content: [
      'While we strive to provide accurate and up-to-date information, we make no representations or warranties of any kind about the completeness, accuracy, reliability, or availability of the information provided.',
      'Legal information is subject to change and may vary by jurisdiction. The AI may occasionally generate inaccurate or outdated information. Always verify critical legal information through official government sources or qualified legal professionals.',
    ],
  },
  {
    icon: Shield,
    title: 'Limitation of Liability',
    iconColor: 'text-primary-600',
    content: [
      'In no event shall Legal Advisor AI be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.',
      'The platform is provided "as is" without warranty of any kind. We disclaim all warranties, express or implied, including but not limited to implied warranties of merchantability and fitness for a particular purpose.',
    ],
  },
];

export default function DisclaimerPage() {
  const { user, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-white">
      {isAuthenticated && <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />}
      <div className="flex-1 flex flex-col min-w-0">
        {isAuthenticated && <Navbar onMenuClick={() => setSidebarOpen(true)} user={user} />}
        <main className="flex-1">
          <section className="bg-gradient-to-br from-yellow-50 to-white py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
                <h1 className="text-4xl md:text-5xl font-bold text-dark-900 mb-6">Disclaimer</h1>
                <p className="text-lg text-dark-600 max-w-2xl mx-auto">
                  Please read this disclaimer carefully before using our service.
                </p>
              </motion.div>
            </div>
          </section>

          <section className="py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              {sections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card"
                >
                  <h2 className="text-2xl font-bold text-dark-900 mb-4 flex items-center gap-2">
                    <section.icon className={`h-6 w-6 ${section.iconColor}`} />
                    {section.title}
                  </h2>
                  {section.content.map((paragraph, i) => (
                    <p key={i} className="text-dark-600 mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="card"
              >
                <h2 className="text-2xl font-bold text-dark-900 mb-4">Jurisdiction</h2>
                <p className="text-dark-600">
                  This platform primarily provides information related to Indian law. Legal information for
                  other jurisdictions may be limited or unavailable. Users outside India should consult local
                  legal professionals for jurisdiction-specific advice.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-yellow-50 border border-yellow-200 rounded-xl p-6"
              >
                <p className="text-yellow-800 font-medium mb-2">Important Reminder</p>
                <p className="text-yellow-700">
                  If you have a legal emergency or need immediate legal assistance, please contact a qualified
                  attorney or local law enforcement. Do not rely solely on AI-generated information for critical
                  legal decisions.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 btn-primary"
                >
                  Return to Home
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
