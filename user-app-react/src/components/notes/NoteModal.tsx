import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import noteService from "../../services/noteService";
import tagService from "../../services/tagService";
import { getUsers } from "../../services/userService";
import { INote, ITag, IUser } from "../../types";

interface NoteModalProps {
  show: boolean;
  onHide: () => void;
  note: INote | null;
  onSave: () => void;
}

const NoteModal = ({ show, onHide, note, onSave }: NoteModalProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [visibleTo, setVisibleTo] = useState<string[]>([]);

  const [allTags, setAllTags] = useState<ITag[]>([]);
  const [allUsers, setAllUsers] = useState<IUser[]>([]);

  const [newTagName, setNewTagName] = useState("");

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags.map((t: ITag) => t._id));
      setVisibleTo(note.visibleTo.map((u: IUser) => u._id));
    } else {
      setTitle("");
      setContent("");
      setTags([]);
      setVisibleTo([]);
    }

    const fetchInitialData = async () => {
      const [usersResponse, tagsResponse] = await Promise.all([
        getUsers(0, 1000),
        tagService.getTags(),
      ]);
      setAllUsers(usersResponse.content);
      setAllTags(tagsResponse);

      if (!note) {
        setVisibleTo(usersResponse.content.map((u: IUser) => u._id));
      }
    };

    if (show) {
      fetchInitialData();
    }
  }, [note, show]);

  const handleSave = async () => {
    const noteData = { title, content, tags, visibleTo };
    if (note) {
      await noteService.updateNote(note._id, noteData);
    } else {
      await noteService.createNote(noteData);
    }
    onSave();
    onHide();
  };

  const handleUserVisibilityChange = (userId: string) => {
    setVisibleTo((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateTag = async () => {
    if (newTagName.trim() === "") return;
    const newTag = await tagService.createTag({ name: newTagName });
    setAllTags((prev) => [...prev, newTag]);
    setTags((prev) => [...prev, newTag._id]);
    setNewTagName("");
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{note ? "Editar Nota" : "Crear Nota"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Título */}
          <Form.Group className="mb-3">
            <Form.Label>Título</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Escribe un título..."
            />
          </Form.Group>

          {/* Contenido */}
          <Form.Group className="mb-3">
            <Form.Label>Contenido</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe el contenido de la nota..."
            />
          </Form.Group>

          {/* Visible para */}
          <Form.Group className="mb-3">
            <Form.Label>Visible para</Form.Label>
            <Row style={{ maxHeight: "150px", overflowY: "auto" }}>
              {allUsers.map((user: IUser) => (
                <Col xs={6} key={user._id}>
                  <Form.Check
                    type="checkbox"
                    label={user.name}
                    checked={visibleTo.includes(user._id)}
                    onChange={() => handleUserVisibilityChange(user._id)}
                  />
                </Col>
              ))}
            </Row>
          </Form.Group>

          {/* Etiquetas */}
          <Form.Group className="mb-3">
            <Form.Label>Etiquetas</Form.Label>
            <Form.Select
              multiple
              value={tags}
              onChange={(e) =>
                setTags(
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
            >
              {allTags.map((tag: ITag) => (
                <option key={tag._id} value={tag._id}>
                  {tag.name}
                </option>
              ))}
            </Form.Select>
            <div className="d-flex mt-2 gap-2">
              <Form.Control
                type="text"
                placeholder="Nueva etiqueta"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
              />
              <Button variant="outline-secondary" onClick={handleCreateTag}>
                <i className="bi bi-plus-lg"></i> Crear
              </Button>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={!title.trim()}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NoteModal;
