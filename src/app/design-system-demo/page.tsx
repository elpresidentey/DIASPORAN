'use client';

import React from 'react';
import { 
  spacing, 
  typography, 
  borderRadius, 
  shadows, 
  colors,
  getSpacing,
  getFontSize,
  getColor,
  getBorderRadius,
  getShadow
} from '@/lib/design-system';

export default function DesignSystemDemo() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Design System
          </h1>
          <p className="text-xl text-gray-400">
            Consistent tokens for spacing, typography, colors, and more
          </p>
        </div>

        {/* Spacing System */}
        <section className="space-y-6">
          <h2 className="text-4xl font-bold text-white">Spacing System (8px base)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(spacing).map(([key, value]) => (
              <div key={key} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
                <div className="text-sm text-gray-400 mb-2">spacing.{key}</div>
                <div className="text-2xl font-bold text-purple-400">{value}</div>
                <div 
                  className="mt-3 bg-purple-500 rounded"
                  style={{ height: '8px', width: value }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Typography Scale */}
        <section className="space-y-6">
          <h2 className="text-4xl font-bold text-white">Typography Scale</h2>
          <div className="space-y-4">
            {Object.entries(typography.fontSize).map(([key, value]) => (
              <div key={key} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm text-gray-400 mb-1">text-{key}</div>
                  <div className="text-base text-gray-300">{value}</div>
                </div>
                <div 
                  className="text-white font-semibold"
                  style={{ fontSize: value }}
                >
                  Sample Text
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Border Radius */}
        <section className="space-y-6">
          <h2 className="text-4xl font-bold text-white">Border Radius</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(borderRadius).map(([key, value]) => (
              <div key={key} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
                <div className="text-sm text-gray-400 mb-2">rounded-{key}</div>
                <div className="text-base text-gray-300 mb-3">{value}</div>
                <div 
                  className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500"
                  style={{ borderRadius: value }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Shadow Elevation */}
        <section className="space-y-6">
          <h2 className="text-4xl font-bold text-white">Shadow Elevation</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {Object.entries(shadows).map(([key, value]) => {
              if (typeof value === 'object') return null;
              return (
                <div key={key} className="space-y-3">
                  <div className="text-sm text-gray-400">shadow-{key}</div>
                  <div 
                    className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex items-center justify-center"
                    style={{ boxShadow: value }}
                  >
                    <div className="text-white font-semibold">Elevation {key}</div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Glow Shadows */}
          <div className="grid grid-cols-2 gap-6 mt-6">
            <div className="space-y-3">
              <div className="text-sm text-gray-400">shadow-glow-purple</div>
              <div 
                className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex items-center justify-center"
                style={{ boxShadow: shadows.glow.purple }}
              >
                <div className="text-white font-semibold">Purple Glow</div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-sm text-gray-400">shadow-glow-pink</div>
              <div 
                className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex items-center justify-center"
                style={{ boxShadow: shadows.glow.pink }}
              >
                <div className="text-white font-semibold">Pink Glow</div>
              </div>
            </div>
          </div>
        </section>

        {/* Color Palette */}
        <section className="space-y-6">
          <h2 className="text-4xl font-bold text-white">Color Palette</h2>
          
          {/* Brand Colors */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-purple-400">Brand Colors</h3>
            <div className="space-y-3">
              <div className="text-lg font-medium text-gray-300">Purple</div>
              <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                {Object.entries(colors.primary).map(([shade, color]) => (
                  <div key={shade} className="space-y-2">
                    <div 
                      className="w-full h-20 rounded-lg border border-white/10"
                      style={{ backgroundColor: color }}
                    />
                    <div className="text-xs text-gray-400 text-center">{shade}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="text-lg font-medium text-gray-300">Pink</div>
              <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                {Object.entries(colors.secondary).map(([shade, color]) => (
                  <div key={shade} className="space-y-2">
                    <div 
                      className="w-full h-20 rounded-lg border border-white/10"
                      style={{ backgroundColor: color }}
                    />
                    <div className="text-xs text-gray-400 text-center">{shade}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Semantic Colors */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-purple-400">Semantic Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-gray-400">Success</div>
                <div 
                  className="w-full h-20 rounded-lg border border-white/10"
                  style={{ backgroundColor: colors.success[500] }}
                />
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-400">Warning</div>
                <div 
                  className="w-full h-20 rounded-lg border border-white/10"
                  style={{ backgroundColor: colors.warning[500] }}
                />
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-400">Error</div>
                <div 
                  className="w-full h-20 rounded-lg border border-white/10"
                  style={{ backgroundColor: colors.error[500] }}
                />
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-400">Info</div>
                <div 
                  className="w-full h-20 rounded-lg border border-white/10"
                  style={{ backgroundColor: colors.info[500] }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Usage Examples */}
        <section className="space-y-6">
          <h2 className="text-4xl font-bold text-white">Usage Examples</h2>
          
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-2xl font-semibold text-purple-400">JavaScript/TypeScript</h3>
            <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto">
              <code className="text-sm text-gray-300">
{`import { getSpacing, getFontSize, getColor } from '@/lib/design-system';

const padding = getSpacing(4);        // '2rem' (32px)
const fontSize = getFontSize('2xl');  // '1.5rem' (24px)
const color = getColor('purple', 500); // '#a855f7'`}
              </code>
            </pre>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-2xl font-semibold text-purple-400">Tailwind Classes</h3>
            <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto">
              <code className="text-sm text-gray-300">
{`<div className="p-4 m-2 rounded-2xl shadow-lg bg-purple-500">
  <h2 className="text-3xl text-white">Title</h2>
  <p className="text-base text-gray-300">Description</p>
</div>`}
              </code>
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
}
