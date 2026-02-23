import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { INote } from "../../types";
import { format } from "date-fns";
import { useAuth } from "../../hooks/useAuth";

interface NoteCardProps {
  note: INote;
  onEdit: (note: INote) => void;
  onDelete: (id: string) => void;
}

const NoteCard = ({ note, onEdit, onDelete }: NoteCardProps) => {
  const { user } = useAuth();
  const isUnread = user && note.readBy && !note.readBy.includes(user._id);

  return (
    <Card className={`shadow-sm h-100 d-flex flex-column ${isUnread ? 'border-primary' : ''}`} style={{ borderWidth: isUnread ? '2px' : '1px' }}>
      <Card.Body className="d-flex flex-column">
        <div className="mb-2">
          <div className="d-flex justify-content-between align-items-start">
            <Card.Title>{note.title}</Card.Title>
            {isUnread && (
              <Badge bg="primary" pill>
                NUEVA
              </Badge>
            )}
          </div>
          <div
            style={{ whiteSpace: "pre-line" }}
            dangerouslySetInnerHTML={{ __html: note.content }}
          />
        </div>

        <div className="mb-2 mt-auto">
          {note.tags.map((tag) => (
            <Badge key={tag._id} bg="secondary" className="me-1">
              {tag.name}
            </Badge>
          ))}
        </div>
      </Card.Body>
      <Card.Footer className="bg-white border-0 d-flex justify-content-start gap-2">
        <Button variant="outline-primary" size="sm" onClick={() => onEdit(note)}>
          <i className="bi bi-pencil"></i>
        </Button>
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => onDelete(note._id)}
        >
          <i className="bi bi-trash"></i>
        </Button>
        <small className="text-muted ms-auto align-self-center">
          {format(new Date(note.createdAt), "dd/MM/yyyy")}
        </small>
      </Card.Footer>
    </Card>
  );
};

export default NoteCard;
