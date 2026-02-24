import React, { useEffect, useState, useMemo } from "react";
import { Row, Col, Card, Placeholder } from "react-bootstrap";
import noteService from "../../services/noteService";
import NoteCard from "./NoteCard";
import { INote } from "../../types";
import { useAuth } from "../../hooks/useAuth";
import { useNotesQuery } from "../../hooks/useNotes";

interface NoteListProps {
  onEdit: (note: INote) => void;
  onDelete: (id: string) => void;
  selectedTag: string;
}

const NoteList = ({ onEdit, onDelete, selectedTag }: NoteListProps) => {
  const { user } = useAuth();
  const { data: notes = [], isLoading: loading } = useNotesQuery();

  // Mark unread notes as read
  useEffect(() => {
    if (user && notes.length > 0) {
      const unreadNotes = notes.filter(
        (note: INote) => note.readBy && !note.readBy.includes(user._id)
      );
      
      if (unreadNotes.length > 0) {
        Promise.all(
          unreadNotes.map((note: INote) => noteService.markAsRead(note._id))
        ).catch(err => console.error("Error marking notes as read:", err));
      }
    }
  }, [user, notes]);

  const filteredNotes = useMemo(() => {
    if (selectedTag) {
      return notes.filter((note) => note.tags.some((tag) => tag._id === selectedTag));
    }
    return notes;
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
