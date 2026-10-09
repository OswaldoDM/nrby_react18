import React, { useState } from 'react';
import { Button } from '@/components/ui';
import { JURISDICTION_COLORS } from '@/hooks/useJurisdictionStore';
import { Layers, X, Sparkles } from 'lucide-react';

interface NewJurisdictionModalProps {
  isOpen: boolean;
  onSave: (name: string, description: string, color: string) => void;
  onCancel: () => void;
}

/**
 * Modal interactivo para nombrar y personalizar una nueva jurisdicción
 * inmediatamente después de haber sido dibujada sobre el mapa.
 */
export const NewJurisdictionModal: React.FC<NewJurisdictionModalProps> = ({
  isOpen,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(JURISDICTION_COLORS[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || `New Jurisdiction ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    onSave(finalName, description.trim(), selectedColor);
    setName('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-surface-900 border border-surface-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Cabecera del modal */}
        <div className="px-5 py-4 border-b border-surface-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-nrby-500/15 border border-nrby-500/30 flex items-center justify-center text-nrby-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Save Jurisdiction</h3>
              <p className="text-xs text-surface-400">Define details for this territory zone</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-surface-400 hover:text-white p-1 rounded-lg hover:bg-surface-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-surface-300">
              Jurisdiction Name *
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. Florida Atlantic Coast District"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-surface-850 border border-surface-700 text-surface-100 placeholder:text-surface-500 focus:outline-none focus:border-nrby-500 focus:ring-1 focus:ring-nrby-500 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-surface-300">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Operational scope, team coverage, or notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-surface-850 border border-surface-700 text-surface-100 placeholder:text-surface-500 focus:outline-none focus:border-nrby-500 focus:ring-1 focus:ring-nrby-500 transition-all resize-none"
            />
          </div>

          {/* Selector de color de la jurisdicción */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-surface-300">
              Zone Highlight Color
            </label>
            <div className="flex items-center gap-2.5">
              {JURISDICTION_COLORS.map((color) => (
                <button
                  type="button"
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{ backgroundColor: color }}
                  className={`w-7 h-7 rounded-full transition-transform cursor-pointer flex items-center justify-center ${
                    selectedColor === color
                      ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-surface-900 shadow-md'
                      : 'hover:scale-105 opacity-80'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-surface-800">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Save Jurisdiction
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
