import { z } from "zod";

export const noteSchema = z.object({
  title: z.string().min(1, "El título es requerido").max(100, "El título es demasiado largo"),
  content: z.string().min(1, "El contenido es requerido"),
  tags: z.array(z.string()),
  visibleTo: z.array(z.string()),
});

export type NoteInput = z.infer<typeof noteSchema>;
