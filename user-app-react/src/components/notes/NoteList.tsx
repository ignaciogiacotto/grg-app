import React, { useEffect, useState } from "react";
import { Row, Col, Card, Placeholder } from "react-bootstrap";
import noteService from "../../services/noteService";
import NoteCard from "./NoteCard";
import { INote } from "../../types";

interface NoteListProps {
  onEdit: (note: INote) => void;
  onDelete: (id: string) => void;
  selectedTag: string;
}

const NoteList = ({ onEdit, onDelete, selectedTag }: NoteListProps) => {
  const [notes, setNotes] = useState<INote[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<INote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const fetchedNotes = await noteService.getNotes();
        setNotes(fetchedNotes);
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  useEffect(() => {
    if (selectedTag) {
      setFilteredNotes(
        notes.filter((note) => note.tags.some((tag) => tag._id === selectedTag))
      );
    } else {
      setFilteredNotes(notes);
    }
  }, [selectedTag, notes]);

  return (
    <Row>
      {loading
        ? Array.from({ length: 6 }).map((_, idx) => (
            <Col key={idx} xs={12} sm={6} md={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Placeholder as={Card.Title} animation="glow">
                    <Placeholder xs={8} />
                  </Placeholder>
                  <Placeholder as={Card.Text} animation="glow">
                    <Placeholder xs={7} /> <Placeholder xs={4} />{" "}
                    <Placeholder xs={4} /> <Placeholder xs={6} />{" "}
                    <Placeholder xs={8} />
                  </Placeholder>
                  <Placeholder.Button variant="primary" xs={4} className="me-2" />
                  <Placeholder.Button variant="danger" xs={4} />
                </Card.Body>
              </Card>
            </Col>
          ))
        : filteredNotes.map((note) => (
            <Col key={note._id} xs={12} sm={6} md={4} className="mb-4">
              <NoteCard note={note} onEdit={onEdit} onDelete={onDelete} />
            </Col>
          ))}
    </Row>
  );
};

export default NoteList;
