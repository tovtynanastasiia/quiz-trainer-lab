import React from "react";

interface Mode {
  name: string;
  emoji: string;
}

interface ModePickerProps {
  modes: Record<string, Mode>;
  value: string;
  onChange: (mode: string) => void;
}

const ModePicker: React.FC<ModePickerProps> = ({ modes, value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Режим тренування</label>
      <select className="select" value={value} onChange={(e) => onChange(e.target.value)}>
        {Object.entries(modes).map(([key, mode]) => (
          <option key={key} value={key}>
            {mode.emoji} {mode.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ModePicker;
