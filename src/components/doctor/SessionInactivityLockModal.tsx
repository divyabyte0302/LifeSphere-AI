import React, { useState, useEffect } from 'react';
import { Lock, ShieldAlert, KeyRound, CheckCircle2 } from 'lucide-react';

interface SessionInactivityLockModalProps {
  isLocked: boolean;
  onUnlock: (pin: string) => boolean;
}

export const SessionInactivityLockModal: React.FC<SessionInactivityLockModalProps> = ({
  isLocked,
  onUnlock,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isLocked) return null;

  const handleAttemptUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const success = onUnlock(pinInput);
    if (success) {
      setPinInput('');
    } else {
      setErrorMsg('Invalid PIN or expired session. Default PIN: 1234');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in zoom-in duration-200">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Lock className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Doctor Portal Session Locked
          </h3>
          <p className="text-xs text-slate-400">
            15-minute inactivity threshold reached. Re-enter your clinical security PIN to unlock patient records.
          </p>
        </div>

        <form onSubmit={handleAttemptUnlock} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-slate-400 uppercase flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
              <span>Security PIN</span>
            </label>
            <input
              type="password"
              maxLength={6}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="••••"
              autoFocus
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-center text-lg text-white font-mono tracking-widest placeholder-slate-700 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono text-center flex items-center justify-center gap-1.5">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-cyan-500/20 transition-all"
          >
            Unlock Session
          </button>
        </form>
      </div>
    </div>
  );
};
