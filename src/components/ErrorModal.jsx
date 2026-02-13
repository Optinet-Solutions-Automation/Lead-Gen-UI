import { useEffect, useRef } from 'react'
import { Modal } from 'bootstrap'

function ErrorModal({ show, onHide, data }) {
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
    <div className="modal fade" ref={modalRef} tabIndex="-1" aria-labelledby="errorModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title" id="errorModalLabel">Submission Error</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {data && (
              <>
                <p><strong>Keyword:</strong> {data.keyword}</p>
                <p><strong>Country:</strong> {data.country}</p>
                <hr />
                <p className="text-danger mb-0"><strong>Note:</strong> There was an error sending to the webhook.</p>
              </>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ErrorModal
