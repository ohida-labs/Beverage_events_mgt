# BEGMS - Beverage Guiness Management System

This project is an internal tool for Guiness Corpration and it consumers. It allow registered user to book down for a specific amount order of Guinness drinks

- Gordon
- Guninness Stout
- Malta Guninness

There are various roles that control different tasks.

## Roles

**The Administrative Role**

- View and managing all _users_
- Can View And Manage all Events
- Can View and Manage all Beverages

**The Booking Manager Role**

- Can View Pending, Completed Event.
- Approve and Assign or Reject with Reason.
- Assign Event Listing to A Distributor.

**The Consumer Role**

- Can View And Manage Own Events.
- Can View all Available Beverages.
- Can Create New Event Order
- Can update Pending Event less than 24hrs.

**The Distributor Role**

- Can View And Manage Assigned Events.

## WorkFlow

The _MVP_ has very limited features. Which includes very few re-usable pages shared among this roles;

- **Settings**:  
  This page has four componont which are the `Edit profile`, `Change Password`,
  `Support Information` and `Account Deactivation`. The `Edit Profile` help all the authenticated user to change basic information like _Last name_, _First Name_, _Phone Number_. The `Change Password` component allow authenticated user to change their old password to a new one and they are immmediately logged out. The `Support Information` provides contact information to allow consumer to directly contact the organisation. `Account Deactivation` allow authenticated user explicitly deactivate their account if they do not need it anymore.

- **Events**:  
  This page displays data based on different roles, about the upcoming event and drinks orders created by a consumer. An admin can view all events on the database, Consumer can only view event they created, A booking manager can view all event just like the admin, A distributor can only view only assigned events. All authenticated user can view the single event base on their role permission.

- **Beverage & Landing Page**:  
  This Page shows list of Drinks that the organisation have. This could depend on the role trying to access the list of drinks the route `/beverages` is only available to the administrative of the organisation. The public landing page is very much accessible to anyone and everybody on the internet, the `[site.com]/` fetches and show the available drinks to the public. The admin can create and update any beverages created by them.

- **Dashboard**:  
  This page shows stats and quick action button for authenticated users depending on the role. Available for **Admin** and **Consumer**.

## Features That are not Included in the Current MVP

- A Payment System.
- Notification System for every Events.
- A Live Customer Support Feature.
- Order and Cart Management.
- Internal Chat System Amongst staff.
- Announcement Feed.
- Graph Statistics for administrative role.
