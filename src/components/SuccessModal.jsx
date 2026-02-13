import { useEffect, useRef } from 'react'
import { Modal } from 'bootstrap'

function SuccessModal({ show, onHide, data }) {
  const modalRef = useRef(null)
  const bsModalRef = useRef(null)

  useEffect(() => {
    if (modalRef.current) {
      bsModalRef.current = new Modal(modalRef.current)

      modalRef.current.addEventListener('hidden.bs.modal', onHide)
    }

    return () => {
      if (modalRef.current) {
        modalRef.current.removeEventListener('hidden.bs.modal', onHide)
      }
      if (bsModalRef.current) {
        bsModalRef.current.dispose()
      }
    }
  }, [onHide])

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
    <div className="modal fade" ref={modalRef} tabIndex="-1" aria-labelledby="successModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="successModalLabel">Form Submitted Successfully</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {data && (
              <>
                <p><strong>Keyword:</strong> {data.keyword}</p>
                <p><strong>Country:</strong> {data.country}</p>
              </>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuccessModal
