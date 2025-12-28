
import React, { useState } from 'react';
import { ApplicationStep, FormData, AIReviewResult } from './types';
import { INITIAL_FORM_DATA, NATIONALITIES, PURPOSES, STEPS } from './constants';
import { StepProgressBar } from './components/StepProgressBar';
import { reviewApplicationWithAI } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<ApplicationStep>(ApplicationStep.START);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [aiReview, setAiReview] = useState<AIReviewResult | null>(null);
  const [loading, setLoading] = useState(false);

  const updateFormData = (fields: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...fields }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleAIReview = async () => {
    setLoading(true);
    const result = await reviewApplicationWithAI(formData);
    setAiReview(result);
    setLoading(false);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(ApplicationStep.SUBMITTED);
    }, 1500);
  };

  const renderStepContent = () => {
    switch (step) {
      case ApplicationStep.START:
        return (
          <div className="text-center space-y-8 py-12 animate-in fade-in zoom-in duration-500">
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <img src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=800" alt="South Africa" className="rounded-3xl shadow-2xl w-full max-w-2xl object-cover h-72 group-hover:scale-[1.02] transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-3xl flex items-end p-8">
                  <p className="text-white text-left font-bold text-lg">Gateway to the Rainbow Nation</p>
                </div>
              </div>
            </div>
            <div className="space-y-4 px-4">
              <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Official South Africa e-Visa</h1>
              <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Apply for your South African travel authorization in minutes. Our intelligent system ensures your data is accurate and secure.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 px-6">
              <button onClick={nextStep} className="w-full sm:w-auto px-10 py-4 md:py-5 bg-emerald-600 text-white font-bold rounded-2xl shadow-xl hover:bg-emerald-700 transition-all transform hover:-translate-y-1 active:scale-95">
                Apply Now
              </button>
              <button className="w-full sm:w-auto px-10 py-4 md:py-5 bg-white text-slate-700 border-2 border-slate-200 font-bold rounded-2xl shadow-md hover:bg-slate-50 hover:border-slate-300 transition-all">
                Retrieve Application
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 text-left max-w-5xl mx-auto">
              {[
                { title: 'Secure Hosting', desc: 'Encrypted using RSA-4096 and AES-256 standards.', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
                { title: 'AI Validation', desc: 'Real-time feedback to prevent errors and delays.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                { title: 'Official Status', desc: 'Authorized Department of Home Affairs partner.', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' }
              ].map((feature, i) => (
                <div key={i} className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-5">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={feature.icon} /></svg>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case ApplicationStep.PERSONAL_INFO:
        return (
          <div className="max-w-3xl mx-auto bg-white p-6 md:p-12 rounded-3xl shadow-sm border border-slate-100 animate-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <span className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-lg flex-shrink-0 flex items-center justify-center text-sm">1</span>
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormGroup label="First Name(s)" value={formData.firstName} onChange={v => updateFormData({ firstName: v })} placeholder="As in passport" />
              <FormGroup label="Last Name / Surname" value={formData.lastName} onChange={v => updateFormData({ lastName: v })} placeholder="As in passport" />
              <FormGroup label="Date of Birth" value={formData.dob} onChange={v => updateFormData({ dob: v })} type="date" />
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Nationality</label>
                <select value={formData.nationality} onChange={e => updateFormData({ nationality: e.target.value })} className="w-full p-4 rounded-xl border bg-slate-50 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer">
                  <option value="">Select Nationality</option>
                  {NATIONALITIES.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <FormGroup label="Email Address" value={formData.email} onChange={v => updateFormData({ email: v })} placeholder="user@example.com" type="email" />
              <FormGroup label="Phone Number" value={formData.phone} onChange={v => updateFormData({ phone: v })} placeholder="+1 234 567 890" />
            </div>
          </div>
        );

      case ApplicationStep.PASSPORT_INFO:
        return (
          <div className="max-w-3xl mx-auto bg-white p-6 md:p-12 rounded-3xl shadow-sm border border-slate-100 animate-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <span className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-lg flex-shrink-0 flex items-center justify-center text-sm">2</span>
              Passport Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <FormGroup label="Passport Number" value={formData.passportNumber} onChange={v => updateFormData({ passportNumber: v })} placeholder="A1234567" extraClass="uppercase font-mono" />
              </div>
              <FormGroup label="Date of Issue" value={formData.passportIssueDate} onChange={v => updateFormData({ passportIssueDate: v })} type="date" />
              <FormGroup label="Date of Expiry" value={formData.passportExpiryDate} onChange={v => updateFormData({ passportExpiryDate: v })} type="date" />
            </div>
            <div className="mt-8 p-4 bg-amber-50 rounded-xl flex gap-3 text-amber-800 text-sm">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
              Passport must be valid for at least 30 days after your intended date of departure from South Africa.
            </div>
          </div>
        );

      case ApplicationStep.TRAVEL_INFO:
        return (
          <div className="max-w-3xl mx-auto bg-white p-6 md:p-12 rounded-3xl shadow-sm border border-slate-100 animate-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <span className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-lg flex-shrink-0 flex items-center justify-center text-sm">3</span>
              Travel Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormGroup label="Intended Arrival" value={formData.arrivalDate} onChange={v => updateFormData({ arrivalDate: v })} type="date" />
              <FormGroup label="Intended Departure" value={formData.departureDate} onChange={v => updateFormData({ departureDate: v })} type="date" />
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-700">Purpose of Visit</label>
                <select value={formData.purposeOfVisit} onChange={e => updateFormData({ purposeOfVisit: e.target.value })} className="w-full p-4 rounded-xl border bg-slate-50 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all">
                  {PURPOSES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-700">Accommodation Address in South Africa</label>
                <textarea rows={3} value={formData.accommodationAddress} onChange={e => updateFormData({ accommodationAddress: e.target.value })} placeholder="Full address including ZIP/City" className="w-full p-4 rounded-xl border bg-slate-50 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all" />
              </div>
            </div>
          </div>
        );

      case ApplicationStep.SECURITY_QUESTIONS:
        return (
          <div className="max-w-3xl mx-auto bg-white p-6 md:p-12 rounded-3xl shadow-sm border border-slate-100 animate-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <span className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-lg flex-shrink-0 flex items-center justify-center text-sm">4</span>
              Security & Eligibility
            </h2>
            <div className="space-y-6">
              {[
                { key: 'criminalRecord', label: 'Have you ever been convicted of a criminal offense?' },
                { key: 'previousDeportation', label: 'Have you ever been deported from any country?' },
                { key: 'healthConditions', label: 'Are you traveling from a Yellow Fever endemic zone?' }
              ].map(q => (
                <div key={q.key} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-colors gap-4">
                  <span className="text-slate-800 font-bold max-w-md">{q.label}</span>
                  <div className="flex gap-2">
                    <button onClick={() => updateFormData({ [q.key]: true })} className={`px-6 py-2.5 rounded-xl font-bold border-2 transition-all ${formData[q.key as keyof FormData] === true ? 'bg-red-500 border-red-500 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}>Yes</button>
                    <button onClick={() => updateFormData({ [q.key]: false })} className={`px-6 py-2.5 rounded-xl font-bold border-2 transition-all ${formData[q.key as keyof FormData] === false ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}>No</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case ApplicationStep.REVIEW:
        return (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Final Verification</h2>
              <button onClick={handleAIReview} disabled={loading} className="w-full md:w-auto group relative flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl shadow-xl hover:bg-indigo-700 disabled:opacity-50 transition-all font-bold overflow-hidden">
                {loading ? <LoadingSpinner /> : <AIIcon />}
                {loading ? 'AI Reviewing...' : 'Run Smart AI Review'}
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform" />
              </button>
            </div>

            {aiReview && (
              <div className={`p-8 rounded-3xl border-2 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500 ${aiReview.status === 'valid' ? 'bg-emerald-50 border-emerald-200' :
                  aiReview.status === 'warning' ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'
                }`}>
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className={`p-4 rounded-2xl shadow-sm ${aiReview.status === 'valid' ? 'bg-emerald-200 text-emerald-800' :
                      aiReview.status === 'warning' ? 'bg-amber-200 text-amber-800' : 'bg-red-200 text-red-800'
                    }`}>
                    <StatusIcon status={aiReview.status} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-extrabold text-xl mb-2 text-slate-900">AI Assistant Summary</h3>
                    <p className="text-slate-700 mb-6 text-lg leading-relaxed">{aiReview.summary}</p>
                    {aiReview.suggestions.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Recommended Actions</p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {aiReview.suggestions.map((s, i) => (
                            <li key={i} className="flex gap-2 text-slate-600 text-sm bg-white/50 p-3 rounded-xl border border-slate-200/50">
                              <span className="text-indigo-500 font-bold">•</span> {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
              <div className="bg-slate-900 px-6 md:px-8 py-5 text-white font-bold flex justify-between items-center">
                <span className="text-base md:text-lg">Application Draft</span>
                <span className="px-3 py-1 bg-white/20 rounded-lg text-[10px] md:text-xs font-mono">ID: {Math.floor(Math.random() * 900000 + 100000)}</span>
              </div>
              <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 md:gap-y-8">
                <SummaryItem label="Applicant Name" value={`${formData.firstName} ${formData.lastName}`} />
                <SummaryItem label="Citizenship" value={formData.nationality} />
                <SummaryItem label="Document No." value={formData.passportNumber} />
                <SummaryItem label="Travel Dates" value={`${formData.arrivalDate} to ${formData.departureDate}`} />
                <SummaryItem label="Contact Info" value={formData.email} />
                <SummaryItem label="Purpose" value={formData.purposeOfVisit} />
                <div className="md:col-span-2 border-t pt-8 space-y-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Declarations Check</p>
                  <div className="flex flex-wrap gap-3">
                    <StatusBadge label="No Criminal History" value={!formData.criminalRecord} />
                    <StatusBadge label="No Prior Deportation" value={!formData.previousDeportation} />
                    <StatusBadge label="Endemic Zone Health" value={!formData.healthConditions} />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 bg-indigo-50/50 rounded-3xl border border-indigo-100 flex items-start gap-4">
              <input type="checkbox" id="declaration" className="mt-1.5 w-5 h-5 md:w-6 md:h-6 rounded-md accent-indigo-600 cursor-pointer flex-shrink-0" />
              <label htmlFor="declaration" className="text-xs md:text-sm text-slate-700 leading-relaxed font-medium cursor-pointer select-none">
                I hereby certify that all information in this application is accurate and true. I understand that misrepresentation may lead to immediate visa cancellation and permanent ban from South Africa. I agree to the processing of my biometric data.
              </label>
            </div>
          </div>
        );

      case ApplicationStep.PAYMENT:
        return (
          <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-500">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-100 relative overflow-hidden">
              {/* Decorative Gradient Line */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-gold-500 to-red-500" />

              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 flex justify-between items-center">
                Secure Checkout
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-3 md:h-4 opacity-50" alt="Visa" />
              </h2>

              <div className="flex flex-col md:flex-row gap-12">
                <div className="flex-1 space-y-6">
                  <form onSubmit={handlePaymentSubmit} className="space-y-6">
                    <FormGroup label="Cardholder Name" value={`${formData.firstName} ${formData.lastName}`} onChange={() => { }} placeholder="Full name as on card" />
                    <FormGroup label="Card Number" value="" onChange={() => { }} placeholder="0000 0000 0000 0000" />
                    <div className="grid grid-cols-2 gap-4">
                      <FormGroup label="Expiry Date" value="" onChange={() => { }} placeholder="MM/YY" />
                      <FormGroup label="CVC" value="" onChange={() => { }} placeholder="123" />
                    </div>
                    <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3">
                      {loading ? <LoadingSpinner /> : (
                        <>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                          Complete Secure Payment
                        </>
                      )}
                    </button>
                  </form>
                </div>

                <div className="w-full md:w-64 bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Pricing Summary</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Visa Processing</span>
                        <span className="font-bold">$65.00</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Service Fee</span>
                        <span className="font-bold">$20.00</span>
                      </div>
                      <div className="border-t pt-3 flex justify-between items-end">
                        <span className="text-slate-900 font-bold">Total</span>
                        <span className="text-2xl font-extrabold text-emerald-600">$85.00</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 text-[10px] text-slate-400 leading-tight">
                    All transactions are protected by bank-grade security. By clicking "Complete Secure Payment", you authorize the charge to your card.
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-8 opacity-40">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-6" alt="PayPal" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-8" alt="MasterCard" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/39/Apple_Pay_logo.svg" className="h-8" alt="ApplePay" />
            </div>
          </div>
        );

      case ApplicationStep.SUBMITTED:
        return (
          <div className="text-center py-24 space-y-8 animate-in zoom-in duration-700">
            <div className="w-32 h-32 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 ring-[12px] ring-emerald-50 shadow-inner">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
            </div>
            <div className="space-y-4 px-4">
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Payment Confirmed!</h2>
              <p className="text-lg md:text-xl text-slate-600 max-w-xl mx-auto leading-relaxed">
                Your application <strong>ZA-992-102-XJ</strong> has been transmitted to the Pretoria Processing Center.
              </p>
            </div>
            <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-slate-100 max-w-lg mx-auto mt-12 space-y-6 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-slate-900 text-white text-[10px] md:text-xs font-bold uppercase rounded-full tracking-widest">Official Receipt</div>
              <div className="flex justify-between border-b border-slate-50 pb-5">
                <span className="text-slate-500 font-medium text-sm md:text-base">Processing Status</span>
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-[10px] font-bold uppercase tracking-wider">Queue: High Priority</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-5">
                <span className="text-slate-500 font-medium text-sm md:text-base">Estimated Review</span>
                <span className="font-extrabold text-slate-900 text-sm md:text-base">36 - 48 Business Hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium text-sm md:text-base">Update Channel</span>
                <span className="font-bold text-emerald-600 underline underline-offset-4 decoration-emerald-200 text-sm md:text-base break-all">{formData.email}</span>
              </div>
            </div>
            <button onClick={() => setStep(ApplicationStep.START)} className="mt-12 px-12 py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl active:scale-95">
              Back to Portal
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pb-32 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Dynamic Header */}
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setStep(ApplicationStep.START)}>
            <div className="w-11 h-11 bg-gradient-to-tr from-emerald-600 to-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:rotate-6 transition-transform">
              SA
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base font-black tracking-tight leading-none text-slate-900 uppercase">South Africa e-Visa</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Republic Department of Home Affairs</p>
            </div>
          </div>
          <nav className="hidden lg:flex gap-10 text-sm font-bold text-slate-600">
            {['Visa Types', 'Guidelines', 'Fee Table', 'Support'].map(item => (
              <a key={item} href="#" className="hover:text-emerald-600 transition-colors relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Portal Version</p>
              <p className="text-xs font-bold text-slate-800">2.5.0-PROTOTYPE</p>
            </div>
            <button className="p-2.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors border">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pt-16">
        {step !== ApplicationStep.START && step !== ApplicationStep.SUBMITTED && (
          <div className="mb-16">
            <StepProgressBar currentStep={step} />
          </div>
        )}

        <div className="min-h-[500px]">
          {renderStepContent()}
        </div>

        {/* Floating Navigation Controls */}
        {step !== ApplicationStep.START && step !== ApplicationStep.SUBMITTED && step !== ApplicationStep.PAYMENT && (
          <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 flex justify-center z-40">
            <div className="max-w-4xl w-full flex justify-between items-center bg-white/90 backdrop-blur-xl border border-slate-100 rounded-2xl md:rounded-[2rem] p-3 md:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
              <button
                onClick={prevStep}
                disabled={step === ApplicationStep.PERSONAL_INFO}
                className="px-4 md:px-8 py-3 md:py-3.5 rounded-xl md:rounded-2xl font-bold border-2 hover:bg-slate-50 disabled:opacity-20 transition-all flex items-center gap-2 text-sm md:text-base"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                <span className="hidden sm:inline">Previous</span>
              </button>
              <div className="flex gap-1.5 md:gap-2">
                {STEPS.slice(1, -1).map((_, i) => (
                  <div key={i} className={`h-1 md:h-1.5 rounded-full transition-all ${step === i + 1 ? 'w-6 md:w-8 bg-emerald-600' : 'w-1.5 md:w-2 bg-slate-200'}`} />
                ))}
              </div>
              <button
                onClick={nextStep}
                disabled={step === ApplicationStep.REVIEW && !aiReview}
                className={`px-6 md:px-12 py-3 md:py-3.5 rounded-xl md:rounded-2xl font-bold text-white shadow-xl transition-all flex items-center gap-2 active:scale-95 text-sm md:text-base ${step === ApplicationStep.REVIEW ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-900 hover:bg-slate-800'
                  } disabled:opacity-50`}
              >
                <span className="hidden sm:inline">{step === ApplicationStep.REVIEW ? 'Proceed to Payment' : 'Next Step'}</span>
                <span className="sm:hidden">{step === ApplicationStep.REVIEW ? 'Pay' : 'Next'}</span>
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Aesthetic Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[50%] h-[50%] bg-amber-500/5 rounded-full blur-[120px]" />
      </div>
    </div>
  );
};

// UI Sub-components
const FormGroup: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; extraClass?: string }> = ({ label, value, onChange, placeholder, type = 'text', extraClass = '' }) => (
  <div className="space-y-2">
    <label className="text-sm font-bold text-slate-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full p-4 rounded-xl border bg-slate-50 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-300 ${extraClass}`}
    />
  </div>
);

const SummaryItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="space-y-1 group">
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block transition-colors group-hover:text-indigo-500">{label}</span>
    <p className="text-slate-800 font-bold text-lg">{value || 'Not provided'}</p>
  </div>
);

const StatusBadge: React.FC<{ label: string; value: boolean }> = ({ label, value }) => (
  <div className={`px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-2.5 transition-all ${value ? 'bg-emerald-50 text-emerald-700 border-emerald-100 shadow-sm' : 'bg-red-50 text-red-700 border-red-100'
    }`}>
    <div className={`w-2 h-2 rounded-full animate-pulse ${value ? 'bg-emerald-500' : 'bg-red-500'}`} />
    {label}: {value ? 'PASS' : 'FLAGGED'}
  </div>
);

const LoadingSpinner = () => (
  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
);

const AIIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
);

const StatusIcon: React.FC<{ status: string }> = ({ status }) => {
  if (status === 'valid') return <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;
  return <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>;
};

export default App;
