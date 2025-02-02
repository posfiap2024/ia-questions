async function findUser(params: { id?: number, username?: string }): Promise<User | undefined> {
  const { id, username } = params

  if (!id && !username) throw new Error('id or username is required')

  const db = useDatabase()

  const statement = db.prepare(`
    SELECT u.id, u.username, u.password, r.id as role_id, r.name as role_name
    FROM users as u
    INNER JOIN roles as r ON u.role_id = r.id
    WHERE ${id ? `u.id = ?` : `u.username = ?`}
  `).bind(id ? id : username)

  const user = await statement.get() as UserDTO | undefined

  if (!user) {
    return undefined
  }

  return {
    id: user.id,
    username: user.username,
    password: user.password,
    role: {
      id: user.role_id,
      name: user.role_name,
    }
  }
}

export function useDb() {
  return { findUser }
}

type UserDTO = {
  id: number,
  username: string,
  password: string,
  role_id: number,
  role_name: string,
}
