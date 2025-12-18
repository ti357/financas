
import React, { useState } from 'react';
import { Github, GitCommit, GitPullRequest, CheckCircle2, Loader2, Code, Terminal } from 'lucide-react';
import { Transaction } from '../types';

interface GithubSyncModalProps {
  onClose: () => void;
  onSuccess: () => void;
  data: Transaction[];
}

const GithubSyncModal: React.FC<GithubSyncModalProps> = ({ onClose, onSuccess, data }) => {
  const [step, setStep] = useState<'form' | 'syncing' | 'success' | 'error'>('form');
  const [commitMsg, setCommitMsg] = useState(`Update code and data: ${data.length} transactions stored`);
  const [logs, setLogs] = useState('');

  const handleSync = async () => {
    setStep('syncing');
    setLogs('');

    try {
      const response = await fetch('http://localhost:3001/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: commitMsg })
      });

      const result = await response.json();

      if (!result.success && !result.message.includes('Nothing to commit')) {
        throw new Error(result.error || 'Server reported failure');
      }

      setLogs(result.logs || 'Sync completed successfully.');
      setStep('success');
      setTimeout(() => {
        onSuccess();
      }, 2500);

    } catch (err: any) {
      console.error('Sync failed:', err);
      setStep('error');
      setLogs(err.message || 'Network error: ensure npm run dev is running correctly.');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-[70]">
      <div className="bg-[#0d1117] text-[#c9d1d9] w-full max-w-lg rounded-2xl shadow-2xl border border-[#30363d] overflow-hidden">
        {/* Header */}
        <div className="bg-[#161b22] p-4 border-b border-[#30363d] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Github size={20} className="text-white" />
            <span className="font-semibold text-white">Full Project Sync</span>
          </div>
          <button onClick={onClose} className="text-[#8b949e] hover:text-white transition-colors">✕</button>
        </div>

        <div className="p-6">
          {step === 'form' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-[#161b22] rounded-lg p-4 border border-[#30363d]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-indigo-500/10 p-2 rounded text-indigo-400">
                    <Terminal size={18} />
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-semibold">Local Git Bridge</h4>
                    <p className="text-xs text-[#8b949e]">This will sync ALL source code changes to GitHub.</p>
                  </div>
                </div>

                <div className="text-[11px] font-mono bg-[#0d1117] p-3 rounded border border-[#30363d] overflow-x-auto scrollbar-hide">
                  <div className="text-emerald-400">$ git add .</div>
                  <div className="text-emerald-400">$ git commit -m "{commitMsg.substring(0, 30)}..."</div>
                  <div className="text-emerald-400">$ git push origin main</div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8b949e] uppercase mb-2">Commit Message</label>
                <textarea
                  value={commitMsg}
                  onChange={(e) => setCommitMsg(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg p-3 text-sm text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none h-24 resize-none"
                />
              </div>

              <button
                onClick={handleSync}
                className="w-full bg-[#238636] hover:bg-[#2ea043] text-white py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <GitCommit size={18} />
                Sync to GitHub
              </button>
            </div>
          )}

          {step === 'syncing' && (
            <div className="py-12 text-center space-y-6 animate-in fade-in duration-300">
              <Loader2 size={64} className="text-indigo-500 animate-spin mx-auto" />
              <div className="space-y-2">
                <h4 className="text-xl font-bold text-white">Running Git Commands...</h4>
                <p className="text-sm text-[#8b949e]">Please wait while the server processes your request.</p>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in duration-500">
              <div className="bg-emerald-500/10 p-4 rounded-full inline-block">
                <CheckCircle2 size={64} className="text-emerald-500" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-white">Project Synced!</h4>
                <p className="text-sm text-[#8b949e] px-8">All code and data have been pushed to main.</p>
              </div>
              <div className="bg-[#161b22] mt-4 mx-4 p-3 rounded text-[10px] text-[#8b949e] font-mono text-left max-h-32 overflow-auto">
                {logs}
              </div>
            </div>
          )}

          {step === 'error' && (
            <div className="py-8 text-center space-y-4 animate-in fade-in duration-300">
              <div className="bg-red-500/10 p-4 rounded-full inline-block">
                <CheckCircle2 size={64} className="text-red-500 rotate-45" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-bold text-white">Sync Failed</h4>
                <p className="text-sm text-red-300 px-4">{logs}</p>
              </div>
              <div className="pt-4">
                <button
                  onClick={() => setStep('form')}
                  className="bg-[#21262d] hover:bg-[#30363d] text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-[#161b22] p-3 px-6 text-[10px] text-[#8b949e] border-t border-[#30363d] flex justify-between">
          <span>Branch: main</span>
          <span>Remote: origin/bank-fv</span>
        </div>
      </div>
    </div>
  );
};

export default GithubSyncModal;
