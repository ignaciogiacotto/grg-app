export interface ITag {
  _id: string;
  name: string;
}

export interface IUser {
  _id: string;
  name: string;
  // Add other user properties if needed
}

export interface INote {
  _id: string;
  title: string;
  content: string;
  creator: IUser;
  tags: ITag[];
  visibleTo: IUser[];
  createdAt: string;
  updatedAt: string;
}
