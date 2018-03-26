export const traverse = function (o, fn) {
  for (let i in o) {
    fn.apply(this, [i, o[i]])  
    if (o[i] !== null && typeof(o[i]) === "object") traverse(o[i], fn)
  }
}

export const trm = str => str.replace('$', '')

export const spleet = str => {
  const split = String(str).split('/')

  return {
    what: split[0],
    mutation: split[1]
  }
}
