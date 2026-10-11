import React, { useState } from 'react';
import {
  LifeBuoy,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  User,
  MessageSquare,
  AlertTriangle,
  Send
} from 'lucide-react';
import { SupportTicket } from '../../types/admin';

interface AdminSupportTicketsViewProps {
  tickets: SupportTicket[];
  onUpdateTicketStatus: (ticketId: string, status: SupportTicket['status']) => void;
}

export const AdminSupportTicketsView: React.FC<AdminSupportTicketsViewProps> = ({
  tickets: initialTickets,
  onUpdateTicketStatus,
}) => {
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | SupportTicket['status']>('ALL');

  const handleStatusChange = (ticketId: string, newStatus: SupportTicket['status']) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
    );
    onUpdateTicketStatus(ticketId, newStatus);
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase tracking-wider font-mono">
              Clinical & Patient Helpdesk
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">Support Inquiries & Incident Triage</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage wearable sync issues, doctor EHR integration requests, and account verification tickets.
          </p>
        </div>

        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 font-mono text-xs flex items-center gap-3">
          <div>
            <span className="text-slate-500 block text-[10px]">Open Tickets</span>
            <span className="text-amber-400 font-bold">
              {tickets.filter((t) => t.status === 'OPEN').length}
            </span>
          </div>
          <div className="w-px h-6 bg-slate-800" />
          <div>
            <span className="text-slate-500 block text-[10px]">Avg SLA</span>
            <span className="text-emerald-400 font-bold">&lt; 2.4 hrs</span>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search tickets by subject, patient email, ticket #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          {(['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as any)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                statusFilter === status
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {status.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Ticket List */}
      <div className="space-y-3">
        {filteredTickets.map((ticket) => (
          <div
            key={ticket.id}
            className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold text-teal-400">
                  {ticket.ticketNumber}
                </span>
                <span className="font-bold text-white text-sm">
                  {ticket.subject}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    ticket.priority === 'URGENT'
                      ? 'bg-rose-500/20 text-rose-300'
                      : ticket.priority === 'HIGH'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {ticket.priority}
                </span>
              </div>

              <div className="text-xs text-slate-400 flex flex-wrap items-center gap-4">
                <span>User: <strong className="text-slate-200">{ticket.userEmail}</strong></span>
                <span>Category: <strong className="text-slate-300">{ticket.category.replace(/_/g, ' ')}</strong></span>
                <span>Assigned: <strong className="text-slate-300">{ticket.assignedAgent}</strong></span>
              </div>

              <div className="text-[10px] text-slate-500 font-mono">
                Opened: {new Date(ticket.createdAt).toLocaleString()}
              </div>
            </div>

            {/* Quick Status Control */}
            <div className="flex items-center gap-2 shrink-0">
              <select
                value={ticket.status}
                onChange={(e) => handleStatusChange(ticket.id, e.target.value as any)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-teal-500"
              >
                <option value="OPEN">Status: OPEN</option>
                <option value="IN_PROGRESS">Status: IN PROGRESS</option>
                <option value="RESOLVED">Status: RESOLVED</option>
                <option value="CLOSED">Status: CLOSED</option>
              </select>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
