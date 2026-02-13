import { useState, useEffect } from 'react'
import { COUNTRIES } from '../config/countries'
import LoadingModal from './LoadingModal'
import SuccessModal from './SuccessModal'
import ErrorModal from './ErrorModal'

function LeadGenForm() {
  const [formData, setFormData] = useState({
    keyword: '',
    country: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [submittedData, setSubmittedData] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const pollStatus = async (keyword, countryText) => {
    const maxAttempts = 120
    let attempts = 0

    const poll = setInterval(async () => {
      attempts++

      try {
        const response = await fetch('/api/check-status')
        const data = await response.json()

        if (data.found) {
          clearInterval(poll)
          setIsLoading(false)

          if (data.status === 'success') {
            setSubmittedData({ keyword, country: countryText })
            setShowSuccess(true)
            setFormData({ keyword: '', country: '' })
          } else {
            // Error from n8n workflow
            setSubmittedData({
              keyword,
              country: countryText,
              errorMessage: data.message || 'An error occurred in the workflow',
              failedNode: data.failed_node
            })
            setShowError(true)
          }
        } else if (attempts >= maxAttempts) {
          // Timeout error
          clearInterval(poll)
          setIsLoading(false)
          setSubmittedData({
            keyword,
            country: countryText,
            errorMessage: 'Request timed out. Please try again.',
            failedNode: null
          })
          setShowError(true)
        }
      } catch (error) {
        console.error('Error polling status:', error)
      }
    }, 1000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const countryText = COUNTRIES.find(c => c.value === formData.country)?.name || ''

    setIsLoading(true)

    const webhookData = {
      keyword: formData.keyword,
      countryValue: formData.country,
      countryText: countryText
    }

    console.log('Sending data to webhook:', webhookData)

    try {
      const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      })

      console.log('Webhook initial response received')
      pollStatus(formData.keyword, countryText)
    } catch (error) {
      console.error('Error sending to webhook:', error)
      setIsLoading(false)
      setSubmittedData({ keyword: formData.keyword, country: countryText })
      setShowError(true)
    }
  }

  return (
    <>
      <div className="container">
        <h1>Google Lead Generation</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="keyword">Keyword</label>
            <input
              type="text"
              id="keyword"
              name="keyword"
              placeholder="Enter keyword..."
              value={formData.keyword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="country">Country</label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            >
              <option value="">Select a country...</option>
              {COUNTRIES.map((country) => (
                <option
                  key={country.name}
                  value={country.value}
                  disabled={country.disabled}
                >
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={isLoading}>
            <span>{isLoading ? 'Submitting...' : 'Submit'}</span>
            {isLoading && (
              <span className="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true"></span>
            )}
          </button>
        </form>
      </div>

      <LoadingModal show={isLoading} />
      <SuccessModal
        show={showSuccess}
        onHide={() => setShowSuccess(false)}
        data={submittedData}
      />
      <ErrorModal
        show={showError}
        onHide={() => setShowError(false)}
        data={submittedData}
      />
    </>
  )
}

export default LeadGenForm
