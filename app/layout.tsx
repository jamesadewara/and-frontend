import React from 'react'
import type { Metadata } from 'next'
import './globals.css'
import ClientShell from './ClientShell'
import { TEAM, TeamMember } from '@/src/data'
import { config } from '@/src/lib/config'

export const metadata: Metadata = {
  metadataBase: new URL(config.internalApi.baseUrl),
  title: {
    template: '%s | AnD AI',
    default: 'AnD AI - Culturally Intelligent AI for the Nigerian Market',
  },
  description: 'AnD AI is aculturally intelligent AI platform for the Nigerian market.',
  keywords: ['AnD AI', 'Culturally Intelligent AI', 'Nigerian Market', 'Consumer Behavior', 'AI Recommendations'],
  authors: TEAM.filter((m: TeamMember) => ({ name: m.name, url: m.linkedin || m.github || m.x ||m.website })),
  openGraph: {
    title: 'AnD AI',
    description: 'Culturally intelligent AI for the Nigerian market',
    type: 'website',
    images: [{ url: '/logo.png', width: 1200, height: 630 }],
    siteName: 'AnD AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AnD AI',
    description: 'Culturally intelligent AI for the Nigerian market',
    images: ['/logo.png'],
  }
}


export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  )
}

