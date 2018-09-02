export const actions = {
  trimite: ({ $axios, debug }, data) => {
    const issue = {
      title: data.subiect || 'Test',
      labels: [`${data.tip}`],
      assignee: 'doriandrn',
      body: `
### Descriere
${data.mesaj} (${data.topic})`
    }

    $axios.$post('https://api.github.com/repos/doriandrn/ui/issues', issue, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: 'token 8df7d1f0fcb5ec784664fbdd5a24eadb12a73daf'
      }
    })
    .then(res => {
      if (res.status === 201) {
        this.debug('gh:api', res)
        // this.sent = true
        // this.gitRes.number = res.data.number
        // this.gitRes.url = res.data.html_url
      }
    })
    .catch(e => {
      // this.attempted = false
      // this.gitErrors.push(e)
    })
  }
}
