'use client';

import React, { useState } from 'react';
import StagedForm from './StagedForm';

const MediaAccreditationSection: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    mediaOutlet: '',
    mediaType: '',
    portfolioWebsite: '',
    socialMediaHandles: '',
    accreditationCategory: '',
    previousCoverage: '',
    interestedAspects: [] as string[],
    audienceReach: '',
    audienceDescription: '',
    proofOfWork: null as File | null,
    signature: '',
    agreementsAccepted: [] as string[],
  });
  const [formKey, setFormKey] = useState(0);

  // Check if all required fields are filled
  const isFormValid = () => {
    return (
      formData.fullName.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.phone.trim() !== '' &&
      formData.mediaOutlet.trim() !== '' &&
      formData.mediaType.trim() !== '' &&
      formData.portfolioWebsite.trim() !== '' &&
      formData.socialMediaHandles.trim() !== '' &&
      formData.accreditationCategory.trim() !== '' &&
      formData.previousCoverage.trim() !== '' &&
      formData.interestedAspects.length >= 1 &&
      formData.audienceReach.trim() !== '' &&
      formData.audienceDescription.trim() !== '' &&
      formData.signature.trim() !== '' &&
      formData.agreementsAccepted.length === 5
    );
  };

  // Get list of missing required fields
  const getMissingFields = (): string[] => {
    const missing: string[] = [];
    if (formData.fullName.trim() === '') missing.push('Full Name');
    if (formData.email.trim() === '') missing.push('Email');
    if (formData.phone.trim() === '') missing.push('Phone Number');
    if (formData.mediaOutlet.trim() === '') missing.push('Media Outlet');
    if (formData.mediaType.trim() === '') missing.push('Media Type');
    if (formData.portfolioWebsite.trim() === '') missing.push('Portfolio Website');
    if (formData.socialMediaHandles.trim() === '') missing.push('Social Media Handles');
    if (formData.accreditationCategory.trim() === '') missing.push('Accreditation Category');
    if (formData.previousCoverage.trim() === '') missing.push('Previous Coverage');
    if (formData.interestedAspects.length < 1) missing.push(`Interested Aspects (${formData.interestedAspects.length} selected)`);
    if (formData.audienceReach.trim() === '') missing.push('Audience Reach');
    if (formData.audienceDescription.trim() === '') missing.push('Audience Description');
    if (formData.signature.trim() === '') missing.push('Signature');
    if (formData.agreementsAccepted.length < 5) missing.push(`Agreements (${formData.agreementsAccepted.length}/5 checked)`);
    return missing;
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name === 'interestedAspects') {
      const checkbox = e.target as HTMLInputElement;
      const aspect = checkbox.value;
      setFormData(prev => ({
        ...prev,
        interestedAspects: checkbox.checked
          ? [...prev.interestedAspects, aspect]
          : prev.interestedAspects.filter(item => item !== aspect)
      }));
    } else if (name === 'agreementsAccepted') {
      const checkbox = e.target as HTMLInputElement;
      const agreement = checkbox.value;
      setFormData(prev => ({
        ...prev,
        agreementsAccepted: checkbox.checked
          ? [...prev.agreementsAccepted, agreement]
          : prev.agreementsAccepted.filter(item => item !== agreement)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      proofOfWork: file
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form before submission
    const errors = getMissingFields();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setValidationErrors([]);
    setIsSubmitting(true);
    setSubmitMessage(null);
    setSubmitError(null);

    // Create FormData for file upload support
    const submitData = new FormData();

    // Add all form data
    submitData.set('fullName', formData.fullName);
    submitData.set('email', formData.email);
    submitData.set('phone', formData.phone);
    submitData.set('mediaOutlet', formData.mediaOutlet);
    submitData.set('mediaType', formData.mediaType);
    submitData.set('portfolioWebsite', formData.portfolioWebsite);
    submitData.set('socialMediaHandles', formData.socialMediaHandles);
    submitData.set('accreditationCategory', formData.accreditationCategory);
    submitData.set('previousCoverage', formData.previousCoverage);
    submitData.set('interestedAspects', JSON.stringify(formData.interestedAspects));
    submitData.set('audienceReach', formData.audienceReach);
    submitData.set('audienceDescription', formData.audienceDescription);
    submitData.set('agreementsAccepted', JSON.stringify(formData.agreementsAccepted));
    submitData.set('signature', formData.signature);
    
    if (formData.proofOfWork) {
      submitData.set('proofOfWork', formData.proofOfWork);
    }

    try {
      const response = await fetch('/api/media-accreditation', {
        method: 'POST',
        body: submitData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit application');
      }

      setSubmitMessage('Your media accreditation application has been submitted successfully! We will review your application and get back to you soon.');
      setFormKey((key) => key + 1);
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        mediaOutlet: '',
        mediaType: '',
        portfolioWebsite: '',
        socialMediaHandles: '',
        accreditationCategory: '',
        previousCoverage: '',
        interestedAspects: [],
        audienceReach: '',
        audienceDescription: '',
        proofOfWork: null,
        signature: '',
        agreementsAccepted: [],
      });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred while submitting your application.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <section id="form" className="dark-form w-full scroll-mt-16 bg-black py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Accreditation Benefits */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">Accreditation Benefits</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Exclusive Access</h4>
                  <p className="text-neutral-400">VIP access to all festival areas and backstage zones</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Press Kit Access</h4>
                  <p className="text-neutral-400">Download high-resolution photos, press releases, and media assets</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Artist Interviews</h4>
                  <p className="text-neutral-400">Pre-arranged interview opportunities with featured artists</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Media Parking</h4>
                  <p className="text-neutral-400">Designated parking spaces for media vehicles</p>
                </div>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div data-form-card className="scroll-mt-28 rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Apply for Accreditation</h3>
            
            {submitMessage && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                <p className="text-green-300">{submitMessage}</p>
              </div>
            )}
            
            {submitError && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <p className="text-red-300">{submitError}</p>
              </div>
            )}
            
            <StagedForm
              key={formKey}
              stages={['Personal Information', 'Media Organization', 'Coverage Details', 'Supporting Documents', 'Agreements']}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              missingFields={validationErrors}
              validateStage={(stage) =>
                stage === 2 && formData.interestedAspects.length < 1 ? 'Please choose at least one aspect you want to capture.' : null
              }
              encType="multipart/form-data"
            >
              {/* PERSONAL INFORMATION */}
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-white border-b border-white/10 pb-2">Personal Information</h4>

                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-neutral-300 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-neutral-300 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30"
                    placeholder="+233 XXX XXX XXX"
                  />
                </div>
              </div>

              {/* MEDIA ORGANIZATION DETAILS */}
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-white border-b border-white/10 pb-2">Media Organization Details</h4>

                <div>
                  <label htmlFor="mediaOutlet" className="block text-sm font-medium text-neutral-300 mb-2">
                    Media Outlet/Organization Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="mediaOutlet"
                    name="mediaOutlet"
                    value={formData.mediaOutlet}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30"
                    placeholder="If you're independent or a freelancer, tell us your creator name or the platform you publish on"
                  />
                </div>

                <div>
                  <label htmlFor="mediaType" className="block text-sm font-medium text-neutral-300 mb-2">
                    Type of Media <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="mediaType"
                    name="mediaType"
                    value={formData.mediaType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30"
                  >
                    <option value="">Select media type</option>
                    <option value="TV">TV</option>
                    <option value="Radio">Radio</option>
                    <option value="Videographer">Videographer</option>
                    <option value="Photographer">Photographer</option>
                    <option value="Print/Online Publication">Print/Online Publication</option>
                    <option value="Content Creator">Content Creator</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="portfolioWebsite" className="block text-sm font-medium text-neutral-300 mb-2">
                    Official Portfolio/Website Link <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    id="portfolioWebsite"
                    name="portfolioWebsite"
                    value={formData.portfolioWebsite}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30"
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div>
                  <label htmlFor="socialMediaHandles" className="block text-sm font-medium text-neutral-300 mb-2">
                    Social Media Handles <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="socialMediaHandles"
                    name="socialMediaHandles"
                    value={formData.socialMediaHandles}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30 resize-none"
                    placeholder="Instagram, TikTok, X (Twitter), etc. handles to show proof of your works"
                  ></textarea>
                </div>

                <div>
                  <label htmlFor="accreditationCategory" className="block text-sm font-medium text-neutral-300 mb-2">
                    Media Accreditation Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="accreditationCategory"
                    name="accreditationCategory"
                    value={formData.accreditationCategory}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30"
                  >
                    <option value="">Select category</option>
                    <option value="Pre Festival Coverage">Pre Festival Coverage</option>
                    <option value="On Site Coverage (Event Day)">On Site Coverage (Event Day)</option>
                    <option value="Post Event Collaborations">Post Event Collaborations</option>
                    <option value="Documentary/Special Project">Documentary/Special Project</option>
                  </select>
                </div>
              </div>

              {/* COVERAGE DETAILS */}
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-white border-b border-white/10 pb-2">Coverage Details</h4>

                <div>
                  <label htmlFor="previousCoverage" className="block text-sm font-medium text-neutral-300 mb-2">
                    Have you covered Teensrave or other events before? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="previousCoverage"
                    name="previousCoverage"
                    value={formData.previousCoverage}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30 resize-none"
                    placeholder="If yes, tell us which ones or share links to past coverage"
                  ></textarea>
                </div>

                <div className={`p-4 rounded-xl ${
                  validationErrors.some(e => e.includes('Interested Aspects')) 
                    ? 'bg-red-500/10 border-2 border-red-500/30' 
                    : 'bg-white/5'
                }`}>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    What aspect of Teensrave are you most interested in capturing? (at least 1) <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    {[
                      'Performances',
                      'Culture and Community',
                      'Fashion and Lifestyle',
                      'Brand Activations',
                      'Other'
                    ].map((aspect) => (
                      <label key={aspect} className="flex items-center">
                        <input
                          type="checkbox"
                          name="interestedAspects"
                          value={aspect}
                          checked={formData.interestedAspects.includes(aspect)}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-green-400 focus:ring-green-500 border-white/15 rounded"
                        />
                        <span className="ml-2 text-neutral-300">{aspect}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="audienceReach" className="block text-sm font-medium text-neutral-300 mb-2">
                    Estimated Audience Reach/Audience/Followers <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="audienceReach"
                    name="audienceReach"
                    value={formData.audienceReach}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30"
                    placeholder="e.g., 10,000 followers, 50,000 monthly views"
                  />
                </div>

                <div>
                  <label htmlFor="audienceDescription" className="block text-sm font-medium text-neutral-300 mb-2">
                    Tell us about your audience <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="audienceDescription"
                    name="audienceDescription"
                    value={formData.audienceDescription}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30 resize-none"
                    placeholder="Whether you have a large audience or not, tell us about your audience demographics and engagement"
                  ></textarea>
                </div>
              </div>

              {/* SUPPORTING DOCUMENTS */}
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-white border-b border-white/10 pb-2">Supporting Documents</h4>

                <div>
                  <label htmlFor="proofOfWork" className="block text-sm font-medium text-neutral-300 mb-2">
                    Letter of Assignment/ Proof of Work *
                  </label>
                  <input
                    type="file"
                    id="proofOfWork"
                    name="proofOfWork"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.mp4,.mov,.avi"
                    className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-500/10 file:text-green-300 hover:file:bg-green-500/20"
                  />
                  <p className="mt-1 text-sm text-neutral-400">
                    Upload a valid assignment letter and if you&apos;re a creator without official credentials, you can upload a recent piece of your work; an article, video, photo, or post that showcase your coverage style. Max 1 GB.
                  </p>
                </div>
              </div>

              <div className="space-y-8">
              {/* AGREEMENTS */}
              <div className={`space-y-4 p-4 rounded-xl ${
                validationErrors.some(e => e.includes('Agreements'))
                  ? 'border-2 border-red-500/30 bg-red-500/10'
                  : 'bg-white/5'
              }`}>
                <h4 className="text-xl font-semibold text-white border-b border-white/10 pb-2">Agreements</h4>

                <div className="space-y-3">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="agreementsAccepted"
                      value="non-transferrable"
                      checked={formData.agreementsAccepted.includes('non-transferrable')}
                      onChange={handleInputChange}
                      required
                      className="h-4 w-4 text-green-400 focus:ring-green-500 border-white/15 rounded mt-1"
                    />
                    <span className="ml-2 text-sm text-neutral-300">
                      I understand that accreditation is non-transferrable <span className="text-red-500">*</span>
                    </span>
                  </label>

                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="agreementsAccepted"
                      value="follow-guidelines"
                      checked={formData.agreementsAccepted.includes('follow-guidelines')}
                      onChange={handleInputChange}
                      required
                      className="h-4 w-4 text-green-400 focus:ring-green-500 border-white/15 rounded mt-1"
                    />
                    <span className="ml-2 text-sm text-neutral-300">
                      I&apos;ll follow all Teensrave media and safety guidelines <span className="text-red-500">*</span>
                    </span>
                  </label>

                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="agreementsAccepted"
                      value="credit-teensrave"
                      checked={formData.agreementsAccepted.includes('credit-teensrave')}
                      onChange={handleInputChange}
                      required
                      className="h-4 w-4 text-green-400 focus:ring-green-500 border-white/15 rounded mt-1"
                    />
                    <span className="ml-2 text-sm text-neutral-300">
                      I&apos;ll credit Teensrave appropriately in all coverage <span className="text-red-500">*</span>
                    </span>
                  </label>

                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="agreementsAccepted"
                      value="revoke-access"
                      checked={formData.agreementsAccepted.includes('revoke-access')}
                      onChange={handleInputChange}
                      required
                      className="h-4 w-4 text-green-400 focus:ring-green-500 border-white/15 rounded mt-1"
                    />
                    <span className="ml-2 text-sm text-neutral-300">
                      Teensrave reserves the right to revoke media access if guidelines are breached <span className="text-red-500">*</span>
                    </span>
                  </label>

                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="agreementsAccepted"
                      value="data-consent"
                      checked={formData.agreementsAccepted.includes('data-consent')}
                      onChange={handleInputChange}
                      required
                      className="h-4 w-4 text-green-400 focus:ring-green-500 border-white/15 rounded mt-1"
                    />
                    <span className="ml-2 text-sm text-neutral-300">
                      I consent to my data being used by Teensrave for accreditation and official communications <span className="text-red-500">*</span>
                    </span>
                  </label>
                </div>

                <div>
                  <label htmlFor="signature" className="block text-sm font-medium text-neutral-300 mb-2">
                    Type your full name as your signature <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="signature"
                    name="signature"
                    value={formData.signature}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30"
                    placeholder="Type your full name here"
                  />
                </div>
              </div>

              {/* FAQ Section */}
              <div className="bg-white/5 p-6 rounded-xl">
                <h4 className="text-lg font-semibold text-white mb-4">FAQ - What You Need To Know</h4>
                <div className="space-y-3 text-sm text-neutral-300">
                  <p><strong>When do applications close?</strong> 15th December 2025</p>
                  <p><strong>We encourage early submissions as slots are limited!</strong></p>
                  <p><strong>When will I hear back?</strong> Successful applicants will receive a confirmation email from our media team by 20th December 2025. If you don&apos;t hear back after that date, unfortunately, it means we couldn&apos;t accommodate your application this time but we&apos;d still love to rave with you at the festival.</p>
                  <p><strong>What&apos;s not included in accreditations?</strong> Personal transportation, accommodation and meals</p>
                  <p><strong>Access to backstage(unless officially pre-approved)</strong></p>
                  <p><strong>How do I collect my media pass?</strong> You will receive full collection details in your confirmation email.</p>
                </div>
              </div>
              </div>
            </StagedForm>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MediaAccreditationSection;