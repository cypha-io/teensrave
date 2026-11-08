import { ImageResponse } from 'next/og'
import React from 'react'

export const runtime = 'nodejs'
export const revalidate = 3600

export default async function OG() {
  try {
    return new ImageResponse(
      React.createElement(
        'div',
        {
          style: {
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
            fontSize: 88,
            fontWeight: 'bold',
            color: 'white',
            fontFamily: '"Impact", "Arial Black", sans-serif',
          },
        },
        React.createElement(
          'div',
          {
            style: {
              textAlign: 'center',
              textShadow: '0 4px 12px rgba(0,0,0,0.4)',
              letterSpacing: 2,
            },
          },
          'TEENSRAVE'
        ),
        React.createElement(
          'div',
          {
            style: {
              fontSize: 32,
              marginTop: 20,
              color: 'rgba(255,255,255,0.9)',
              textShadow: '0 2px 8px rgba(0,0,0,0.3)',
            },
          },
          'Elevate Your Voice. Redefine the Culture.'
        )
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    return new Response('Failed to generate image', { status: 500 })
  }
}
