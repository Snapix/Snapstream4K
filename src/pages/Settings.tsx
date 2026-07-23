import { Settings as SettingsIcon, Check } from 'lucide-react';
import { THEMES, useSettings } from '../contexts/SettingsContext';

export default function Settings() {
  const { settings, updateSettings } = useSettings();

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ scale: parseInt(e.target.value, 10) });
  };

  return (
    <div className="min-h-[80vh] px-4 md:px-8 lg:px-12 py-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <div className="bg-[var(--primary)] p-3 rounded-2xl text-[var(--primary-text)]">
          <SettingsIcon size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">Settings</h1>
      </div>

      <div className="flex flex-col gap-8">
        <section className="glass-panel p-6 md:p-8">
          <h2 className="text-xl font-black uppercase tracking-widest text-[var(--primary)] mb-6 border-b border-white/10 pb-4">
            Appearance
          </h2>
          
          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">UI Scaling</h3>
            <div className="flex items-center gap-6">
              <input 
                type="range" 
                min="20" 
                max="100" 
                step="20" 
                value={settings.scale}
                onChange={handleScaleChange}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--primary)]"
              />
              <span className="font-black text-xl w-16 text-right">{settings.scale}%</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 font-bold mt-2 px-1">
              <span>20%</span>
              <span>40%</span>
              <span>60%</span>
              <span>80%</span>
              <span>100%</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Color Theme</h3>
            <div className="flex flex-wrap gap-4">
              {THEMES.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => updateSettings({ theme: theme.name })}
                  className="w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 border-2"
                  style={{ 
                    backgroundColor: theme.primary,
                    borderColor: settings.theme === theme.name ? 'white' : 'transparent',
                    boxShadow: settings.theme === theme.name ? `0 0 20px ${theme.primary}80` : 'none'
                  }}
                  title={theme.name}
                  aria-label={`Select ${theme.name} theme`}
                >
                  {settings.theme === theme.name && <Check size={24} color={theme.primaryText} />}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="glass-panel p-6 md:p-8">
          <h2 className="text-xl font-black uppercase tracking-widest text-[var(--primary)] mb-6 border-b border-white/10 pb-4">
            Playback
          </h2>
          
          <div className="flex items-center gap-4">
             <button
               onClick={() => updateSettings({ dontShowExternalPlayerPopup: !settings.dontShowExternalPlayerPopup })}
               className={`w-6 h-6 rounded flex items-center justify-center border-2 transition-colors ${
                 settings.dontShowExternalPlayerPopup 
                   ? 'bg-[var(--primary)] border-[var(--primary)]' 
                   : 'border-gray-500 hover:border-white'
               }`}
             >
               {settings.dontShowExternalPlayerPopup && <Check size={16} className="text-[var(--primary-text)]" />}
             </button>
             <div 
               className="cursor-pointer"
               onClick={() => updateSettings({ dontShowExternalPlayerPopup: !settings.dontShowExternalPlayerPopup })}
             >
               <h3 className="font-bold text-base md:text-lg">Don't show external player popup</h3>
               <p className="text-sm text-gray-400">Directly open magnet links without asking.</p>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
}
