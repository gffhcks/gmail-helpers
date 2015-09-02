// SNOOZE
// Move archived threads back to the inbox after a specified number of days.
// Based on sample code from the Gmail Blog
// http://gmailblog.blogspot.com/2011/07/gmail-snooze-with-apps-script.html

var MARK_UNREAD = false;
var ADD_UNSNOOZED_LABEL = true;
var MAX_SNOOZE=14

function getLabelName(i) {
  return "Snooze/Snooze " + i + " days";
}

function init() {
  // Create the labels we’ll need for snoozing
  GmailApp.createLabel("Snooze");
  for (var i = 1; i <= MAX_SNOOZE; ++i) {
    GmailApp.createLabel(getLabelName(i));
  }
  if (ADD_UNSNOOZED_LABEL) {
    GmailApp.createLabel("Unsnoozed");
  }
}

function moveSnoozes() {
  // Schedule this function to run automatically.

  init()
  var oldLabel, newLabel, page;
  for (var i = 1; i <= MAX_SNOOZE; ++i) {
    newLabel = oldLabel;
    oldLabel = GmailApp.getUserLabelByName(getLabelName(i));
    page = null;
    // Get threads in "pages" of 100 at a time
    while(!page || page.length == 100) {
      page = oldLabel.getThreads(0, 100);
      if (page.length > 0) {
        if (newLabel) {
          // Move the threads into "today’s" label
          newLabel.addToThreads(page);
        } else {
          // Unless it’s time to unsnooze it
          GmailApp.moveThreadsToInbox(page);
          if (MARK_UNREAD) {
            GmailApp.markThreadsUnread(page);
          }
          if (ADD_UNSNOOZED_LABEL) {
            GmailApp.getUserLabelByName("Unsnoozed")
              .addToThreads(page);
          }
        }
        // Move the threads out of "yesterday’s" label
        oldLabel.removeFromThreads(page);
      }
    }
  }
}