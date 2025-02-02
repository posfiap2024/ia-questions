type User = {
  id: number;
  username: string;
  password?: string;
  role: {
    id: number;
    name: string;
  };
}
