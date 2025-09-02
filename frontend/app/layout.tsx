import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'Sistema Web Club La Victoria',
  description: 'Sistema para la gestión de socios y temporadas de pileta',
  icons: "https://clublavictoria.com.ar/static/media/logo.6dafc533b0491900e9a6.png"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Analytics />
        <Toaster position='top-center' duration={3000} richColors toastOptions={{}}/>
      </body>
    </html>
  )
}
