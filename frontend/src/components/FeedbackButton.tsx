import { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const mailto = () => {
    const subject = encodeURIComponent('Bible App Feedback');
    const body = encodeURIComponent(
      `Feedback:\n\n${message}\n\n---\nURL: ${window.location.href}\nUser-Agent: ${navigator.userAgent}`
    );
    window.location.href = `mailto:asjames18@proton.me?subject=${subject}&body=${body}`;
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-40 right-4 md:bottom-6 md:right-6 z-50 btn-touch p-3 rounded-full shadow-lg bg-theme-accent text-white hover:bg-theme-accent-dark transition-colors"
        title="Send feedback"
      >
        <MessageSquare className="w-5 h-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md bg-theme-surface text-theme-text rounded-xl shadow-xl p-4 border border-theme-border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Send Feedback</h3>
              <button onClick={() => setOpen(false)} className="p-2 hover:text-theme-accent">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-theme-text/70 mb-3">
              Share a bug, idea, or general feedback. Your current page and device info will be included.
            </p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your feedback here..."
              className="w-full h-32 p-3 rounded-lg border border-theme-border bg-theme-bg focus:outline-none focus:ring-2 focus:ring-theme-accent"
            />
            <div className="mt-3 flex gap-2 justify-end">
              <button onClick={() => setOpen(false)} className="px-4 py-2 rounded-lg bg-theme-surface hover:bg-theme-surface-hover border border-theme-border">
                Cancel
              </button>
              <button onClick={mailto} disabled={!message.trim()} className="px-4 py-2 rounded-lg bg-theme-accent text-white disabled:bg-gray-400">
                Send via Email
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


