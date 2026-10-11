import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, CheckCircle2, ShieldCheck, AlertCircle, KeyRound, LogOut } from 'lucide-react';
import { ScreenModule } from '../../types';

interface AuthScreenProps {
  type: 'login' | 'registration' | 'forgot_password' | 'logout';
  setScreen: (module: ScreenModule) => void;
  showSnackbar: (msg: string) => void;
}

export const AuthScreens: React.FC<AuthScreenProps> = ({ type, setScreen, showSnackbar }) => {
  const [email, setEmail] = useState('dr.vance@lifesphere.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [name, setName] = useState('Dr. Jordan Vance');
  const [code, setCode] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (type === 'logout') {
    return (
      <div className="p-6 max-w-md mx-auto my-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/30 flex items-center justify-center mx-auto">
          <LogOut className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white">Sign Out of LifeSphere AI?</h3>
        <p className="text-xs text-slate-400">
          Your local biometric encryption keys will be secured. Continuous background environmental polling will be paused until next sign in.
        </p>
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => {
              showSnackbar('Successfully logged out.');
              setScreen('login');
            }}
            className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition-colors"
          >
            Confirm Logout
          </button>
          <button
            onClick={() => setScreen('dashboard')}
            className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs border border-slate-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (type === 'forgot_password') {
    return (
      <div className="p-6 max-w-md mx-auto space-y-5 my-8">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-2">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Reset Account Password</h2>
          <p className="text-xs text-slate-400">Enter your clinical ID or registered email to receive a recovery token.</p>
        </div>

        {submitted ? (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-xs text-emerald-200">
              Recovery instructions sent to <strong>{email}</strong>. Check your inbox and follow the secure link.
            </p>
            <button
              onClick={() => setScreen('login')}
              className="text-xs text-emerald-400 font-bold hover:underline"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
              showSnackbar('Password reset instructions dispatched.');
            }}
            className="space-y-4"
          >
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Registered Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-emerald-500/20"
            >
              Send Password Reset Link
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setScreen('login')}
                className="text-xs text-slate-400 hover:text-white"
              >
                Remembered password? <span className="text-emerald-400 font-semibold">Sign In</span>
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  if (type === 'registration') {
    return (
      <div className="p-6 max-w-md mx-auto space-y-5 my-6">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-2">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Create LifeSphere AI Account</h2>
          <p className="text-xs text-slate-400">Join the personal health and environmental intelligence network.</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            showSnackbar('Account created successfully! Welcome to LifeSphere.');
            setScreen('dashboard');
          }}
          className="space-y-3"
        >
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex items-start gap-2 pt-1">
            <input type="checkbox" defaultChecked required className="accent-emerald-500 mt-0.5" />
            <span>I authorize HIPAA-compliant on-device processing of personal vitals and atmospheric telemetry.</span>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-emerald-500/20"
          >
            Create Encrypted Account
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setScreen('login')}
              className="text-xs text-slate-400 hover:text-white"
            >
              Already registered? <span className="text-emerald-400 font-semibold">Sign In</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Default: Login Screen
  return (
    <div className="p-6 max-w-md mx-auto space-y-5 my-8">
      <div className="text-center space-y-1">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-bold flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/20">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Sign In to LifeSphere AI</h2>
        <p className="text-xs text-slate-400">Personal Health & Environmental Intelligence Platform</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          showSnackbar('Signed in successfully.');
          setScreen('dashboard');
        }}
        className="space-y-3.5"
      >
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1">Email or Patient ID</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-slate-400">Password</label>
            <button
              type="button"
              onClick={() => setScreen('forgot_password')}
              className="text-[11px] text-emerald-400 hover:underline"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-emerald-500/20"
        >
          Sign In
        </button>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setScreen('registration')}
            className="text-xs text-slate-400 hover:text-white"
          >
            New to LifeSphere? <span className="text-emerald-400 font-semibold">Register Free</span>
          </button>
        </div>
      </form>
    </div>
  );
};
