import { JOURNAL_ADD, JOURNAL_DELETE, JOURNAL_DELETE_ALL } from '../constants';


export const addJournal = (id, date, title, content) => {
return {
type: JOURNAL_ADD,
payload: {
    id,
    date, 
    title,
    content
  }
}
}
export const deleteJournal = id => {
    return {
    type: JOURNAL_DELETE,
    payload: { id }
    }
}
export const deleteJournalAll = () => {
  return {
  type: JOURNAL_DELETE_ALL,
  payload: {}
  }
}
