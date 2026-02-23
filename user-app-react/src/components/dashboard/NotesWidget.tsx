import React from "react";

interface NotesWidgetProps {
  unreadNotesCount: number;
}

const NotesWidget: React.FC<NotesWidgetProps> = ({ unreadNotesCount }) => {
  const isUnread = unreadNotesCount > 0;

  return (
    <div className={`card ${isUnread ? "border-warning bg-warning bg-opacity-10" : "bg-light"} shadow-sm mb-4`}>
      <div className="card-body">
        <h6 className="card-title d-flex justify-content-between align-items-center mb-3">
          <span>
            <i className="bi bi-journal-text me-2"></i>Notas
          </span>
          {isUnread && (
            <span className="badge bg-warning text-dark">
              {unreadNotesCount} nuevas
            </span>
          )}
        </h6>
        <p className="small text-muted mb-3">
          {isUnread
            ? `Tenés ${unreadNotesCount} notas pendientes de lectura.`
            : "No tenés notas nuevas por leer."}
        </p>
        <a href="/notes" className="btn btn-sm btn-outline-dark w-100">
          Ir a Notas
        </a>
      </div>
    </div>
  );
};

export default NotesWidget;
