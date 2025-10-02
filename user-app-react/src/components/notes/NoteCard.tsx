import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { INote } from "../../types";
import { format } from "date-fns";

interface NoteCardProps {
  note: INote;
  onEdit: (note: INote) => void;
  onDelete: (id: string) => void;
}

const NoteCard = ({ note, onEdit, onDelete }: NoteCardProps) => {
  return (
    <Card className="shadow-sm h-100 d-flex flex-column">
      <Card.Body className="d-flex flex-column">
        <div className="mb-2">
          <Card.Title>{note.title}</Card.Title>
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
