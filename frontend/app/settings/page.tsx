'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Bell,
  Shield,
  User,
  Sun,
  Moon,
  Monitor,
  Mail,
  Smartphone,
  Lock,
  Trash2,
  Save,
  CheckCircle,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface SettingsSection {
  id: string;
  icon: React.ElementType;
  title: string;
}

const sections: SettingsSection[] = [
  { id: 'appearance', icon: Sun, title: 'Appearance' },
  { id: 'notifications', icon: Bell, title: 'Notifications' },
  { id: 'privacy', icon: Shield, title: 'Privacy' },
  { id: 'account', icon: User, title: 'Account' },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('appearance');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    updates: true,
    marketing: false,
  });
  const [privacy, setPrivacy] = useState({
    showProfile: true,
    shareAnalytics: false,
    allowCookies: true,
  });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // System preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-dark-900 mb-2">Settings</h1>
          <p className="text-dark-600">Manage your account preferences and settings.</p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-1"
          >
            <div className="sticky top-24 space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                    activeSection === section.id
                      ? 'bg-primary-50 text-primary-600 font-medium'
                      : 'text-dark-600 hover:bg-dark-50'
                  }`}
                >
                  <section.icon className="w-5 h-5" />
                  {section.title}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Settings Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-3"
          >
            <div className="rounded-2xl bg-white border border-dark-100 p-6">
              {/* Appearance Section */}
              {activeSection === 'appearance' && (
                <div>
                  <h2 className="text-xl font-bold text-dark-900 mb-6">Appearance</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-dark-700 mb-3">
                        Theme
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: 'light', icon: Sun, label: 'Light' },
                          { value: 'dark', icon: Moon, label: 'Dark' },
                          { value: 'system', icon: Monitor, label: 'System' },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() =>
                              handleThemeChange(option.value as 'light' | 'dark' | 'system')
                            }
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                              theme === option.value
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-dark-200 hover:border-dark-300'
                            }`}
                          >
                            <option.icon
                              className={`w-6 h-6 ${
                                theme === option.value ? 'text-primary-600' : 'text-dark-500'
                              }`}
                            />
                            <span
                              className={`text-sm font-medium ${
                                theme === option.value ? 'text-primary-600' : 'text-dark-600'
                              }`}
                            >
                              {option.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <div>
                  <h2 className="text-xl font-bold text-dark-900 mb-6">Notifications</h2>

                  <div className="space-y-4">
                    {[
                      {
                        key: 'email',
                        icon: Mail,
                        title: 'Email Notifications',
                        description: 'Receive notifications via email',
                      },
                      {
                        key: 'push',
                        icon: Smartphone,
                        title: 'Push Notifications',
                        description: 'Receive push notifications on your device',
                      },
                      {
                        key: 'updates',
                        icon: Bell,
                        title: 'Product Updates',
                        description: 'Get notified about new features and updates',
                      },
                      {
                        key: 'marketing',
                        icon: Mail,
                        title: 'Marketing Emails',
                        description: 'Receive tips, trends, and product recommendations',
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between p-4 rounded-xl border border-dark-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                            <item.icon className="w-5 h-5 text-primary-600" />
                          </div>
                          <div>
                            <p className="font-medium text-dark-900">{item.title}</p>
                            <p className="text-sm text-dark-500">{item.description}</p>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            setNotifications({
                              ...notifications,
                              [item.key]: !notifications[item.key as keyof typeof notifications],
                            })
                          }
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            notifications[item.key as keyof typeof notifications]
                              ? 'bg-primary-600'
                              : 'bg-dark-200'
                          }`}
                        >
                          <div
                            className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                              notifications[item.key as keyof typeof notifications]
                                ? 'left-7'
                                : 'left-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Privacy Section */}
              {activeSection === 'privacy' && (
                <div>
                  <h2 className="text-xl font-bold text-dark-900 mb-6">Privacy</h2>

                  <div className="space-y-4">
                    {[
                      {
                        key: 'showProfile',
                        title: 'Show Profile',
                        description: 'Allow others to see your profile information',
                      },
                      {
                        key: 'shareAnalytics',
                        title: 'Share Analytics',
                        description: 'Help improve the product by sharing usage data',
                      },
                      {
                        key: 'allowCookies',
                        title: 'Allow Cookies',
                        description: 'Enable cookies for a better experience',
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between p-4 rounded-xl border border-dark-100"
                      >
                        <div>
                          <p className="font-medium text-dark-900">{item.title}</p>
                          <p className="text-sm text-dark-500">{item.description}</p>
                        </div>
                        <button
                          onClick={() =>
                            setPrivacy({
                              ...privacy,
                              [item.key]: !privacy[item.key as keyof typeof privacy],
                            })
                          }
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            privacy[item.key as keyof typeof privacy]
                              ? 'bg-primary-600'
                              : 'bg-dark-200'
                          }`}
                        >
                          <div
                            className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                              privacy[item.key as keyof typeof privacy]
                                ? 'left-7'
                                : 'left-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}

                    <div className="pt-4 border-t border-dark-100">
                      <button className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium">
                        <Trash2 className="w-4 h-4" />
                        Delete Account
                      </button>
                      <p className="text-sm text-dark-500 mt-1">
                        This action is irreversible. All your data will be permanently deleted.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Section */}
              {activeSection === 'account' && (
                <div>
                  <h2 className="text-xl font-bold text-dark-900 mb-6">Account</h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-dark-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        defaultValue="user@example.com"
                        className="w-full px-4 py-3 rounded-lg border border-dark-200 bg-white text-dark-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark-700 mb-2">
                        Display Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Legal User"
                        className="w-full px-4 py-3 rounded-lg border border-dark-200 bg-white text-dark-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark-700 mb-2">
                        Language
                      </label>
                      <select className="w-full px-4 py-3 rounded-lg border border-dark-200 bg-white text-dark-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                      </select>
                    </div>

                    <div className="pt-4 border-t border-dark-100">
                      <h3 className="font-medium text-dark-900 mb-3 flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Change Password
                      </h3>
                      <div className="space-y-3">
                        <input
                          type="password"
                          placeholder="Current password"
                          className="w-full px-4 py-3 rounded-lg border border-dark-200 bg-white text-dark-900 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <input
                          type="password"
                          placeholder="New password"
                          className="w-full px-4 py-3 rounded-lg border border-dark-200 bg-white text-dark-900 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <input
                          type="password"
                          placeholder="Confirm new password"
                          className="w-full px-4 py-3 rounded-lg border border-dark-200 bg-white text-dark-900 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-dark-100 flex justify-end">
                <button
                  onClick={handleSave}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                    isSaved
                      ? 'bg-green-500 text-white'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  {isSaved ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Saved!
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
