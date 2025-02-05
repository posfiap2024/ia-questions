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
  await db.sql`DROP TABLE IF EXISTS question_options`
  await db.sql`DROP TABLE IF EXISTS questions`
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

  await db.sql`
    INSERT INTO questionnaires (subject, topic, owner_id)
    VALUES ('Matemática', 'Algebra', (SELECT id FROM users WHERE username = 'professor'))
  `

  consola.info('Questionnaires created')

  // Create and fill table for questions
  await db.sql`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      questionnaire_id INTEGER NOT NULL,
      statement TEXT NOT NULL,
      type TEXT NOT NULL,
      answer TEXT,
      FOREIGN KEY (questionnaire_id) REFERENCES questionnaires(id)
    )
  `

  await db.sql`
    INSERT INTO questions (questionnaire_id, statement, type, answer)
    VALUES
      (1, 'Qual é o resultado de 2 + 2?', 'closed', null),
      (1, 'Qual é o resultado de 2 * 2?', 'closed', null),
      (1, 'Qual é o resultado de 2 - 2?', 'closed', null),
      (1, 'Qual é o resultado de 2 / 2?', 'closed', null),
      (1, 'Qual é o resultado de 2 ^ 2?', 'open', 'É esperado que o aluno responda 4.');
  `

  consola.info('Questions created')

  // Create and fill table for question_options

  await db.sql`
    CREATE TABLE IF NOT EXISTS question_options (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question_id INTEGER NOT NULL,
      option TEXT NOT NULL,
      correct BOOLEAN NOT NULL,
      FOREIGN KEY (question_id) REFERENCES questions(id)
    )
  `

  await db.sql`
    INSERT INTO question_options (question_id, option, correct)
    VALUES
      (1, '4', 1),
      (1, '5', 0),
      (1, '6', 0),
      (1, '7', 0),
      (2, '4', 1),
      (2, '5', 0),
      (2, '6', 0),
      (2, '7', 0),
      (3, '4', 0),
      (3, '5', 0),
      (3, '6', 0),
      (3, '7', 1),
      (4, '4', 0),
      (4, '5', 0),
      (4, '6', 1),
      (4, '7', 0);
  `

  consola.info('Question options created')

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

  await db.sql`
    INSERT INTO students_questionnaires (student_id, questionnaire_id)
    SELECT id, 1
    FROM users
    WHERE role_id = (SELECT id FROM roles WHERE name = 'student');
  `

  consola.info('Students questionnaires created')

  consola.success('Local database setup complete')
})
