import { Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import noteService from "../../services/noteService";
import tagService from "../../services/tagService";
import { getUsers } from "../../services/userService";
import { INote, ITag, IUser } from "../../types";
import { useAuth } from "../../hooks/useAuth";

interface NoteModalProps {
  show: boolean;
  onHide: () => void;
  note: INote | null;
  onSave: () => void;
}

const NoteModal = ({ show, onHide, note, onSave }: NoteModalProps) => {
  const { user: currentUser } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [visibleTo, setVisibleTo] = useState<string[]>([]);

  const [allTags, setAllTags] = useState<ITag[]>([]);
  const [allUsers, setAllUsers] = useState<IUser[]>([]);

  const [newTagName, setNewTagName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [titleError, setTitleError] = useState<string | null>(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags.filter(Boolean).map((t: ITag) => t._id));
      setVisibleTo(note.visibleTo.filter(Boolean).map((u: IUser) => u._id));
    } else {
      setTitle("");
      setContent("");
      setTags([]);
      setVisibleTo(currentUser ? [currentUser._id] : []);
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
  }, [note, show, currentUser]);

  const handleSave = async () => {
    if (!title.trim()) {
      setTitleError("El título es obligatorio.");
      return;
    }
    setTitleError(null);

    try {
      setIsSaving(true);
    const noteData = { title, content, tags, visibleTo };
    if (note) {
      await noteService.updateNote(note._id, noteData);
    } else {
      await noteService.createNote(noteData);
    }
    onSave();
    onHide();
    } finally {
      setIsSaving(false);
    }
  };

  const handleUserVisibilityChange = (userId: string) => {
    if (currentUser && userId === currentUser._id) return; // No permitir desmarcarse a uno mismo

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
    <Modal show={show} onHide={onHide} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>{note ? "Editar Nota" : "Crear Nota"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={7}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Título</Form.Label>
                <Form.Control
                  type="text"
                  value={title}
                  placeholder="Escribí un título claro y corto..."
                  isInvalid={!!titleError}
                  onChange={(e) => setTitle(e.target.value)}
                  autoFocus
                />
                {titleError && (
                  <Form.Control.Feedback type="invalid">
                    {titleError}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Contenido</Form.Label>
                <div className="border rounded" style={{ minHeight: 200 }}>
                  <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    style={{ height: 170 }}
                  />
                </div>
              </Form.Group>
            </Col>

            <Col md={5}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Visible para</Form.Label>
                <Form.Text className="d-block mb-2 text-muted">
                  Elegí quiénes pueden ver esta nota.
                </Form.Text>
                <div
                  className="border rounded p-2"
                  style={{ maxHeight: "180px", overflowY: "auto" }}
                >
                  {allUsers.map((user: IUser) => (
                    <Form.Check
                      key={user._id}
                      type="checkbox"
                      className="mb-1"
                      label={
                        user.name +
                        (currentUser?._id === user._id ? " (Vos)" : "")
                      }
                      checked={visibleTo.includes(user._id)}
                      disabled={currentUser?._id === user._id}
                      onChange={() => handleUserVisibilityChange(user._id)}
                    />
                  ))}
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Etiquetas</Form.Label>
                <Form.Text className="d-block mb-2 text-muted">
                  Usá etiquetas para agrupar y encontrar notas rápido.
                </Form.Text>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {allTags.map((tag: ITag) => {
                    const isSelected = tags.includes(tag._id);
                    return (
                      <Button
                        key={tag._id}
                        size="sm"
                        variant={isSelected ? "primary" : "outline-secondary"}
                        onClick={() =>
                          setTags((prev) =>
                            isSelected
                              ? prev.filter((id) => id !== tag._id)
                              : [...prev, tag._id]
                          )
                        }
                        className="px-2 py-1 rounded-pill"
                      >
                        {tag.name}
                      </Button>
                    );
                  })}
                </div>
                <div className="d-flex mt-3">
                  <Form.Control
                    type="text"
                    placeholder="Nueva etiqueta"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={handleCreateTag}
                    className="ms-2"
                  >
                    Crear
                  </Button>
                </div>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isSaving}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                className="me-2"
              />
              Guardando...
            </>
          ) : (
            "Guardar"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NoteModal;
