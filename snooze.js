// SNOOZE
// Move archived threads back to the inbox after a specified number of days.
// Based on sample code from the Gmail Blog
// http://gmailblog.blogspot.com/2011/07/gmail-snooze-with-apps-script.html

var SNOOZE = "[Snooze]"          // Top-level name for snooze labels
var UNSNOOZE = "[Unsnoozed]"     // Label to apply to unsnoozed threads
var MARK_UNREAD = true;          // If true, mark thread as unread when returning to inbox
var ADD_UNSNOOZED_LABEL = false; // If true, add the UNSNOOZE label when returning to inbox
var MAX_SNOOZE=14                // Maximum snooze length in days

function getLabelName(i) {
  return SNOOZE+"/"+i+" days";
}

function init() {
  // Create the labels we’ll need for snoozing
  GmailApp.createLabel(SNOOZE);
  for (var i = 1; i <= MAX_SNOOZE; ++i) {
    GmailApp.createLabel(getLabelName(i));
  }
  if (ADD_UNSNOOZED_LABEL) {
    GmailApp.createLabel(UNSNOOZE);
  }
}

function moveSnoozes() {
  // Schedule this function to run automatically ONCE PER DAY.

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
            GmailApp.getUserLabelByName(UNSNOOZE)
              .addToThreads(page);
          }
        }
        // Move the threads out of "yesterday’s" label
        oldLabel.removeFromThreads(page);
      }
    }
  }
}
