import { useEffect, useRef } from 'react'
import { Modal } from 'bootstrap'

function LoadingModal({ show }) {
  const modalRef = useRef(null)
  const bsModalRef = useRef(null)

  useEffect(() => {
    if (modalRef.current) {
      bsModalRef.current = new Modal(modalRef.current, {
        backdrop: 'static',
        keyboard: false
      })
    }

    return () => {
      if (bsModalRef.current) {
        bsModalRef.current.dispose()
      }
    }
  }, [])

  useEffect(() => {
    if (bsModalRef.current) {
      if (show) {
        bsModalRef.current.show()
      } else {
        bsModalRef.current.hide()
      }
    }
  }, [show])

  return (
    <div className="modal fade" ref={modalRef} tabIndex="-1" aria-labelledby="loadingModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-body text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="loading-text">Processing your request...</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingModal
