'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Github, Twitter, Instagram, Linkedin } from 'lucide-react'

const footerSections = {
  marketplace: [
    { label: 'Browse', href: '/marketplace' },
    { label: 'How It Works', href: '#' },
    { label: 'Safety', href: '#' },
  ],
  company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
  ],
  legal: [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'Contact', href: '#' },
  ],
}

const socialLinks = [
  { icon: Twitter, href: '#' },
  { icon: Github, href: '#' },
  { icon: Instagram, href: '#' },
  { icon: Linkedin, href: '#' },
]

export function CinematicFooter() {
  return (
    <footer className="relative bg-foreground/5 border-t border-border/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-foreground text-background flex items-center justify-center font-black text-sm">
                U
              </div>
              <span className="font-bold">UrbanTrade</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Local commerce, reimagined for people who value their community.
            </p>
          </motion.div>

          {/* Links */}
          {Object.entries(footerSections).map(([section, links], idx) => (
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold mb-4 capitalize text-sm">
                {section === 'marketplace' ? 'Marketplace' : section === 'company' ? 'Company' : 'Legal'}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-border/50 mb-8" />

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} UrbanTrade. All rights reserved.</p>

          <div className="flex items-center gap-4">
            {socialLinks.map(({ icon: Icon }, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-foreground/10 rounded-lg transition-colors"
              >
                <Icon size={18} />
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
