import React, { useState, useRef } from 'react';

const MediaAccreditationSection: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);
    setSubmitError(null);

    const formData = new FormData(e.currentTarget);

    // Validate required fields
    const requiredFields = [
      'fullName', 'email', 'phone', 'mediaOutlet', 'mediaType',
      'portfolioWebsite', 'socialMediaHandles', 'accreditationCategory',
      'previousCoverage', 'audienceReach', 'audienceDescription', 'signature'
    ];

    const missingFields = requiredFields.filter(field => !formData.get(field));

    // Check if agreements are accepted
    if (formData.get('agreementsAccepted') !== 'true') {
      missingFields.push('agreements');
    }

    // Check if at least 2 interested aspects are selected
    const interestedAspects = formData.getAll('interestedAspects');
    if (interestedAspects.length < 2) {
      missingFields.push('interestedAspects (at least 2 required)');
    }

    if (missingFields.length > 0) {
      setSubmitError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      setIsSubmitting(false);
      return;
    }

    // Convert interested aspects to JSON
    formData.set('interestedAspects', JSON.stringify(interestedAspects));

    try {
      const response = await fetch('/api/media-accreditation', {
        method: 'POST',
        body: formData, // Send as FormData for file upload support
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit application');
      }

      setSubmitMessage('Your media accreditation application has been submitted successfully! We will review your application and get back to you soon.');
      e.currentTarget.reset();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred while submitting your application.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <section
      className="py-20 bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url('bg.webp')`
      }}
    >
      {/* Background overlay for better text readability */}
      <div className="absolute inset-0 bg-white/60"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight uppercase stroke-1 sm:stroke-2"
            style={{
              color: 'transparent',
              WebkitTextStrokeWidth: '1px',
              WebkitTextStroke: '1px green',
              textTransform: 'uppercase',
              whiteSpace: 'pre',
              marginTop: 0,
              marginBottom: '3px',
              fontWeight: 800,
              lineHeight: '.9',
              fontFamily: 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif',
            }}
          >
            MEDIA ACCREDITATION
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Register for press credentials to cover TeensRave 2025. Get exclusive access to interviews, behind-the-scenes content, and festival updates.
          </p>
        </div>

        {/* Expand/Collapse Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => setIsFormExpanded(!isFormExpanded)}
            className="bg-green-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl text-lg flex items-center justify-center mx-auto"
          >
            {isFormExpanded ? 'Hide Media Accreditation Form' : 'Become a Media'}
            <svg
              className={`ml-2 w-5 h-5 transition-transform duration-200 ${isFormExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Collapsible Content */}
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isFormExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Accreditation Benefits */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Accreditation Benefits</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Exclusive Access</h4>
                  <p className="text-gray-600">VIP access to all festival areas and backstage zones</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Press Kit Access</h4>
                  <p className="text-gray-600">Download high-resolution photos, press releases, and media assets</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Artist Interviews</h4>
                  <p className="text-gray-600">Pre-arranged interview opportunities with featured artists</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Media Parking</h4>
                  <p className="text-gray-600">Designated parking spaces for media vehicles</p>
                </div>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 border border-gray-200 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Apply for Accreditation</h3>
            
            {submitMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">{submitMessage}</p>
              </div>
            )}
            
            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{submitError}</p>
              </div>
            )}
            
            <form ref={formRef} className="space-y-8" onSubmit={handleSubmit} encType="multipart/form-data">
              {/* PERSONAL INFORMATION */}
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">Personal Information</h4>

                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    placeholder="+233 XXX XXX XXX"
                  />
                </div>
              </div>

              {/* MEDIA ORGANIZATION DETAILS */}
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">Media Organization Details</h4>

                <div>
                  <label htmlFor="mediaOutlet" className="block text-sm font-medium text-gray-700 mb-2">
                    Media Outlet/Organization Name *
                  </label>
                  <input
                    type="text"
                    id="mediaOutlet"
                    name="mediaOutlet"
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    placeholder="If you're independent or a freelancer, tell us your creator name or the platform you publish on"
                  />
                </div>

                <div>
                  <label htmlFor="mediaType" className="block text-sm font-medium text-gray-700 mb-2">
                    Type of Media *
                  </label>
                  <select
                    id="mediaType"
                    name="mediaType"
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
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
                  <label htmlFor="portfolioWebsite" className="block text-sm font-medium text-gray-700 mb-2">
                    Official Portfolio/Website Link *
                  </label>
                  <input
                    type="url"
                    id="portfolioWebsite"
                    name="portfolioWebsite"
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div>
                  <label htmlFor="socialMediaHandles" className="block text-sm font-medium text-gray-700 mb-2">
                    Social Media Handles *
                  </label>
                  <textarea
                    id="socialMediaHandles"
                    name="socialMediaHandles"
                    required
                    rows={3}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 resize-none"
                    placeholder="Instagram, TikTok, X (Twitter), etc. handles to show proof of your works"
                  ></textarea>
                </div>

                <div>
                  <label htmlFor="accreditationCategory" className="block text-sm font-medium text-gray-700 mb-2">
                    Media Accreditation Category *
                  </label>
                  <select
                    id="accreditationCategory"
                    name="accreditationCategory"
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
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
                <h4 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">Coverage Details</h4>

                <div>
                  <label htmlFor="previousCoverage" className="block text-sm font-medium text-gray-700 mb-2">
                    Have you covered Teensrave or other events before? *
                  </label>
                  <textarea
                    id="previousCoverage"
                    name="previousCoverage"
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 resize-none"
                    placeholder="If yes, tell us which ones or share links to past coverage"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What aspect of Teensrave are you most interested in capturing? (at least 2) *
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
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-gray-700">{aspect}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="audienceReach" className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Audience Reach/Audience/Followers *
                  </label>
                  <input
                    type="text"
                    id="audienceReach"
                    name="audienceReach"
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    placeholder="e.g., 10,000 followers, 50,000 monthly views"
                  />
                </div>

                <div>
                  <label htmlFor="audienceDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Tell us about your audience *
                  </label>
                  <textarea
                    id="audienceDescription"
                    name="audienceDescription"
                    required
                    rows={3}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 resize-none"
                    placeholder="Whether you have a large audience or not, tell us about your audience demographics and engagement"
                  ></textarea>
                </div>
              </div>

              {/* SUPPORTING DOCUMENTS */}
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">Supporting Documents</h4>

                <div>
                  <label htmlFor="proofOfWork" className="block text-sm font-medium text-gray-700 mb-2">
                    Letter of Assignment/ Proof of Work *
                  </label>
                  <input
                    type="file"
                    id="proofOfWork"
                    name="proofOfWork"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.mp4,.mov,.avi"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Upload a valid assignment letter and if you&apos;re a creator without official credentials, you can upload a recent piece of your work; an article, video, photo, or post that showcase your coverage style. Max 1 GB.
                  </p>
                </div>
              </div>

              {/* AGREEMENTS */}
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">Agreements</h4>

                <div className="space-y-3">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="agreementsAccepted"
                      value="true"
                      required
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      I understand that accreditation is non-transferrable *
                    </span>
                  </label>

                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="agreementsAccepted"
                      value="true"
                      required
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      I&apos;ll follow all Teensrave media and safety guidelines *
                    </span>
                  </label>

                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="agreementsAccepted"
                      value="true"
                      required
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      I&apos;ll credit Teensrave appropriately in all coverage *
                    </span>
                  </label>

                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="agreementsAccepted"
                      value="true"
                      required
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Teensrave reserves the right to revoke media access if guidelines are breached *
                    </span>
                  </label>

                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="agreementsAccepted"
                      value="true"
                      required
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      I consent to my data being used by Teensrave for accreditation and official communications *
                    </span>
                  </label>
                </div>

                <div>
                  <label htmlFor="signature" className="block text-sm font-medium text-gray-700 mb-2">
                    Type your full name as your signature *
                  </label>
                  <input
                    type="text"
                    id="signature"
                    name="signature"
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    placeholder="Type your full name here"
                  />
                </div>
              </div>

              {/* FAQ Section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">FAQ - What You Need To Know</h4>
                <div className="space-y-3 text-sm text-gray-700">
                  <p><strong>When do applications close?</strong> 5th December 2025</p>
                  <p><strong>We encourage early submissions as slots are limited!</strong></p>
                  <p><strong>When will I hear back?</strong> Successful applicants will receive a confirmation email from our media team by 10th December 2025. If you don&apos;t hear back after that date, unfortunately, it means we couldn&apos;t accommodate your application this time but we&apos;d still love to rave with you at the festival.</p>
                  <p><strong>What&apos;s not included in accreditations?</strong> Personal transportation, accommodation and meals</p>
                  <p><strong>Access to backstage(unless officially pre-approved)</strong></p>
                  <p><strong>How do I collect my media pass?</strong> You will receive full collection details in your confirmation email.</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            </form>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default MediaAccreditationSection;