BATCHSIZE = 100
FORWARDED = '[Helpers]/Forwarded'

function init() {
  GmailApp.createLabel(FORWARDED)
}

function filterTester() {
 ArchiveThreads('PagerDuty', '168h')
}

function filterCaller() {
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

function forwarder() {
  init()
  forwardMessage('Expense', 'receipts@concur.com')
}

// INBOX MAINTENANCE
// Mark as read, archive, or delete threads based on a label.
// Starring an email will override these automatic rules.
// Threads will never be deleted from your inbox.

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


// FORWARDER
// Forward messages based on a label, without having to confirm ownership of the target address.
// This is useful for things like expense reporting, where you don't own the auto-report address.
// TODO: Find a better way to handle threads.
// It probably makes more sense to just send the latest message instead of all of them.
// TODO: Labels apply to an entire thread. Find a way to handle the case of new messages on a thread
// that we want to fwd. Maybe only forward out of the inbox... Or check for a sent message that matches?

function forwardMessage(Label, Address) {
  var query = 'label:'+Label+' -label:'+FORWARDED
  var threads = GmailApp.search(query)
  for (j = 0; j < threads.length; j++) {
    messages = threads[j].getMessages()
    for (k = 0; k < messages.length; k++) {
      messages[j].forward(Address)
    }
    threads[j].addLabel(FORWARDED)
  }
}
