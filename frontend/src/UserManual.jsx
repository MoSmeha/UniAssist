import React from "react";
import { Container, Typography, Paper, Box, Divider } from "@mui/material";

export default function UserManual() {
  return (
    <Container maxWidth={false} disableGutters sx={{ py: 0 }}>
      <Paper
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          bgcolor: "transparent",
          boxShadow: "none",
        }}
      >
        <Typography variant="h3" gutterBottom sx={{ textAlign: "left" }}>
          UniAssit User Manual
        </Typography>

        <Typography
          variant="body2"
          sx={{ textAlign: "left", mb: 2, color: "grey" }}
        >
          Version 1.0
          <br />
          Last Updated: September 14, 2025
        </Typography>

        <Divider
          sx={{
            mb: 4,
            height: "2px",
            backgroundColor: "primary.main",
            width: "100%",
          }}
        />

        <Box
          sx={{
            "& h2, & h3, & h4, & h5, & h6": {
              mt: 4,
              mb: 2,
              color: "primary.main",
              textAlign: "left",
            },
            "& p, & ul": { mb: 1.5, textAlign: "left" },
            "& li": { mb: 0.5 },
          }}
        >
          <Typography variant="h4" component="h2">
            Homepage
          </Typography>
          <Typography>
            The homepage highlights the app’s main features and gives users a
            simple way to contact the admin. A Contact Us button opens a form
            where users enter a title, description, and choose a category (Bug,
            Feature request, Help, Feedback, Other). Submitted messages are
            received by the admin.
          </Typography>

          <Typography variant="h6" component="h3">
            Contact Form Fields
          </Typography>
          <Typography component="ul">
            <li>Title (text)</li>
            <li>Description (text)</li>
            <li>Category: Bug / Feature request / Help / Feedback / Other</li>
          </Typography>

          <Divider
            sx={{
              my: 3,
              height: "2px",
              backgroundColor: "primary.main",
              width: "100%",
            }}
          />

          <Typography variant="h4" component="h2">
            Chat
          </Typography>
          <Typography>
            The chat page lists users with their profile picture, first and last
            name, role, and department. A search bar at the top lets you find
            users by name. Online users show a green dot at the bottom-right of
            their profile picture.
          </Typography>

          <Typography>
            When someone sends a message, their name moves to the top of the
            list and a red circle at the far right of the row shows the unread
            count. Opening a conversation and then leaving it marks those
            messages as read and removes the red badge, similar to Discord. The
            total unread message count appears in the left panel next to the
            Chat tab.
          </Typography>
          <Typography>
            Messages are not sent as notifications by default. If a message
            includes the exact token <strong>@important</strong>, that message
            is also shown as a notification to the recipient; the notification
            contains the first 35 characters of the message.
          </Typography>

          <Divider
            sx={{
              my: 3,
              height: "2px",
              backgroundColor: "primary.main",
              width: "100%",
            }}
          />

          <Typography variant="h4" component="h2">
            Staff List
          </Typography>
          <Typography>
            This page shows only users with the admin or teacher role (students
            are filtered out). Each staff entry displays email, department,
            role, and schedule. A search bar at the top lets users search staff.
          </Typography>

          <Typography variant="h6" component="h3">
            Displayed Properties
          </Typography>
          <Typography component="ul">
            <li>Email</li>
            <li>Department</li>
            <li>Role</li>
            <li>Schedule</li>
          </Typography>

          <Divider
            sx={{
              my: 3,
              height: "2px",
              backgroundColor: "primary.main",
              width: "100%",
            }}
          />

          <Typography variant="h4" component="h2">
            Lost & Found
          </Typography>
          <Typography>
            Users can report lost or found items using the button at the top. A
            form collects title, description, category, type (Lost or Found),
            location, phone number, and an image. After posting, the item
            appears as a card showing the filled-in fields plus the poster’s
            first and last name and profile picture.
          </Typography>

          <Typography variant="h6" component="h3">
            Available Actions
          </Typography>
          <Typography component="ul">
            <li>
              <strong>Poster actions:</strong>
              <ul>
                <li>Mark as resolved — adds a “resolved” flair to the card</li>
                <li>Delete — removes the card</li>
              </ul>
            </li>
            <li>
              <strong>Other users:</strong> Notify button sends a notification
              to the poster. If the item was posted as Found, the notification
              text is:
              <Typography
                component="div"
                sx={{
                  fontFamily: "monospace",
                  bgcolor: "action.hover",
                  p: 1,
                  my: 1,
                  borderRadius: 1,
                  border: 1,
                  borderColor: "divider",
                  textAlign: "left",
                }}
              >
                hey {"{"}itemname{"}"} is my item, text me!
              </Typography>
              If the item was posted as Lost, the notification text is:
              <Typography
                component="div"
                sx={{
                  fontFamily: "monospace",
                  bgcolor: "action.hover",
                  p: 1,
                  my: 1,
                  borderRadius: 1,
                  border: 1,
                  borderColor: "divider",
                  textAlign: "left",
                }}
              >
                hey i found {"{"}itemname{"}"} , text me!
              </Typography>
            </li>
          </Typography>

          <Typography variant="h6" component="h3">
            Filters Available
          </Typography>
          <Typography component="ul">
            <li>Type (Lost / Found)</li>
            <li>
              Category (Electronics, Books, Clothing, ID cards/keys, Other)
            </li>
            <li>Status</li>
          </Typography>

          <Divider
            sx={{
              my: 3,
              height: "2px",
              backgroundColor: "primary.main",
              width: "100%",
            }}
          />

          <Typography variant="h4" component="h2">
            Appointments
          </Typography>
          <Typography>
            Students (or admins for testing) can create appointments with
            teachers by clicking the button at the top. The form requires the
            teacher (dropdown), duration (15, 30, 60 minutes), start time, and
            an appointment reason. After submission the system checks for
            conflicts; if the teacher already has an appointment at that time
            the system returns an error:
            <Typography
              component="div"
              sx={{
                fontFamily: "monospace",
                bgcolor: "action.hover",
                p: 2,
                my: 2,
                borderRadius: 1,
                border: 1,
                borderColor: "divider",
                textAlign: "left",
              }}
            >
              teacherName already has appointment in this time
            </Typography>
            If no conflict exists, the appointment is created and the teacher
            receives a notification.
          </Typography>

          <Typography>
            The teacher can accept or reject the request. If they reject, a
            dialog opens asking for a reason; the teacher may leave it empty or
            provide one. Either outcome notifies the student and updates the
            appointment card. If the teacher accepts, the system user sends a
            reminder one hour before the appointment to both parties.
          </Typography>

          <Divider
            sx={{
              my: 3,
              height: "2px",
              backgroundColor: "primary.main",
              width: "100%",
            }}
          />

          <Typography variant="h4" component="h2">
            Schedule
          </Typography>
          <Typography>
            A responsive page that displays the user’s schedule. (Layout adapts
            to screen size and shows the schedule for the user.)
          </Typography>

          <Divider
            sx={{
              my: 3,
              height: "2px",
              backgroundColor: "primary.main",
              width: "100%",
            }}
          />

          <Typography variant="h4" component="h2">
            Announcements
          </Typography>
          <Typography>
            Only teachers and admins can post announcements via the button at
            the top. The form asks for title, content, category (Exam, Event,
            Makeup session, Other), and announcement type. Choosing
            Major-specific opens a field to select the major. Choosing
            Subject-specific opens a field to select subjects.
          </Typography>

          <Typography variant="h6" component="h3">
            Delivery Rules
          </Typography>
          <Typography component="ul">
            <li>
              <strong>Major-specific:</strong> send to all students in the
              selected major, even if they do not share subjects.
            </li>
            <li>
              <strong>Subject-specific:</strong> send to all students who have
              the selected subject in their schedule, even if they are in
              different majors.
            </li>
          </Typography>

          <Typography>
            Users receive a notification containing the announcement category
            and title. Announcements can be searched and filtered by category
            using the top bar.
          </Typography>

          <Divider
            sx={{
              my: 3,
              height: "2px",
              backgroundColor: "primary.main",
              width: "100%",
            }}
          />

          <Typography variant="h4" component="h2">
            Cafeteria Menu
          </Typography>
          <Typography>
            The cafeteria page shows what’s offered Monday to Friday. Each meal
            is shown in a card containing the meal name, a picture, calories,
            and protein. Admins have the additional privileges to add, update,
            and delete these cards.
          </Typography>

          <Typography variant="h6" component="h3">
            Card Fields
          </Typography>
          <Typography component="ul">
            <li>Meal name</li>
            <li>Picture</li>
            <li>Calories</li>
            <li>Protein</li>
          </Typography>

          <Divider
            sx={{
              my: 3,
              height: "2px",
              backgroundColor: "primary.main",
              width: "100%",
            }}
          />

          <Typography variant="h4" component="h2">
            Tools
          </Typography>

          <Typography variant="h5" component="h3">
            Checklist
          </Typography>
          <Typography>
            A personal checklist where users create tasks with a title,
            description, priority (Top / Moderate / Low), and a date. Start and
            end times are optional. If start and end times are provided, the
            system user sends a reminder one hour before the end time. Users can
            track unfinished tasks from the top bar and filter by priority.
            Tasks are color-highlighted by priority (Top = red, Medium = orange,
            Low = green). Users can delete and update tasks.
          </Typography>

          <Typography
            variant="h6"
            component="h4"
            sx={{
              color: "text.primary !important",
              mt: 2,
              mb: 1,
              textAlign: "left",
            }}
          >
            Task fields
          </Typography>
          <Typography component="ul">
            <li>Title (required)</li>
            <li>Description (required)</li>
            <li>Priority: Top / Moderate / Low (required)</li>
            <li>Date (required)</li>
            <li>Start time (optional)</li>
            <li>End time (optional)</li>
          </Typography>

          <Typography variant="h5" component="h3">
            AI Chatbot
          </Typography>
          <Typography>
            An AI chatbot for FAQs. Example:
            <Typography
              component="div"
              sx={{
                fontFamily: "monospace",
                bgcolor: "action.hover",
                p: 2,
                my: 2,
                borderRadius: 1,
                border: 1,
                borderColor: "divider",
                textAlign: "left",
              }}
            >
              <strong>Q:</strong> Where is the IT office?
              <br />
              <strong>A:</strong> The IT department is located on the second
              floor, room 203.
            </Typography>
          </Typography>

          <Typography variant="h5" component="h3">
            Note app
          </Typography>
          <Typography>
            A note app similar to Google Keep. When creating a note users
            provide a title and content (required), choose a color
            (Default/Red/Blue/Green/Purple/Yellow), optionally add a tag, and
            may pin the note.
          </Typography>

          <Typography
            variant="h6"
            component="h4"
            sx={{
              color: "text.primary !important",
              mt: 2,
              mb: 1,
              textAlign: "left",
            }}
          >
            Note fields
          </Typography>
          <Typography component="ul">
            <li>Title (required)</li>
            <li>Content (required)</li>
            <li>Color: Default, Red, Blue, Green, Purple, Yellow</li>
            <li>Tag (optional)</li>
            <li>Pin toggle (optional)</li>
          </Typography>

          <Typography variant="h5" component="h3">
            Pomodoro timer
          </Typography>
          <Typography>
            Default cycle: 25 minutes work and 5 minutes break. When a session
            ends it is added to the user’s stats, and a sound plays when a work
            or break period ends or begins. Students earn badges at 5, 20, 50,
            and 100 sessions; badges are exclusive to students while stats are
            tracked for all users.
          </Typography>

          <Divider
            sx={{
              my: 3,
              height: "2px",
              backgroundColor: "primary.main",
              width: "100%",
            }}
          />

          <Typography variant="h4" component="h2">
            Profile
          </Typography>
          <Typography>
            The profile page shows the user’s email, role, ID, department,
            profile picture, pomodoro stats, and schedule. Clicking the profile
            picture allows the user to change it. Profile content can vary by
            role and user-specific properties.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
