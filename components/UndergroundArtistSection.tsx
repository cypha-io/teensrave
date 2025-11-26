import React, { useState, useRef, useEffect } from 'react';

const UndergroundArtistSection: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [formData, setFormData] = useState({
    stageName: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
    city: '',
    performanceCategory: '',
    styleDescription: '',
    performanceExperience: '',
    performanceType: '',
    groupName: '',
    socialMediaHandles: '',
    performanceLink: '',
    previousPerformances: '',
    performanceImageUrl: '',
    signedToManagement: '',
    managementInfo: '',
    motivation: '',
    uniqueSellingPoint: '',
    goals: '',
    agreementsAccepted: false,
  });
  const formRef = useRef<HTMLFormElement>(null);

  // Check if all required fields are filled
  const isFormValid = () => {
    return (
      formData.stageName.trim() !== '' &&
      formData.age.trim() !== '' &&
      formData.gender.trim() !== '' &&
      formData.phone.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.city.trim() !== '' &&
      formData.performanceCategory.trim() !== '' &&
      formData.styleDescription.trim() !== '' &&
      formData.performanceExperience.trim() !== '' &&
      formData.performanceType.trim() !== '' &&
      formData.socialMediaHandles.trim() !== '' &&
      formData.performanceLink.trim() !== '' &&
      formData.previousPerformances.trim() !== '' &&
      formData.signedToManagement.trim() !== '' &&
      formData.motivation.trim() !== '' &&
      formData.uniqueSellingPoint.trim() !== '' &&
      formData.goals.trim() !== '' &&
      formData.agreementsAccepted
    );
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);
    setSubmitError(null);

    const data = {
      stageName: formData.stageName,
      age: parseInt(formData.age),
      gender: formData.gender,
      phone: formData.phone,
      email: formData.email,
      city: formData.city,
      performanceCategory: formData.performanceCategory,
      styleDescription: formData.styleDescription,
      performanceExperience: formData.performanceExperience,
      performanceType: formData.performanceType,
      groupName: formData.groupName,
      socialMediaHandles: formData.socialMediaHandles,
      performanceLink: formData.performanceLink,
      previousPerformances: formData.previousPerformances,
      performanceImageUrl: formData.performanceImageUrl,
      signedToManagement: formData.signedToManagement === 'yes',
      motivation: formData.motivation,
      uniqueSellingPoint: formData.uniqueSellingPoint,
      goals: formData.goals,
      agreementsAccepted: formData.agreementsAccepted,
    };

    try {
      const response = await fetch('/api/artists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit application');
      }

      setSubmitMessage('Your artist application has been submitted successfully! We will review your application and get back to you soon.');
      formRef.current?.reset();
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
            ARTIST REGISTRATION
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-6">
            Are you an underground artist ready to showcase your talent? Apply to perform at TeensRave 2025 and be part of an unforgettable music experience.
          </p>
        </div>

        {/* Expand/Collapse Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => setIsFormExpanded(!isFormExpanded)}
            className="bg-green-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl text-lg flex items-center justify-center mx-auto"
          >
            {isFormExpanded ? 'Hide Artist Application Form' : 'Join to Perform'}
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

        <div className="max-w-4xl mx-auto">
          {/* Registration Form */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-lg">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Apply to Perform</h3>
            
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
            
            <form ref={formRef} className="space-y-8" onSubmit={handleSubmit}>
              {/* Personal Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label htmlFor="stageName" className="block text-sm font-medium text-gray-700 mb-2">
                      Stage Name / Artist Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="stageName"
                      name="stageName"
                      value={formData.stageName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                      placeholder="Your stage name or artist name"
                    />
                  </div>
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                      Age <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      min="13"
                      max="25"
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                      placeholder="18"
                    />
                  </div>
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="non-binary">Non-binary</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                      placeholder="Your city"
                    />
                  </div>
                </div>
              </div>

              {/* Artist Profile */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Artist Profile</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label htmlFor="performanceCategory" className="block text-sm font-medium text-gray-700 mb-2">
                      Performance Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="performanceCategory"
                      name="performanceCategory"
                      value={formData.performanceCategory}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    >
                      <option value="">Select category</option>
                      <option value="rapper">Rapper/MC</option>
                      <option value="singer">Singer/Vocalist</option>
                      <option value="producer">Producer</option>
                      <option value="dj">DJ</option>
                      <option value="instrumentalist">Instrumentalist</option>
                      <option value="band">Band/Group</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="styleDescription" className="block text-sm font-medium text-gray-700 mb-2">
                      Style Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="styleDescription"
                      name="styleDescription"
                      value={formData.styleDescription}
                      onChange={handleInputChange}
                      rows={3}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 resize-none"
                      placeholder="Describe your musical style, influences, and what makes your sound unique..."
                    ></textarea>
                  </div>
                  <div>
                    <label htmlFor="performanceExperience" className="block text-sm font-medium text-gray-700 mb-2">
                      Performance Experience <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="performanceExperience"
                      name="performanceExperience"
                      value={formData.performanceExperience}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    >
                      <option value="">Select experience level</option>
                      <option value="beginner">Beginner (0-2 years)</option>
                      <option value="intermediate">Intermediate (3-5 years)</option>
                      <option value="experienced">Experienced (6-10 years)</option>
                      <option value="professional">Professional (10+ years)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="performanceType" className="block text-sm font-medium text-gray-700 mb-2">
                      Performance Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="performanceType"
                      name="performanceType"
                      value={formData.performanceType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    >
                      <option value="">Select performance type</option>
                      <option value="solo">Solo</option>
                      <option value="duo">Duo</option>
                      <option value="group">Group/Band</option>
                      <option value="dj-set">DJ Set</option>
                      <option value="live-band">Live Band</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-2">
                      Group/Band Name (if applicable) <span className="text-gray-500 text-xs">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      id="groupName"
                      name="groupName"
                      value={formData.groupName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                      placeholder="Your group or band name"
                    />
                  </div>
                </div>
              </div>

              {/* Portfolio & Links */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio & Links</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label htmlFor="socialMediaHandles" className="block text-sm font-medium text-gray-700 mb-2">
                      Social Media Handles <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="socialMediaHandles"
                      name="socialMediaHandles"
                      value={formData.socialMediaHandles}
                      onChange={handleInputChange}
                      rows={3}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 resize-none"
                      placeholder="Instagram: @yourhandle&#10;Twitter: @yourhandle&#10;TikTok: @yourhandle&#10;Etc."
                    ></textarea>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="performanceLink" className="block text-sm font-medium text-gray-700 mb-2">
                      Performance Link <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      id="performanceLink"
                      name="performanceLink"
                      value={formData.performanceLink}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                      placeholder="https://youtube.com/watch?v=... or https://soundcloud.com/..."
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="previousPerformances" className="block text-sm font-medium text-gray-700 mb-2">
                      Previous Performances <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="previousPerformances"
                      name="previousPerformances"
                      value={formData.previousPerformances}
                      onChange={handleInputChange}
                      rows={3}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 resize-none"
                      placeholder="List your previous performances, venues, festivals, etc."
                    ></textarea>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="performanceImageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                      Performance Image URL <span className="text-gray-500 text-xs">(Optional)</span>
                    </label>
                    <input
                      type="url"
                      id="performanceImageUrl"
                      name="performanceImageUrl"
                      value={formData.performanceImageUrl}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                      placeholder="https://example.com/your-performance-image.jpg"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Are you signed to management? <span className="text-red-500">*</span>
                    </label>
                    <div className="flex space-x-6">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="signedToManagement"
                          value="yes"
                          checked={formData.signedToManagement === 'yes'}
                          onChange={handleInputChange}
                          required
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="signedToManagement"
                          value="no"
                          checked={formData.signedToManagement === 'no'}
                          onChange={handleInputChange}
                          required
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">No</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Motivation */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Motivation</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="motivation" className="block text-sm font-medium text-gray-700 mb-2">
                      Why do you want to perform at TeensRave? <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="motivation"
                      name="motivation"
                      value={formData.motivation}
                      onChange={handleInputChange}
                      rows={4}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 resize-none"
                      placeholder="Tell us why you're passionate about performing at TeensRave and what you hope to achieve..."
                    ></textarea>
                  </div>
                  <div>
                    <label htmlFor="uniqueSellingPoint" className="block text-sm font-medium text-gray-700 mb-2">
                      What makes you unique? <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="uniqueSellingPoint"
                      name="uniqueSellingPoint"
                      value={formData.uniqueSellingPoint}
                      onChange={handleInputChange}
                      rows={3}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 resize-none"
                      placeholder="What sets you apart from other artists? What's your unique selling point?"
                    ></textarea>
                  </div>
                  <div>
                    <label htmlFor="goals" className="block text-sm font-medium text-gray-700 mb-2">
                      What are your goals for this performance? <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="goals"
                      name="goals"
                      value={formData.goals}
                      onChange={handleInputChange}
                      rows={3}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 resize-none"
                      placeholder="What do you hope to achieve by performing at TeensRave?"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Agreements */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Agreements</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="agreementsAccepted"
                      name="agreementsAccepted"
                      checked={formData.agreementsAccepted}
                      onChange={handleInputChange}
                      required
                      className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="agreementsAccepted" className="text-sm text-gray-600">
                      I agree to the terms and conditions of TeensRave 2025. I understand that submission does not guarantee a performance slot, and all decisions are at the discretion of the TeensRave team. I confirm that I am between 13-25 years old and authorized to submit this application. <span className="text-red-500">*</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="text-center pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || !isFormValid()}
                  className="bg-green-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors duration-200 shadow-lg hover:shadow-xl text-lg flex items-center justify-center"
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
                {!isFormValid() && !isSubmitting && (
                  <p className="text-red-500 text-sm mt-2">Please fill in all required fields marked with *</p>
                )}
              </div>
            </form>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default UndergroundArtistSection;