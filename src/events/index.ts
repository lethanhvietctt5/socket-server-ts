const EVENTS = {
  connection: "connection",
  join_app: "join_app", // When user join app
  list_online_user: "list_online_user", // Send online user to new user
  send_message: "send_message", // Send message both for invidual and group
  recieve_message: "recieve_message", // Recieve message both for invidual and group
  add_new_member: "add_new_member", // Add new member to group
  is_added_to_group: "is_added_to_group", // Check if user is added to group
  join_group: "join_group", // Join group when is added to group
  leave_group: "leave_group", // Member leave group
  add_contact: "add_contact", // Add new contact
  is_added_contact: "is_added_contact", // Check if user is added to contact
  remove_contact: "remove_contact", // Remove contact
  is_removed_contact: "is_removed_contact", // Check if user is removed from contact
  accept_contact: "accept_contact", // Accept contact
  is_accepted_contact: "is_accepted_contact", // Check if user is accepted contact
  disconnect: "disconnect",
};

export default EVENTS;
