import React from 'react';
import { HexColorPicker } from 'react-colorful';
import { Type, Move, Palette } from 'lucide-react';

interface WatermarkControlsProps {
  text: string;
  setText: (text: string) => void;
  color: string;
  setColor: (color: string) => void;
  opacity: number;
  setOpacity: (opacity: number) => void;
  position: string;
  setPosition: (position: string) => void;
}

export default function WatermarkControls({
  text,
  setText,
  color,
  setColor,
  opacity,
  setOpacity,
  position,
  setPosition
}: WatermarkControlsProps) {
  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm">
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Type className="w-4 h-4" />
          Watermark Text
        </label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your watermark text"
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Palette className="w-4 h-4" />
          Color & Opacity
        </label>
        <div className="space-y-4">
          <HexColorPicker color={color} onChange={setColor} />
          <input
            type="range"
            min="0"
            max="100"
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-sm text-gray-500">Opacity: {opacity}%</div>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Move className="w-4 h-4" />
          Position
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right'].map((pos) => (
            <button
              key={pos}
              onClick={() => setPosition(pos)}
              className={`p-2 border rounded-md ${
                position === pos
                  ? 'bg-blue-500 text-white border-blue-600'
                  : 'border-gray-300 hover:border-blue-400'
              }`}
            >
              <div className="w-6 h-6" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}