import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import NoteList from './NoteList';
import NoteModal from './NoteModal';
import tagService from '../../services/tagService';
import { INote, ITag } from '../../types';
import { useDeleteNoteMutation } from '../../hooks/useNotes';
import { useQueryClient } from '@tanstack/react-query';

const NotesPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState<INote | null>(null);
  const [tags, setTags] = useState<ITag[]>([]);
  const [selectedTag, setSelectedTag] = useState('');
  
  const queryClient = useQueryClient();
  const deleteMutation = useDeleteNoteMutation();

  useEffect(() => {
    const fetchTags = async () => {
      const fetchedTags = await tagService.getTags();
      setTags(fetchedTags);
    };
    fetchTags();
  }, []);

  const handleShowModal = (note: INote | null = null) => {
    setEditingNote(note);
    setShowModal(true);
  };

  const handleHideModal = () => {
    setShowModal(false);
    setEditingNote(null);
  };

  const refreshNotes = () => {
    queryClient.invalidateQueries({ queryKey: ['notes'] });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta nota?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Notas</h1>
        <Button variant="primary" onClick={() => handleShowModal()}>
          Crear Nota
        </Button>
      </div>

      <Form.Group className="mb-3">
        <Form.Label>Filtrar por etiqueta</Form.Label>
        <Form.Select value={selectedTag} onChange={e => setSelectedTag(e.target.value)}>
          <option value="">Todas</option>
          {tags.map((tag: ITag) => (
            <option key={tag._id} value={tag._id}>{tag.name}</option>
          ))}
        </Form.Select>
      </Form.Group>
      
      <NoteList onEdit={handleShowModal} onDelete={handleDelete} selectedTag={selectedTag} />

      {showModal && (
        <NoteModal 
          show={showModal} 
          onHide={handleHideModal} 
          note={editingNote} 
          onSave={refreshNotes} 
        />
      )}
    </div>
  );
};

export default NotesPage;