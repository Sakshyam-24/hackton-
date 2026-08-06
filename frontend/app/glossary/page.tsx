'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category: string;
}

const glossaryTerms: GlossaryTerm[] = [
  {
    id: '1',
    term: 'Affidavit',
    definition: 'A written statement confirmed by oath or affirmation, for use as evidence in court.',
    category: 'General',
  },
  {
    id: '2',
    term: 'Bail',
    definition: 'The temporary release of an accused person awaiting trial, sometimes on condition that a sum of money be lodged to guarantee their appearance in court.',
    category: 'Criminal',
  },
  {
    id: '3',
    term: 'Bench Warrant',
    definition: 'An order issued by a judge for the arrest of a person who has failed to appear in court as required.',
    category: 'Criminal',
  },
  {
    id: '4',
    term: 'Burden of Proof',
    definition: 'The obligation to prove one\'s assertion. In criminal cases, the burden of proof is on the prosecution.',
    category: 'General',
  },
  {
    id: '5',
    term: 'Cognizable Offence',
    definition: 'An offence in which a police officer can arrest without a warrant and investigate without permission from a magistrate.',
    category: 'Criminal',
  },
  {
    id: '6',
    term: 'Complaint',
    definition: 'Any allegation made orally or in writing to a magistrate with a view to his taking action under the CrPC.',
    category: 'Criminal',
  },
  {
    id: '7',
    term: 'Constitution',
    definition: 'The supreme law of India that establishes the framework of government and defines fundamental rights.',
    category: 'Constitutional',
  },
  {
    id: '8',
    term: 'Decree',
    definition: 'The formal expression of an adjudication which, so far as regards the Court expressing it, conclusively determines the rights of the parties.',
    category: 'Civil',
  },
  {
    id: '9',
    term: 'FIR (First Information Report)',
    definition: 'A written document prepared by police when they receive information about the commission of a cognizable offence.',
    category: 'Criminal',
  },
  {
    id: '10',
    term: 'Fundamental Rights',
    definition: 'The basic human rights guaranteed to all citizens by the Constitution of India (Part III).',
    category: 'Constitutional',
  },
  {
    id: '11',
    term: 'Habeas Corpus',
    definition: 'A writ requiring a person under arrest to be brought before a judge or into court, especially to secure the person\'s release unless lawful grounds are shown for detention.',
    category: 'Constitutional',
  },
  {
    id: '12',
    term: 'IPC (Nepal Labour Code)',
    definition: 'The official criminal code of India, drafted in 1860 and came into force in 1862.',
    category: 'Criminal',
  },
  {
    id: '13',
    term: 'Jurisdiction',
    definition: 'The official power to make legal decisions and judgments within a particular area or domain.',
    category: 'General',
  },
  {
    id: '14',
    term: 'Mandamus',
    definition: 'A judicial writ issued as a command to an inferior court or ordering a person to perform a public or statutory duty.',
    category: 'Constitutional',
  },
  {
    id: '15',
    term: 'Non-Cognizable Offence',
    definition: 'An offence in which a police officer cannot arrest without a warrant and cannot investigate without permission from a magistrate.',
    category: 'Criminal',
  },
  {
    id: '16',
    term: 'Plaintiff',
    definition: 'A person who brings a case against another in a court of law.',
    category: 'Civil',
  },
  {
    id: '17',
    term: 'Quo Warranto',
    definition: 'A writ requiring a person to show by what warrant or authority they hold or exercise a public office or franchise.',
    category: 'Constitutional',
  },
  {
    id: '18',
    term: 'Respondent',
    definition: 'A person against whom a petition is filed, especially one against whom an appeal is made.',
    category: 'Civil',
  },
  {
    id: '19',
    term: 'Summons',
    definition: 'A notice to a defendant that a legal action has been commenced against them and that they are required to appear in court.',
    category: 'General',
  },
  {
    id: '20',
    term: 'Warrant',
    definition: 'A document issued by a legal or government official authorizing the police to make an arrest, search premises, or carry out some other action relating to the administration of justice.',
    category: 'Criminal',
  },
];

export default function GlossaryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [expandedTerms, setExpandedTerms] = useState<Set<string>>(new Set());

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const filteredTerms = useMemo(() => {
    return glossaryTerms.filter((term) => {
      const matchesSearch =
        term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLetter = selectedLetter
        ? term.term.toUpperCase().startsWith(selectedLetter)
        : true;
      return matchesSearch && matchesLetter;
    });
  }, [searchQuery, selectedLetter]);

  const toggleTerm = (id: string) => {
    setExpandedTerms((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-dark-900 mb-2">Legal Glossary</h1>
          <p className="text-dark-600">
            Comprehensive guide to legal terminology used in Nepal law.
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
            placeholder="Search terms..."
          />
        </motion.div>

        {/* Alphabet Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          <button
            onClick={() => setSelectedLetter(null)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              selectedLetter === null
                ? 'bg-primary-600 text-white'
                : 'bg-dark-100 text-dark-600 hover:bg-dark-200'
            }`}
          >
            All
          </button>
          {alphabet.map((letter) => {
            const hasTerms = glossaryTerms.some((t) =>
              t.term.toUpperCase().startsWith(letter)
            );
            return (
              <button
                key={letter}
                onClick={() => setSelectedLetter(selectedLetter === letter ? null : letter)}
                disabled={!hasTerms}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedLetter === letter
                    ? 'bg-primary-600 text-white'
                    : hasTerms
                    ? 'bg-dark-100 text-dark-600 hover:bg-dark-200'
                    : 'bg-dark-50 text-dark-300 cursor-not-allowed'
                }`}
              >
                {letter}
              </button>
            );
          })}
        </motion.div>

        {/* Terms List */}
        <div className="space-y-3">
          <AnimatePresence>
            {filteredTerms.map((term, index) => (
              <motion.div
                key={term.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-xl bg-white border border-dark-100 overflow-hidden"
              >
                <button
                  onClick={() => toggleTerm(term.id)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-dark-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark-900">{term.term}</h3>
                      <p className="text-xs text-dark-500">{term.category}</p>
                    </div>
                  </div>
                  {expandedTerms.has(term.id) ? (
                    <ChevronUp className="w-5 h-5 text-dark-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-dark-400" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedTerms.has(term.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-0">
                        <p className="text-dark-600 leading-relaxed">{term.definition}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredTerms.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-dark-300 mx-auto mb-4" />
              <p className="text-dark-500">No terms found matching your search</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
