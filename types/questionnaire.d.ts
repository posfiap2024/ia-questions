type Questionnaire = {
  id?: number,
  subject: string
  topic: string
  questions?: Question[]
}

type Question = OpenQuestion | ClosedQuestion

type OpenQuestion = {
  id?: number,
  type: 'open'
  statement: string
  answer: string
}

type ClosedQuestion = {
  id?: number,
  type: 'closed'
  statement: string
  options: Option[]
}

type Option = {
  text: string
  correct: boolean
}
