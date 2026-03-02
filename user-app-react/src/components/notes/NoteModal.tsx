import { Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { useEffect, useState, useCallback } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import noteService from "../../services/noteService";
import tagService from "../../services/tagService";
import { getUsers } from "../../services/userService";
import { INote, ITag, IUser } from "../../types";
import { useAuth } from "../../hooks/auth/useAuth";
import { noteSchema, NoteInput } from "../../schemas/noteSchema";
import Swal from "sweetalert2";

interface NoteModalProps {
  show: boolean;
  onHide: () => void;
  note: INote | null;
  onSave: () => void;
}

const NoteModal = ({ show, onHide, note, onSave }: NoteModalProps) => {
  const { user: currentUser } = useAuth();
  const [allTags, setAllTags] = useState<ITag[]>([]);
  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<NoteInput>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
      visibleTo: [],
    },
  });

  const watchedTags = watch("tags");
  const watchedVisibleTo = watch("visibleTo");
  const watchedContent = watch("content");

  const fetchInitialData = useCallback(async () => {
    try {
      const [usersResponse, tagsResponse] = await Promise.all([
        getUsers(0, 1000),
        tagService.getTags(),
      ]);
      setAllUsers(usersResponse.content);
      setAllTags(tagsResponse);

      if (note) {
        reset({
          title: note.title,
          content: note.content,
          tags: note.tags.filter(Boolean).map((t: any) => typeof t === 'string' ? t : t._id),
          visibleTo: note.visibleTo.filter(Boolean).map((u: any) => typeof u === 'string' ? u : u._id),
        });
      } else {
        reset({
          title: "",
          content: "",
          tags: [],
          visibleTo: usersResponse.content.map((u: IUser) => u._id),
        });
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  }, [note, reset]);

  useEffect(() => {
    if (show) {
      fetchInitialData();
    }
  }, [show, fetchInitialData]);

  const onFormSubmit: SubmitHandler<NoteInput> = async (data) => {
    try {
      setIsSaving(true);
      if (note) {
        await noteService.updateNote(note._id, data);
      } else {
        await noteService.createNote(data);
      }
      onSave();
      onHide();
    } catch (error: any) {
      const msg = error.response?.data?.message || "Error al guardar la nota.";
      Swal.fire("Error", msg, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUserVisibilityChange = (userId: string) => {
    if (currentUser && userId === currentUser._id) return;
    const currentVisibleTo = watchedVisibleTo || [];
    const newValue = currentVisibleTo.includes(userId)
      ? currentVisibleTo.filter((id) => id !== userId)
      : [...currentVisibleTo, userId];
    setValue("visibleTo", newValue);
  };

  const handleTagToggle = (tagId: string) => {
    const currentTags = watchedTags || [];
    const newValue = currentTags.includes(tagId)
      ? currentTags.filter((id) => id !== tagId)
      : [...currentTags, tagId];
    setValue("tags", newValue);
  };

  const handleCreateTag = async () => {
    if (newTagName.trim() === "") return;
    try {
      const newTag = await tagService.createTag({ name: newTagName });
      setAllTags((prev) => [...prev, newTag]);
      handleTagToggle(newTag._id);
      setNewTagName("");
    } catch (error) {
      Swal.fire("Error", "No se pudo crear la etiqueta.", "error");
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>{note ? "Editar Nota" : "Crear Nota"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onFormSubmit) as any}>
          <Row>
            <Col md={7}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Título</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Escribí un título claro y corto..."
                  isInvalid={!!errors.title}
                  {...register("title")}
                  autoFocus
                />
                {errors.title && (
                  <Form.Control.Feedback type="invalid">
                    {errors.title.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Contenido</Form.Label>
                <div className={`border rounded ${errors.content ? 'border-danger' : ''}`} style={{ minHeight: 200 }}>
                  <ReactQuill
                    theme="snow"
                    value={watchedContent}
                    onChange={(val) => setValue("content", val)}
                    style={{ height: 170 }}
                  />
                </div>
                {errors.content && (
                  <div className="text-danger small mt-1">{errors.content.message}</div>
                )}
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
                      id={`user-${user._id}`}
                      label={
                        user.name +
                        (currentUser?._id === user._id ? " (Vos)" : "")
                      }
                      checked={watchedVisibleTo?.includes(user._id)}
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
                    const isSelected = watchedTags?.includes(tag._id);
                    return (
                      <Button
                        key={tag._id}
                        size="sm"
                        variant={isSelected ? "primary" : "outline-secondary"}
                        onClick={() => handleTagToggle(tag._id)}
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
        <Button 
          variant="primary" 
          onClick={handleSubmit(onFormSubmit) as any} 
          disabled={isSaving}
        >
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
