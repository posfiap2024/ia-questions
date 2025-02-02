import bcrypt from 'bcryptjs'
import { consola } from 'consola'

export default defineNitroPlugin(async () => {
  const db = useDatabase()

  const users = [
    { username: 'admin', password: 'admin', role: 'admin' },
    { username: 'professor', password: 'professor', role: 'professor' },
    { username: 'student', password: 'student', role: 'student' },
  ]

  consola.start('Setting up local database')

  // DROP TABLES
  await db.sql`DROP TABLE IF EXISTS students_questionnaires`
  await db.sql`DROP TABLE IF EXISTS questionnaires`
  await db.sql`DROP TABLE IF EXISTS users`
  await db.sql`DROP TABLE IF EXISTS roles`

  // Create and fill table for roles
  await db.sql`
    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `

  await db.sql`INSERT INTO roles (name) VALUES ('admin')`
  await db.sql`INSERT INTO roles (name) VALUES ('professor')`
  await db.sql`INSERT INTO roles (name) VALUES ('student')`

  consola.info('Roles created')

  // Create and fill table for users
  await db.sql`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      password TEXT NOT NULL,
      role_id INTEGER NOT NULL,
      FOREIGN KEY (role_id) REFERENCES roles(id)
    )
  `

  await Promise.all(
    users.map(async (user) => {
      const password = await bcrypt.hash(user.password, 8)
      await db.sql`
        INSERT INTO users (username, password, role_id)
        VALUES (${user.username}, ${password}, (SELECT id FROM roles WHERE name = ${user.role}))
      `
    })
  )

  consola.info('Users created')

  // Create and fill table for questionnaires
  await db.sql`
    CREATE TABLE IF NOT EXISTS questionnaires (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject TEXT NOT NULL,
      topic TEXT NOT NULL,
      owner_id INTEGER NOT NULL,
      FOREIGN KEY (owner_id) REFERENCES users(id)
    )
  `

  await db.sql`INSERT INTO questionnaires (subject, topic, owner_id) VALUES ('Matemática', 'Algebra', (SELECT id FROM users WHERE username = 'admin'))`
  await db.sql`INSERT INTO questionnaires (subject, topic, owner_id) VALUES ('História', 'Segunda Guerra Mundial', (SELECT id FROM users WHERE username = 'professor'))`

  consola.info('Questionnaires created')

  // Create and fill table for students_questionnaires

  await db.sql`
    CREATE TABLE IF NOT EXISTS students_questionnaires (
      student_id INTEGER NOT NULL,
      questionnaire_id INTEGER NOT NULL,
      PRIMARY KEY (student_id, questionnaire_id),
      FOREIGN KEY (student_id) REFERENCES users(id),
      FOREIGN KEY (questionnaire_id) REFERENCES questionnaires(id)
    )
  `

  await db.sql`INSERT INTO students_questionnaires (student_id, questionnaire_id) VALUES ((SELECT id FROM users WHERE username = 'student'), (SELECT id FROM questionnaires WHERE subject = 'Matemática'))`
  await db.sql`INSERT INTO students_questionnaires (student_id, questionnaire_id) VALUES ((SELECT id FROM users WHERE username = 'student'), (SELECT id FROM questionnaires WHERE subject = 'História'))`

  consola.info('Students questionnaires created')

  consola.success('Local database setup complete')
})
