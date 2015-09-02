// FORWARDER
// Forward messages based on a label, without having to confirm ownership of the target address.
// This is useful for things like expense reporting, where you don't own the auto-report address.

// TODO: Find a better way to handle threads. For now, we're simply forwarding the last message.
// TODO: Labels apply to an entire thread. Find a way to handle the case of new messages on a thread
// that we want to fwd. Maybe only forward out of the inbox... Or check for a sent message that matches?

FORWARDED = 'Forwarded'

function forwarder(){
    // Schedule this function to run automatically.

    // Ensure that the forwarded label exists
    GmailApp.createLabel(FORWARDED)

    // Make your calls to forwardMessage here.
    forwardMessage('Expense', 'receipts@concur.com')
}

function forwardMessage(Label, Address) {
  var query = 'label:'+Label+' -label:'+FORWARDED
  var threads = GmailApp.search(query)
  for (j = 0; j < threads.length; j++) {
    count = threads[j].getMessageCount()
    threads[j].getMessages()[count - 1].forward(Address)
    threads[j].addLabel(FORWARDED)
  }
}
