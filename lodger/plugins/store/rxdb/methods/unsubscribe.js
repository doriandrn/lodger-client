/**
 * Sterge subscriberii de DB cand se demonteaza
 * @param {*} subs - obiectul cu subscriberi
 */
const unsubscribeDBsubscribers = subs => async ({ type }) => {
  if (type !== 'DESTROYMAIN') return
  debug('subscriberii la destrymain', subs)
  // TODO: nu e ok, trebuie luata fiecare cheie si apelat .unsubsribe() si dupa sters
  subs = {}
}

export default unsubscribeDBsubscribers
