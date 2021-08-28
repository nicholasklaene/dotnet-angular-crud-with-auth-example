export interface ITodo {
  todoId: number;
  description: string;
  complete: boolean;
  userId: number;
  user?: IUser | null;
}

export interface IUser {
  userId: number;
  username: string;
}
