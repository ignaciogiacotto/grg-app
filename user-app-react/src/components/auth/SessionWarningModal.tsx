import { useEffect, useState } from "react";
import { Modal, Button, ProgressBar } from "react-bootstrap";
import { Clock, LogOut, RefreshCw } from "lucide-react";

interface SessionWarningModalProps {
  show: boolean;
  onContinue: () => void;
  onLogout: () => void;
  duration?: number; // duración en segundos (default 60)
}

const SessionWarningModal = ({
  show,
  onContinue,
  onLogout,
  duration = 60,
}: SessionWarningModalProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (show) {
      setTimeLeft(duration);
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            onLogout(); // auto-cierre si se acaba el tiempo
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [show, duration, onLogout]);

  const progress = (timeLeft / duration) * 100;

  return (
    <Modal show={show} centered backdrop="static" keyboard={false}>
      <Modal.Header className="d-flex align-items-center">
        <Clock className="me-2 text-warning" size={24} />
        <Modal.Title className="fw-bold">
          Su sesión está a punto de expirar
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="mb-2">
          <strong>Atención:</strong> su sesión finalizará en menos de {timeLeft}{" "}
          segundos.
        </p>
        <p>¿Desea continuar en la sesión o cerrar ahora?</p>

        {/* Barra de progreso animada */}
        <ProgressBar
          now={progress}
          variant={progress > 30 ? "success" : "danger"}
          animated
          striped
          className="mt-3"
        />
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="outline-danger"
          onClick={onLogout}
          className="d-flex align-items-center">
          <LogOut size={16} className="me-2" />
          Cerrar Sesión
        </Button>
        <Button
          variant="success"
          onClick={onContinue}
          className="d-flex align-items-center">
          <RefreshCw size={16} className="me-2" />
          Continuar Sesión
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SessionWarningModal;
