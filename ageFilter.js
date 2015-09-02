// AGE FILTER
// Mark as read, archive, or delete threads based on a label and specified age.
// Starring an email will override these automatic rules.
// Threads will never be deleted from your inbox.

BATCHSIZE = 100

function filterCaller() {
  // Schedule this function to run automatically.

  // Define your filter rules here.
  ArchiveThreads('Alerts', '2d')
  ReadThreads('Alerts', '7d')
  DeleteThreads('Alerts', '14d')

  ArchiveThreads('Newsletters','7d')
  DeleteThreads('Newsletters','30d')

  ArchiveThreads('Commits', '1h')
  ReadThreads('Commits', '24h')
  DeleteThreads('Commits', '30d')

  ArchiveThreads('PagerDuty', '7d')
  ReadThreads('PagerDuty', '7d')
  DeleteThreads('PagerDuty', '30d')

  Logger.log("All tasks complete.")
}

function ReadThreads(Label, Age) {
  Logger.log("Marking as read threads labeled '"+Label+"' older than "+Age+".")
  var query = 'label:'+Label+' older_than:'+Age+' is:unread -is:starred'
  var threads = GmailApp.search(query)
  for (j = 0; j < threads.length; j+=BATCHSIZE) {
    GmailApp.markThreadsRead(threads.slice(j, j+BATCHSIZE));
  }
  Logger.log(threads.length+" threads marked.")
}

function ArchiveThreads(Label, Age) {
  Logger.log("Archiving threads labeled '"+Label+"' older than "+Age+".")
  var query = 'label:'+Label+' older_than:'+Age+' in:inbox -is:starred'
  var threads = GmailApp.search(query)
  for (j = 0; j < threads.length; j+=BATCHSIZE) {
    GmailApp.moveThreadsToArchive(threads.slice(j, j+BATCHSIZE))
  }
  Logger.log(threads.length+" threads archived.")
}

function DeleteThreads(Label, Age) {
  Logger.log("Moving to trash threads labeled '"+Label+"' older than "+Age+".")
  var query = 'label:'+Label+' older_than:'+Age+' -in:inbox -is:starred'
  var threads = GmailApp.search(query)
  for (j = 0; j < threads.length; j+=BATCHSIZE) {
    GmailApp.moveThreadsToTrash(threads.slice(j, j+BATCHSIZE))
  }
  Logger.log(threads.length+" threads trashed.")
}