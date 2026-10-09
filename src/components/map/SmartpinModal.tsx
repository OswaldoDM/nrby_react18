import React, { useState } from 'react';
import { Button } from '@/components/ui';
import type { SmartpinStatus } from '@/types';
import { MapPin, X, Sparkles, Check, User, FileText } from 'lucide-react';

export interface SmartpinFormData {
  name: string;
  description: string;
  status: SmartpinStatus;
  assignedTo: string;
}

interface SmartpinModalProps {
  isOpen: boolean;
  isEditing?: boolean;
  initialData?: {
    name?: string;
    description?: string;
    status?: SmartpinStatus;
    assignedTo?: string;
  };
  defaultSuggestedName?: string;
  onSave: (data: SmartpinFormData) => void;
  onCancel: () => void;
}

const STATUS_OPTIONS: { id: SmartpinStatus; label: string; bg: string; text: string; border: string }[] = [
  { id: 'active', label: 'Active', bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  { id: 'in_progress', label: 'In Progress', bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' },
  { id: 'completed', label: 'Completed', bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30' },
  { id: 'flagged', label: 'Flagged', bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/30' },
];

interface FormContentProps {
  isEditing: boolean;
  initialData?: SmartpinModalProps['initialData'];
  defaultSuggestedName: string;
  onSave: (data: SmartpinFormData) => void;
  onCancel: () => void;
}

const FormContent: React.FC<FormContentProps> = ({
  isEditing,
  initialData,
  defaultSuggestedName,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState(initialData?.name ?? defaultSuggestedName ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [status, setStatus] = useState<SmartpinStatus>(initialData?.status ?? 'active');
  const [assignedTo, setAssignedTo] = useState(initialData?.assignedTo ?? '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName =
      name.trim() ||
      defaultSuggestedName ||
      `Smartpin ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    onSave({
      name: finalName,
      description: description.trim(),
      status,
      assignedTo: assignedTo.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-5 space-y-4">
      {/* Nombre del Smartpin */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-surface-300">
          Smartpin Name *
        </label>
        <input
          type="text"
          required
          autoFocus
          placeholder="e.g. Austin Fiber Repeater 4"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg bg-surface-850 border border-surface-700 text-surface-100 placeholder:text-surface-500 focus:outline-none focus:border-nrby-500 focus:ring-1 focus:ring-nrby-500 transition-all"
        />
      </div>

      {/* Selector de Estado Operativo */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-surface-300">
          Status
        </label>
        <div className="grid grid-cols-2 gap-2">
          {STATUS_OPTIONS.map((opt) => (
            <button
              type="button"
              key={opt.id}
              onClick={() => setStatus(opt.id)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border flex items-center justify-between transition-all cursor-pointer ${
                status === opt.id
                  ? `${opt.bg} ${opt.text} ${opt.border} ring-1 ring-offset-1 ring-offset-surface-900 ring-current`
                  : 'bg-surface-850 text-surface-400 border-surface-750 hover:text-surface-200 hover:bg-surface-800'
              }`}
            >
              <span>{opt.label}</span>
              {status === opt.id && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Asignado a */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-surface-300 flex items-center gap-1.5">
          <User className="w-3 h-3 text-surface-400" />
          <span>Assigned Personnel (Optional)</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Marcus Vance"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg bg-surface-850 border border-surface-700 text-surface-100 placeholder:text-surface-500 focus:outline-none focus:border-nrby-500 focus:ring-1 focus:ring-nrby-500 transition-all"
        />
      </div>

      {/* Descripción */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-surface-300 flex items-center gap-1.5">
          <FileText className="w-3 h-3 text-surface-400" />
          <span>Description / Notes (Optional)</span>
        </label>
        <textarea
          rows={2}
          placeholder="Installation specifics, equipment status, or access notes..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg bg-surface-850 border border-surface-700 text-surface-100 placeholder:text-surface-500 focus:outline-none focus:border-nrby-500 focus:ring-1 focus:ring-nrby-500 transition-all resize-none"
        />
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
          leftIcon={isEditing ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
        >
          {isEditing ? 'Save Changes' : 'Drop Smartpin'}
        </Button>
      </div>
    </form>
  );
};

/**
 * Modal interactivo para crear y editar Smartpins.
 * Permite definir nombre, estado operativo, responsable y notas.
 */
export const SmartpinModal: React.FC<SmartpinModalProps> = ({
  isOpen,
  isEditing = false,
  initialData,
  defaultSuggestedName = '',
  onSave,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-surface-900 border border-surface-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Cabecera del modal */}
        <div className="px-5 py-4 border-b border-surface-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-nrby-500/15 border border-nrby-500/30 flex items-center justify-center text-nrby-400">
              <MapPin className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                {isEditing ? 'Edit Smartpin' : 'Save Smartpin'}
              </h3>
              <p className="text-xs text-surface-400">
                {isEditing ? 'Update smartpin details and status' : 'Define details for this field marker'}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-surface-400 hover:text-white p-1 rounded-lg hover:bg-surface-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulario contenido (montado limpio cada vez que abre el modal) */}
        <FormContent
          key={initialData?.name ?? defaultSuggestedName ?? 'new-pin'}
          isEditing={isEditing}
          initialData={initialData}
          defaultSuggestedName={defaultSuggestedName}
          onSave={onSave}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
};
