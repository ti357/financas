
import React, { useState } from 'react';
import { Github, GitCommit, GitPullRequest, CheckCircle2, Loader2, Code } from 'lucide-react';
import { Transaction } from '../types';

interface GithubSyncModalProps {
  onClose: () => void;
  onSuccess: () => void;
  data: Transaction[];
}

const GithubSyncModal: React.FC<GithubSyncModalProps> = ({ onClose, onSuccess, data }) => {
  const [step, setStep] = useState<'form' | 'syncing' | 'success'>('form');
  const [commitMsg, setCommitMsg] = useState(`Update financials: ${data.length} transactions recorded`);
  const [progress, setProgress] = useState(0);

  const handleSync = async () => {
    setStep('syncing');
    
    // Simulating steps of git push
    for (let i = 0; i <= 100; i += 20) {
      setProgress(i);
      await new Promise(resolve => setTimeout(resolve, 400));
    }

    setStep('success');
    setTimeout(() => {
      onSuccess();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-[70]">
      <div className="bg-[#0d1117] text-[#c9d1d9] w-full max-w-lg rounded-2xl shadow-2xl border border-[#30363d] overflow-hidden">
        {/* Header Style GitHub */}
        <div className="bg-[#161b22] p-4 border-b border-[#30363d] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Github size={20} className="text-white" />
            <span className="font-semibold text-white">Commit to main</span>
          </div>
          <button onClick={onClose} className="text-[#8b949e] hover:text-white transition-colors">✕</button>
        </div>

        <div className="p-6">
          {step === 'form' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-[#161b22] rounded-lg p-4 border border-[#30363d]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-indigo-500/10 p-2 rounded text-indigo-400">
                    <Code size={18} />
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-semibold">Changes summary</h4>
                    <p className="text-xs text-[#8b949e]">{data.length} records ready to push to remote.</p>
                  </div>
                </div>
                
                <div className="text-[11px] font-mono bg-[#0d1117] p-3 rounded border border-[#30363d] overflow-x-auto scrollbar-hide">
                  <div className="text-emerald-400">+ transactions_dump.json</div>
                  <div className="text-[#8b949e]">@@ -1,4 +1,{data.length + 1} @@</div>
                  <div className="text-emerald-400">
                    {data.length > 0 ? 
                      `  { "id": "${data[0].id.substring(0,4)}...", "desc": "${data[0].description}" }` : 
                      "  // No changes detected"
                    }
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8b949e] uppercase mb-2">Commit Message</label>
                <textarea
                  value={commitMsg}
                  onChange={(e) => setCommitMsg(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg p-3 text-sm text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none h-24 resize-none"
                  placeholder="What did you change?"
                />
              </div>

              <button
                onClick={handleSync}
                className="w-full bg-[#238636] hover:bg-[#2ea043] text-white py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
              >
                <GitCommit size={18} />
                Commit and Push
              </button>
            </div>
          )}

          {step === 'syncing' && (
            <div className="py-12 text-center space-y-6 animate-in fade-in duration-300">
              <div className="relative inline-block">
                <Loader2 size={64} className="text-indigo-500 animate-spin mx-auto" />
                <GitPullRequest size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-bold text-white">Sincronizando...</h4>
                <p className="text-sm text-[#8b949e]">Fazendo upload das transações para branch main.</p>
              </div>
              <div className="max-w-xs mx-auto w-full bg-[#161b22] h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="py-12 text-center space-y-4 animate-in fade-in zoom-in duration-500">
              <div className="bg-emerald-500/10 p-4 rounded-full inline-block">
                <CheckCircle2 size={64} className="text-emerald-500" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-white">Push Successful!</h4>
                <p className="text-sm text-[#8b949e]">Seu repositório financeiro está atualizado.</p>
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
