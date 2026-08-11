'use client';

import React, { useState } from 'react';
import { Modal, Button, Input } from '@/common/components';
import apiClient from '@/api/axios';
import { toast } from 'sonner';
import { Send, Building, Phone, Mail } from 'lucide-react';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  machineId?: string;
  modelName?: string;
}

export function QuoteModal({ isOpen, onClose, machineId, modelName }: QuoteModalProps) {
  const [buyerName, setBuyerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiClient.post('/quotes', {
        buyerName,
        companyName,
        contactEmail,
        contactPhone,
        notes,
        items: machineId ? [{ machineId, quantity }] : [],
      });

      toast.success('B2B Quotation Lead submitted successfully! A representative will contact you.');
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit quote request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Request Official Quotation ${modelName ? `for ${modelName}` : ''}`}
      subtitle="Connect with verified machinery vendors for official pricing & procurement leads"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Your Full Name"
          required
          value={buyerName}
          onChange={(e) => setBuyerName(e.target.value)}
          placeholder="Rajesh Kumar"
        />

        <Input
          label="Company / Enterprise Name"
          required
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Kumar Infrastructure Pvt Ltd"
          leftIcon={<Building className="w-4 h-4" />}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Email Address"
            type="email"
            required
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="rajesh@company.com"
            leftIcon={<Mail className="w-4 h-4" />}
          />
          <Input
            label="Phone Number"
            type="tel"
            required
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            placeholder="+91 9876543210"
            leftIcon={<Phone className="w-4 h-4" />}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Quantity Required
          </label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Procurement Notes / Requirements
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Specify delivery timeline, location, or financing needs..."
            className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs placeholder:text-slate-400"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={loading}
          rightIcon={<Send className="w-4 h-4" />}
          className="w-full mt-2"
        >
          Submit Quote Lead
        </Button>
      </form>
    </Modal>
  );
}
