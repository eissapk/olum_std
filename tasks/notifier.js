import notifier from "node-notifier";
import path from "path";
import fs from "fs";

const notification = taskName => {
  const name = taskName + " task is done";
  const icon = path.resolve(__dirname, "../public/logo.png");
  notifier.notify(
    {
      title: "Pkjs Notification",
      message: name,
      icon: fs.existsSync(icon) ? icon : null,
      sound: true, // Only Notification Center or Windows Toasters
      wait: true, // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
    },
    function (err, response, metadata) {
      // Response is response from notification
      // Metadata contains activationType, activationAt, deliveredAt
    }
  );

  notifier.on("click", function (notifierObject, options, event) {
    // Triggers if `wait: true` and user clicks notification
  });

  notifier.on("timeout", function (notifierObject, options) {
    // Triggers if `wait: true` and notification closes
  });
};
export default notification;
