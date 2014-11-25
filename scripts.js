BATCHSIZE = 100
FORWARDED = '[Helpers]/Forwarded'

function init() {
  GmailApp.createLabel("[Helpers]")
  GmailApp.createLabel("[Helpers]/[Snooze]")
  GmailApp.createLabel("[Helpers]/[Snooze]/1 hour")
  GmailApp.createLabel("[Helpers]/[Snooze]/12 hours")
  GmailApp.createLabel("[Helpers]/[Snooze]/1 day")
  GmailApp.createLabel("[Helpers]/[Snooze]/1 week")
  GmailApp.createLabel("[Helpers]/[Snooze]/1 month")
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

// Email Snooze
// Apply a 'snooze' label to a thread and it will be automatically taken out of your inbox, then thrown back in when the time has passed.

// GmailApp.getUserLabels
// GmailLabel.getName()
// GmailLabel.getThreads()
// http://www.w3schools.com/jsref/jsref_obj_regexp.asp
//  define the pattern: var patt = /w3schools/i
// test the pattern: patt.test(string) returns true or false


function CalculateSnoozes(){
// Search for the Snooze tag in the archive.
// In that search, find any of the threads labeled with relative age labels.
// Get the current time, add the timespan to the current time.
// Add a new absolute time label, creating it if necessary.
// Remove the relative time label.
}

function ArchiveSnoozes(){
// Find any threads labeled with a tag matching [Snooze].
// Tag with the top level '[snooze]'.
// Run "moveThreadsToArchive()" on them.

}

function RestoreSnoozes(){
// Get all tags that are under Snooze and match an ISO date regex.
// Check the name agains the current date.
// If the date has passed, run a search for all of the messages with that label, and move to Inbox.
// Remove the Snooze and the relative date tags.
}

function WipeSnoozes(){
// Get all tags under Snooze that match a date regex.
// Search on them. If there are zero messages tagged, delete the label.
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

function forwardMessage(Label, Address) {
  var query = 'label:'+Label+' -label:[Helpers]/Forwarded'
  var threads = GmailApp.search(query)
  for (j = 0; j < threads.length; j++) {
    messages = threads[j].getMessages()
    for (k = 0; k < messages.length; k++) {
      messages[j].forward(Address)
    }
    threads[j].addLabel(FORWARDED)
  }
}
